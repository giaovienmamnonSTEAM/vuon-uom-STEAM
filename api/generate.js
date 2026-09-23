// Vercel Serverless Function — proxy gọi Google Gemini API (dạng stream).
// - Giữ GEMINI_API_KEY ở server (biến môi trường), KHÔNG lộ ra trình duyệt.
// - Prompt hệ thống được ghép ở server (api/_prompts.js); trình duyệt chỉ gửi
//   thông tin giáo án, nên endpoint này không dùng được làm proxy Gemini tuỳ ý.
// - Trả về luồng SSE của Gemini để giáo án dài không bị timeout và giao diện
//   hiển thị được tiến độ.
//
// Biến môi trường:
//   GEMINI_API_KEY  (bắt buộc)
//   GEMINI_MODEL    (tuỳ chọn, mặc định bên dưới)
//   GEMINI_API_BASE (tuỳ chọn, chỉ dùng khi thử nghiệm với server giả lập)

import { LESSON_SYSTEM_PROMPT, EXTRAS_SYSTEM_PROMPT, LENGTH_GUIDE } from './_prompts.js';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const MAX_FIELD = 6000;

function clip(v, max = 300) {
  return String(v ?? '').slice(0, max).trim();
}

function buildLessonMessage(p) {
  const quyTrinh = {
    auto: 'Tự động chọn 5E hoặc EDP theo đúng nguyên tắc cốt lõi (mục A2)',
    '5E': '5E',
    EDP: 'EDP',
    Project: 'Dự án STEAM (nhiều ngày)'
  }[p.quyTrinh] || 'Tự động chọn';

  const lines = [
    'Hãy soạn giáo án STEAM mầm non với thông tin sau:',
    `- Độ tuổi: ${clip(p.doTuoi)}`,
    `- Lĩnh vực / loại hoạt động: ${clip(p.linhVuc) || 'Tự xác định theo đề tài'}`,
    `- Chủ đề: ${clip(p.chuDe)}`,
    `- Đề tài: ${clip(p.deTai, 500)}`,
    `- Quy trình: ${quyTrinh}`,
    `- Số trẻ: ${clip(p.soTre, 20) || 'Không nêu (tự dự kiến phù hợp)'}`,
    `- Yêu cầu thêm của giáo viên: ${clip(p.ghiChu, 1500) || '(không có)'}`,
    LENGTH_GUIDE[p.doDai] || LENGTH_GUIDE.chi_tiet
  ];
  if (p.giaoAnCu) {
    lines.push(
      '',
      'GIÁO VIÊN GỬI KÈM GIÁO ÁN TRUYỀN THỐNG CẦN CHUYỂN SANG STEAM. Đọc kỹ, phân tích bản chất, đánh giá có phù hợp STEAM không (ghi vào phan_tich), rồi tái thiết kế:',
      '"""',
      clip(p.giaoAnCu, MAX_FIELD),
      '"""'
    );
  }
  lines.push('', 'Trả về đúng JSON theo schema đã quy định.');
  return lines.join('\n');
}

function buildExtrasMessage(p) {
  const plan = JSON.stringify(p.plan ?? {}).slice(0, 60000);
  return `Giáo án STEAM:\n${plan}\n\nHãy soạn tài nguyên hỗ trợ, trả về đúng JSON theo schema.`;
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, {
      error: 'Thiếu GEMINI_API_KEY trên server. Vào Vercel → Settings → Environment Variables để thêm.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const { mode, payload } = body || {};
  if (!payload || (mode !== 'lesson' && mode !== 'extras')) {
    return sendJson(res, 400, { error: 'Yêu cầu không hợp lệ.' });
  }
  if (mode === 'lesson' && (!payload.doTuoi || !payload.chuDe || !payload.deTai)) {
    return sendJson(res, 400, { error: 'Thiếu độ tuổi, chủ đề hoặc đề tài.' });
  }

  const system = mode === 'lesson' ? LESSON_SYSTEM_PROMPT : EXTRAS_SYSTEM_PROMPT;
  const userMsg = mode === 'lesson' ? buildLessonMessage(payload) : buildExtrasMessage(payload);

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const base = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com';
  const url = `${base}/v1beta/models/${model}:streamGenerateContent?alt=sse`;

  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: {
          maxOutputTokens: mode === 'lesson' ? 32768 : 8192,
          temperature: 0.9,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (err) {
    return sendJson(res, 502, { error: 'Không kết nối được Gemini API: ' + (err.message || err) });
  }

  if (!upstream.ok) {
    let detail = '';
    try {
      const data = await upstream.json();
      detail = data?.error?.message || JSON.stringify(data);
    } catch {
      detail = await upstream.text().catch(() => '');
    }
    return sendJson(res, upstream.status, { error: detail || `Gemini trả về lỗi ${upstream.status}` });
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: { message: 'Luồng dữ liệu bị gián đoạn: ' + (err.message || err) } })}\n\n`);
  }
  res.end();
}
