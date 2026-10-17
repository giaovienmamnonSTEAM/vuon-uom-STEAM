// Lớp kết nối AI phía trình duyệt.
// Trình duyệt KHÔNG giữ API key: mọi yêu cầu đi qua hàm máy chủ /api/generate.
// Muốn đổi nhà cung cấp AI, chỉ cần sửa api/generate.js, giao diện giữ nguyên.

const STATUS_URL = '/api/status';
const GENERATE_URL = '/api/generate';

// Trả về { connected, needsCode, provider, reason }
export async function checkAIStatus() {
  try {
    const res = await fetch(STATUS_URL, { headers: { Accept: 'application/json' } });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('application/json')) {
      return { connected: false, reason: 'Chưa có máy chủ AI (ứng dụng đang chạy dạng trang tĩnh).' };
    }
    const data = await res.json();
    if (!data.connected) return { ...data, connected: false, reason: 'Máy chủ chưa được cấu hình API key cho AI.' };
    return { ...data, connected: true };
  } catch {
    return { connected: false, reason: 'Không liên lạc được máy chủ AI.' };
  }
}

export class AIError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// payload: { task, data, labels, settings, action, text, variant }
export async function requestAI(payload, { accessCode, signal } = {}) {
  let res;
  try {
    res = await fetch(GENERATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(accessCode ? { 'x-access-code': accessCode } : {}) },
      body: JSON.stringify(payload),
      signal
    });
  } catch (e) {
    if (e?.name === 'AbortError') throw new AIError('Đã hủy yêu cầu.', 'aborted');
    throw new AIError('Không kết nối được máy chủ AI. Kiểm tra mạng và thử lại.', 'network');
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* bỏ qua */
  }
  if (!res.ok) throw new AIError(data.error || `Máy chủ AI báo lỗi (${res.status}).`, data.code || 'server');
  if (!data.text) throw new AIError('AI không trả về nội dung.', 'empty');
  return data;
}
