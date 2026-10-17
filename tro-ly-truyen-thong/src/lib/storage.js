// Lưu trữ trên trình duyệt (localStorage) của máy đang dùng.
// Dữ liệu KHÔNG được gửi lên máy chủ và KHÔNG đồng bộ giữa các thiết bị.
// Mọi thao tác đều bọc try/catch: chế độ ẩn danh hoặc trình duyệt chặn lưu trữ
// thì ứng dụng vẫn chạy, chỉ là không nhớ được dữ liệu.

const KEYS = {
  settings: 'ttmn.settings.v1',
  history: 'ttmn.history.v1',
  prefs: 'ttmn.prefs.v1'
};

const MAX_HISTORY = 300;

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    return val ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function remove(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable() {
  try {
    const k = '__ttmn_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// ---------- Thông tin nhà trường ----------
export const EMPTY_SETTINGS = {
  tenTruong: '',
  donViChuQuan: '',
  diaChi: '',
  soDienThoai: '',
  tenGiaoVien: '',
  tenLop: '',
  namHoc: ''
};

export function loadSettings() {
  return { ...EMPTY_SETTINGS, ...read(KEYS.settings, {}) };
}

export function saveSettings(s) {
  return write(KEYS.settings, s);
}

export function clearSettings() {
  return remove(KEYS.settings);
}

// ---------- Tuỳ chọn (dùng AI, mã truy cập) ----------
export const DEFAULT_PREFS = { useAI: true, accessCode: '' };

export function loadPrefs() {
  return { ...DEFAULT_PREFS, ...read(KEYS.prefs, {}) };
}

export function savePrefs(p) {
  return write(KEYS.prefs, p);
}

// ---------- Lịch sử nội dung ----------
export function loadHistory() {
  const list = read(KEYS.history, []);
  return Array.isArray(list) ? list : [];
}

export function saveHistory(list) {
  return write(KEYS.history, list.slice(0, MAX_HISTORY));
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
