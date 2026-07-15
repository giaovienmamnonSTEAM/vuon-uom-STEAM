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

 function extractFirstJson(text) {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new Error('Không tìm thấy dữ liệu JSON giáo án.');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') depth++;

      if (char === '}') {
        depth--;

        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
    }
  }

  throw new Error('JSON giáo án chưa hoàn chỉnh.');
}

let parsed;

try {
  parsed = JSON.parse(raw);
} catch (e) {
  const jsonText = extractFirstJson(raw);
  parsed = JSON.parse(jsonText);
}

return parsed;
}
