import { SYSTEM_PROMPT } from './systemPrompt.js';

/* ============ CALL API ============
   Gọi tới serverless function /api/generate (xem file api/generate.js)
   thay vì gọi trực tiếp Gemini API từ trình duyệt — để không
   lộ GEMINI_API_KEY ra phía client.
*/
export async function generateLessonPlan(payload) {
  const userMsg = `Hãy soạn giáo án STEAM mầm non với thông tin sau:
- Độ tuổi: ${payload.doTuoi}
- Chủ đề: ${payload.chuDe}
- Đề tài: ${payload.deTai}
- Quy trình yêu cầu: ${payload.quyTrinh === 'auto' ? 'Tự động chọn quy trình phù hợp nhất' : payload.quyTrinh}
- Yêu cầu thêm từ giáo viên: ${payload.ghiChu || '(không có)'}

Trả về đúng JSON theo schema đã quy định.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }]
    })
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || errBody?.error || '';
    } catch (_) {}
    throw new Error(`Lỗi kết nối API (${response.status}). ${detail}`);
  }

  const data = await response.json();

  // Định dạng phản hồi của Gemini: data.candidates[0].content.parts[0].text
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Không nhận được nội dung từ AI.');

  let raw = rawText.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      parsed = JSON.parse(m[0]);
    } else {
      throw new Error('Không thể đọc dữ liệu giáo án trả về.');
    }
  }
  return parsed;
}
