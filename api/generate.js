// Vercel Serverless Function — gọi Claude API (Anthropic) dạng stream.
// - Giữ ANTHROPIC_API_KEY ở server (biến môi trường), KHÔNG lộ ra trình duyệt.
// - Prompt hệ thống được ghép ở server (api/_prompts.js); trình duyệt chỉ gửi
//   thông tin giáo án, nên endpoint này không dùng được để gọi Claude tuỳ ý.
// - Chuyển tiếp từng đoạn chữ về trình duyệt (SSE) để giáo án dài không bị
//   timeout và giao diện hiển thị được tiến độ.
//
// Biến môi trường:
//   ANTHROPIC_API_KEY (bắt buộc)
//   CLAUDE_MODEL      (tuỳ chọn, mặc định bên dưới)

import Anthropic from '@anthropic-ai/sdk';
import { LESSON_SYSTEM_PROMPT, EXTRAS_SYSTEM_PROMPT, LENGTH_GUIDE } from './_prompts.js';

const DEFAULT_MODEL = 'claude-opus-5';
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

function sse(res, obj) {
  res.write(`data: ${JSON.stringify(obj)}\n\n`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return sendJson(res, 500, {
      error: 'Thiếu ANTHROPIC_API_KEY trên server. Vào Vercel → Settings → Environment Variables để thêm.'
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

  const client = new Anthropic();
  // fallbacks: "default" — nếu bộ lọc an toàn của model từ chối, API tự chạy lại
  // yêu cầu trên model dự phòng phù hợp ngay trong cùng lượt gọi.
  const stream = client.beta.messages.stream({
    model: process.env.CLAUDE_MODEL || DEFAULT_MODEL,
    max_tokens: mode === 'lesson' ? 64000 : 16000,
    thinking: { type: 'adaptive' },
    // Soạn giáo án là viết nội dung dài theo khung có sẵn: "medium" đủ chất lượng
    // mà nhanh hơn, giữ thời gian chạy trong giới hạn của Vercel.
    output_config: { effort: mode === 'lesson' ? 'medium' : 'low' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    cache_control: { type: 'ephemeral' },
    system,
    messages: [{ role: 'user', content: userMsg }]
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.on('close', () => stream.abort());

  try {
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse(res, { text: event.delta.text });
      } else if (event.type === 'content_block_start' && event.content_block.type === 'thinking') {
        sse(res, { thinking: true });
      }
    }
    const message = await stream.finalMessage();
    sse(res, { done: true, stop_reason: message.stop_reason });
  } catch (err) {
    let msg = err?.message || String(err);
    if (err instanceof Anthropic.AuthenticationError) msg = 'ANTHROPIC_API_KEY không hợp lệ.';
    else if (err instanceof Anthropic.RateLimitError) msg = 'Claude đang quá tải hoặc hết hạn mức. Vui lòng thử lại sau ít phút.';
    else if (err instanceof Anthropic.APIError && err.status) msg = `Claude API lỗi ${err.status}: ${msg}`;
    sse(res, { error: msg });
  }
  res.end();
}
