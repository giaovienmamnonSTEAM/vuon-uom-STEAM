// Điểm vào duy nhất để tạo / biên tập nội dung.
// - Nếu AI đã kết nối thật và giáo viên bật "Dùng AI": gọi máy chủ AI.
// - Ngược lại: soạn theo mẫu có sẵn (chạy ngay trên trình duyệt, không cần mạng).
// Kết quả luôn ghi rõ nguồn (source: 'ai' | 'mau') để giao diện thông báo trung thực.
import { getModule, EDIT_ACTIONS, labelOf } from './catalog.js';
import { requestAI } from './aiClient.js';
import { applyEditAction } from './textTools.js';
import { firstLine } from './text.js';
import { generateThongBao } from './templates/thongBao.js';
import { generateTinNhan } from './templates/tinNhan.js';
import { generateThuMoi } from './templates/thuMoi.js';
import { generateBanTin } from './templates/banTin.js';
import { generateTuyenTruyen } from './templates/tuyenTruyen.js';
import { generateTruyenThong } from './templates/truyenThong.js';

export const TEMPLATE_GENERATORS = {
  'thong-bao': generateThongBao,
  'tin-nhan': generateTinNhan,
  'thu-moi': generateThuMoi,
  'ban-tin': generateBanTin,
  'tuyen-truyen': generateTuyenTruyen,
  'truyen-thong': generateTruyenThong
};

function selectLabels(mod, data) {
  const labels = {};
  for (const f of mod.fields) {
    if (f.options && data[f.name]) labels[f.name] = labelOf(f.options, data[f.name]);
  }
  return labels;
}

function shouldUseAI(ai) {
  return Boolean(ai?.enabled && ai?.connected);
}

export async function composeContent({ moduleId, data, settings, variant = 0, ai }) {
  const mod = getModule(moduleId);
  const gen = TEMPLATE_GENERATORS[moduleId];
  const local = gen(data, settings, variant);

  if (!shouldUseAI(ai)) {
    return { ...local, source: 'mau' };
  }
  const res = await requestAI(
    { task: moduleId, data, labels: selectLabels(mod, data), settings, variant },
    { accessCode: ai.accessCode, signal: ai.signal }
  );
  const notes = [];
  if (res.truncated) notes.push('Nội dung có thể bị cắt ngắn do quá dài. Hãy kiểm tra phần cuối.');
  return { text: res.text, title: local.title, notes, source: 'ai' };
}

export async function editContent({ action, text, settings, variant = 0, ai }) {
  const label = EDIT_ACTIONS.find((a) => a.value === action)?.label || 'Biên tập';
  const title = `${label}: ${firstLine(text, 50)}`;
  if (!shouldUseAI(ai)) {
    const r = applyEditAction(action, text, settings, variant);
    return { text: r.text, notes: r.notes, title, source: 'mau' };
  }
  const res = await requestAI({ task: 'bien-tap', action, text, settings }, { accessCode: ai.accessCode, signal: ai.signal });
  return { text: res.text, notes: [], title, source: 'ai' };
}
