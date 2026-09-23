/* ============ CALL API ============
   Gọi tới serverless function /api/generate (api/generate.js).
   Server ghép prompt hệ thống, gọi Claude dạng stream và chuyển tiếp về đây
   theo SSE: {text} từng đoạn chữ, {thinking} khi Claude đang suy nghĩ,
   {done, stop_reason} khi xong, {error} khi lỗi.
*/

async function streamGenerate(mode, payload, onProgress) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, payload })
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || errBody?.error || '';
    } catch (_) {}
    if (response.status === 404) {
      detail = 'Không tìm thấy /api/generate. Hãy chạy bằng "npm run dev" (có file .env chứa ANTHROPIC_API_KEY) hoặc deploy lên Vercel.';
    }
    throw new Error(`Lỗi kết nối API (${response.status}). ${detail}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let stopReason = '';
  let thinking = false;

  const handleEvent = (json) => {
    if (json.error) throw new Error(json.error);
    if (json.thinking) thinking = true;
    if (json.text) text += json.text;
    if (json.done) stopReason = json.stop_reason || '';
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let json;
      try { json = JSON.parse(data); } catch { continue; }
      handleEvent(json);
      onProgress?.(text.length, thinking && !text);
    }
    if (done) break;
  }

  if (!text.trim()) {
    throw new Error(stopReason === 'refusal'
      ? 'AI từ chối nội dung này. Hãy thử diễn đạt lại đề tài.'
      : 'Không nhận được nội dung từ AI.');
  }

  try {
    return parseJson(text);
  } catch (e) {
    if (!stopReason) {
      throw new Error('Kết nối bị ngắt giữa chừng (máy chủ có thể đã hết thời gian chờ). Hãy thử lại hoặc chọn độ dài "Vừa".');
    }
    if (stopReason === 'max_tokens') {
      throw new Error('Giáo án quá dài nên AI bị cắt giữa chừng. Hãy chọn độ dài "Vừa" hoặc "Gọn" rồi thử lại.');
    }
    throw e;
  }
}

function extractFirstJson(text) {
  const start = text.indexOf('{');
  if (start === -1) throw new Error('Không tìm thấy dữ liệu JSON giáo án.');
  let depth = 0, inString = false, escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return text.slice(start, i + 1);
  }
  throw new Error('JSON giáo án chưa hoàn chỉnh.');
}

function parseJson(rawText) {
  const raw = rawText.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(raw);
  } catch (_) {
    return JSON.parse(extractFirstJson(raw));
  }
}

export function generateLessonPlan(payload, onProgress) {
  return streamGenerate('lesson', payload, onProgress);
}

export function generateExtras(plan, onProgress) {
  return streamGenerate('extras', { plan }, onProgress);
}
