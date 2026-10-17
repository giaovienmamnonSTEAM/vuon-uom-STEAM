// Vercel Serverless Function — gọi Claude API để soạn nội dung.
// - API key nằm trong biến môi trường ANTHROPIC_API_KEY ở máy chủ, KHÔNG lộ ra trình duyệt.
// - Trình duyệt chỉ gửi "loại việc" + thông tin biểu mẫu; prompt được ghép ở máy chủ
//   (api/_lib/prompts.js), nên endpoint không dùng được để gọi AI tuỳ ý.
//
// Biến môi trường:
//   ANTHROPIC_API_KEY  (bắt buộc để bật AI)
//   CLAUDE_MODEL       (tuỳ chọn, mặc định bên dưới)
//   APP_ACCESS_CODE    (tuỳ chọn) — nếu đặt, giáo viên phải nhập đúng mã này trong
//                      "Thiết lập thông tin" mới dùng được AI (tránh người lạ dùng tốn phí)

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, TASKS, buildUserMessage, cleanOutput } from './_lib/prompts.js';

const DEFAULT_MODEL = 'claude-opus-5-5';

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 100_000) throw new Error('too large');
    chunks.push(c);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export { cleanOutput };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Chỉ hỗ trợ phương thức POST.' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return sendJson(res, 503, { error: 'Máy chủ chưa được cấu hình kết nối AI (thiếu ANTHROPIC_API_KEY).', code: 'not_configured' });
  }
  const required = process.env.APP_ACCESS_CODE;
  if (required && req.headers['x-access-code'] !== required) {
    return sendJson(res, 401, { error: 'Mã truy cập AI chưa đúng. Vào "Thiết lập thông tin" để nhập mã nhà trường cung cấp.', code: 'bad_code' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Dữ liệu gửi lên không hợp lệ.' });
  }
  const { task } = body || {};
  if (!TASKS.includes(task)) return sendJson(res, 400, { error: 'Loại nội dung không hợp lệ.' });
  if (task === 'bien-tap' && !String(body.text || '').trim()) return sendJson(res, 400, { error: 'Chưa có văn bản để biên tập.' });

  const userMsg = buildUserMessage({
    task,
    data: body.data || {},
    labels: body.labels || {},
    settings: body.settings || {},
    action: body.action,
    text: body.text,
    variant: Number(body.variant) || 0
  });

  const client = new Anthropic();
  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;

  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 8000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }]
    });

    if (response.stop_reason === 'refusal') {
      return sendJson(res, 422, { error: 'AI không thể soạn nội dung này. Hãy diễn đạt lại thông tin hoặc dùng chế độ soạn theo mẫu.' });
    }
    const text = cleanOutput(
      response.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
    );
    if (!text) return sendJson(res, 502, { error: 'AI không trả về nội dung. Vui lòng thử lại.' });
    return sendJson(res, 200, { text, model: response.model, truncated: response.stop_reason === 'max_tokens' });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return sendJson(res, 500, { error: 'API key trên máy chủ không hợp lệ. Quản trị viên cần kiểm tra ANTHROPIC_API_KEY.' });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return sendJson(res, 429, { error: 'AI đang quá tải hoặc đã hết hạn mức. Vui lòng thử lại sau ít phút.' });
    }
    if (err instanceof Anthropic.APIError) {
      return sendJson(res, 502, { error: `Lỗi từ dịch vụ AI (${err.status ?? 'không rõ'}). Vui lòng thử lại.` });
    }
    return sendJson(res, 502, { error: 'Không kết nối được dịch vụ AI. Vui lòng thử lại.' });
  }
}
