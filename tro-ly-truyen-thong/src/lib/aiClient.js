// Lớp kết nối AI phía trình duyệt. Có hai đường, chọn tự động:
// 1. Mở trên claude.ai (Artifact): gọi Claude của chính người đang xem qua
//    khả năng "sample" — không cần API key, lần đầu Claude hỏi người dùng cho phép.
// 2. Chạy trên máy chủ riêng (Vercel…): gọi hàm máy chủ /api/generate, API key
//    nằm ở biến môi trường máy chủ, KHÔNG bao giờ ở trình duyệt.
// Không đường nào khả dụng thì báo "chưa kết nối" — ứng dụng dùng chế độ soạn theo mẫu.
import { SYSTEM_PROMPT, buildUserMessage, parseOutput } from '../../api/_lib/prompts.js';

const STATUS_URL = '/api/status';
const GENERATE_URL = '/api/generate';

let samplePromise = null;
function getSample() {
  if (!samplePromise) {
    samplePromise =
      typeof window !== 'undefined' && window.claude?.use
        ? Promise.resolve(window.claude.use('sample')).catch(() => null)
        : Promise.resolve(null);
  }
  return samplePromise;
}

// Trả về { connected, mode: 'claude' | 'server', needsCode, provider, reason }
export async function checkAIStatus() {
  const sample = await getSample();
  if (sample) return { connected: true, mode: 'claude', provider: 'Claude trên claude.ai (tài khoản của người đang dùng)' };
  if (typeof window !== 'undefined' && window.claude?.use) {
    return { connected: false, reason: 'Trang đang mở trên claude.ai nhưng chưa được phép dùng Claude.' };
  }
  try {
    const res = await fetch(STATUS_URL, { headers: { Accept: 'application/json' } });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('application/json')) {
      return { connected: false, reason: 'Chưa có máy chủ AI (ứng dụng đang chạy dạng trang tĩnh).' };
    }
    const data = await res.json();
    if (!data.connected) return { ...data, connected: false, reason: 'Máy chủ chưa được cấu hình API key cho AI.' };
    return { ...data, connected: true, mode: 'server' };
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

const SAMPLE_ERRORS = {
  not_granted: 'Bạn chưa cho phép trang dùng Claude. Bấm soạn lại và chọn “Cho phép”, hoặc dùng chế độ soạn theo mẫu.',
  declined: 'Bạn chưa cho phép trang dùng Claude.',
  rate_limited: 'Claude đang nhận quá nhiều yêu cầu hoặc đã hết hạn mức sử dụng. Vui lòng thử lại sau ít phút.',
  refused: 'Claude không soạn nội dung này. Hãy diễn đạt lại thông tin hoặc dùng chế độ soạn theo mẫu.',
  prompt_too_large: 'Nội dung quá dài. Hãy rút bớt rồi thử lại.',
  session_expired: 'Phiên đăng nhập claude.ai đã hết hạn. Tải lại trang rồi thử lại.',
  sampling_disabled: 'Tổ chức của bạn đã tắt tính năng cho trang gọi Claude.',
  cancelled: 'Đã hủy yêu cầu.',
  empty_completion: 'Claude không trả về nội dung. Vui lòng thử lại.'
};

async function viaClaude(sample, payload, signal) {
  const userMsg = buildUserMessage(payload);
  try {
    const { text, truncated } = await sample(`${SYSTEM_PROMPT}\n\n---\n\n${userMsg}`, { signal, modelTier: 'default' });
    const out = parseOutput(text);
    if (!out.text) throw new AIError(SAMPLE_ERRORS.empty_completion, 'empty');
    return { ...out, truncated };
  } catch (e) {
    if (e instanceof AIError) throw e;
    const code = e?.code || 'upstream_error';
    throw new AIError(SAMPLE_ERRORS[code] || 'Không gọi được Claude lúc này. Vui lòng thử lại.', code);
  }
}

async function viaServer(payload, accessCode, signal) {
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

// payload: { task, data, labels, settings, action, text, instruction, variant }
export async function requestAI(payload, { accessCode, signal } = {}) {
  const sample = await getSample();
  if (sample) return viaClaude(sample, payload, signal);
  return viaServer(payload, accessCode, signal);
}
