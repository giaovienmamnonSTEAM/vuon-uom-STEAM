import './style.css';
import { flowerSVG } from './flower.js';
import {
  AGES, linhVucFor, STEAM_LABELS, SKILL_LABELS,
  PREP_CO_LABELS, PREP_TRE_LABELS, planToText, fileSlug
} from './planModel.js';
import { generatePlan, resolveProcess, countBlanks, BLANK } from './generator.js';
import { PRESETS } from './presets.js';

document.getElementById('logoMark').innerHTML = flowerSVG(56);

/* ============ TIỆN ÍCH ============ */
const $ = (id) => document.getElementById(id);
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const lines = (v) => String(v || '').split('\n').map((x) => x.trim()).filter(Boolean);
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
}
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, val) {
  const ks = path.split('.');
  const last = ks.pop();
  const parent = ks.reduce((o, k) => o[k], obj);
  parent[last] = val;
}

/* ============ LỊCH SỬ (localStorage, chỉ là tiện ích trên máy) ============ */
const HISTORY_KEY = 'vuonuom.history.v3';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20))); } catch { /* bộ nhớ đầy/bị chặn */ }
}
function upsertHistory(entry) {
  const list = loadHistory().filter((x) => x.id !== entry.id);
  list.unshift(entry);
  saveHistory(list);
  renderHistory();
}
function renderHistory() {
  const list = loadHistory();
  $('historyBox').hidden = !list.length;
  $('historyList').innerHTML = list.map((h) => {
    const ti = h.plan?.thong_tin || {};
    return `<li>
      <button type="button" class="hist-open" data-id="${esc(h.id)}">
        <b>${esc(ti.ten_hoat_dong || 'Giáo án')}</b>
        <span>${esc(ti.do_tuoi || '')} · ${esc(ti.quy_trinh || '')} · ${new Date(h.at).toLocaleDateString('vi-VN')}</span>
      </button>
      <button type="button" class="hist-del" data-id="${esc(h.id)}" title="Xoá">✕</button>
    </li>`;
  }).join('');
}
$('historyList').addEventListener('click', (e) => {
  const open = e.target.closest('.hist-open');
  const del = e.target.closest('.hist-del');
  if (open) {
    const h = loadHistory().find((x) => x.id === open.dataset.id);
    if (h) { current = h; if (h.input) fillForm(h.input); renderResult(); showResult(); }
  } else if (del) {
    saveHistory(loadHistory().filter((x) => x.id !== del.dataset.id));
    renderHistory();
  }
});

/* ============ FORM ============ */
let selectedAge = null;
const ageGrid = $('ageGrid');
ageGrid.innerHTML = AGES.map((a) => `<button type="button" class="age-btn" data-age="${a.id}">${a.short}</button>`).join('');

function selectAge(id, linhVuc) {
  selectedAge = AGES.find((a) => a.id === id) || null;
  ageGrid.querySelectorAll('.age-btn').forEach((b) => b.classList.toggle('active', b.dataset.age === id));
  const sel = $('linhVuc');
  const prev = linhVuc ?? sel.value;
  const opts = id ? [...linhVucFor(id)] : [];
  if (linhVuc && !opts.includes(linhVuc)) opts.push(linhVuc);
  sel.innerHTML = `<option value="">${id ? '— Chọn lĩnh vực —' : '— Chọn độ tuổi trước —'}</option>` +
    opts.map((o) => `<option ${o === prev ? 'selected' : ''}>${esc(o)}</option>`).join('');
  updateProcessUI();
}
ageGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.age-btn');
  if (btn) selectAge(btn.dataset.age);
});
$('linhVuc').addEventListener('change', updateProcessUI);

function setQuyTrinh(v) {
  document.querySelectorAll('.qt-option').forEach((o) => {
    const input = o.querySelector('input');
    input.checked = input.value === v;
    o.classList.toggle('active', input.checked);
  });
}
document.querySelectorAll('.qt-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    setQuyTrinh(opt.querySelector('input').value);
    updateProcessUI();
  });
});

function currentProcess() {
  return resolveProcess({
    quyTrinh: document.querySelector('input[name="quytrinh"]:checked').value,
    linhVuc: $('linhVuc').value
  });
}
function updateProcessUI() {
  const qt = currentProcess();
  const edp = qt === 'EDP';
  $('edpFields').hidden = !edp;
  $('e5Fields').hidden = edp;
  $('doiTuongLabel').textContent = edp ? 'Sản phẩm trẻ làm' : 'Đối tượng khám phá';
  $('doiTuong').placeholder = edp ? 'VD: chiếc thuyền' : 'VD: vật nổi – vật chìm';
  $('nguyenLieuLabel').firstChild.textContent = edp ? 'Nguyên vật liệu ' : 'Đồ dùng khám phá ';
  const time = selectedAge ? `⏱ Thời lượng tham khảo: ${selectedAge.time}. ` : '';
  $('processHint').textContent = time + (edp
    ? 'Sẽ soạn theo EDP: Đặt vấn đề → Khám phá → Lập kế hoạch → Thực hiện → Thử nghiệm, cải tiến, trưng bày.'
    : 'Sẽ soạn theo 5E: Khơi gợi → Khám phá → Giải thích → Củng cố, mở rộng → Đánh giá.');
}

function readForm() {
  return {
    ageId: selectedAge?.id,
    linhVuc: $('linhVuc').value,
    chuDe: $('chuDe').value.trim(),
    deTai: $('deTai').value.trim(),
    quyTrinh: document.querySelector('input[name="quytrinh"]:checked').value,
    doiTuong: $('doiTuong').value.trim(),
    dungDuoc: $('dungDuoc').checked,
    vanDe: $('vanDe').value.trim(),
    tieuChi: lines($('tieuChi').value),
    dacDiem: lines($('dacDiem').value),
    cachKhamPha: $('cachKhamPha').value.trim(),
    nguyenLieu: lines($('nguyenLieu').value),
    dungCu: lines($('dungCu').value),
    moDau: $('moDau').value.trim(),
    giaoDuc: $('giaoDuc').value.trim(),
    soTre: $('soTre').value.trim(),
    phuHuynh: lines($('phuHuynh').value)
  };
}
function fillForm(inp) {
  selectAge(inp.ageId, inp.linhVuc || '');
  $('chuDe').value = inp.chuDe || '';
  $('deTai').value = inp.deTai || '';
  setQuyTrinh(inp.quyTrinh || 'auto');
  $('doiTuong').value = inp.doiTuong || '';
  $('dungDuoc').checked = inp.dungDuoc !== false;
  $('vanDe').value = inp.vanDe || '';
  $('tieuChi').value = (inp.tieuChi || []).join('\n');
  $('dacDiem').value = (inp.dacDiem || []).join('\n');
  $('cachKhamPha').value = inp.cachKhamPha || '';
  $('nguyenLieu').value = (inp.nguyenLieu || []).join('\n');
  $('dungCu').value = (inp.dungCu || []).join('\n');
  $('moDau').value = inp.moDau || '';
  $('giaoDuc').value = inp.giaoDuc || '';
  $('soTre').value = inp.soTre || '';
  $('phuHuynh').value = (inp.phuHuynh || []).join('\n');
  updateProcessUI();
}

$('preset').innerHTML += PRESETS.map((p) => `<option value="${p.id}">${esc(p.ten)}</option>`).join('');
$('preset').addEventListener('change', () => {
  const p = PRESETS.find((x) => x.id === $('preset').value);
  if (!p) return;
  fillForm(p);
  build();
});

/* ============ LẬP GIÁO ÁN ============ */
// Màn hình hẹp: form nằm trên, kết quả nằm dưới — cuộn xuống kết quả.
function showResult() {
  if (window.innerWidth <= 920) $('resultWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

let current = null; // { id, at, input, plan }

function build() {
  const input = readForm();
  if (!input.ageId) { showToast('Vui lòng chọn độ tuổi'); return; }
  if (!input.deTai) { showToast('Vui lòng nhập tên hoạt động / đề tài'); return; }
  if (!input.doiTuong) { showToast(currentProcess() === 'EDP' ? 'Vui lòng nhập sản phẩm trẻ làm' : 'Vui lòng nhập đối tượng khám phá'); return; }
  current = { id: String(Date.now()), at: Date.now(), input, plan: generatePlan(input) };
  upsertHistory(current);
  renderResult();
  showResult();
}
$('genBtn').addEventListener('click', build);

/* ============ HIỂN THỊ + CHỈNH SỬA ============ */
// Ô sửa trực tiếp: data-path trỏ tới vị trí trong current.plan.
function ed(path, cls = '') {
  const v = getPath(current.plan, path) ?? '';
  const blank = String(v).includes(BLANK) ? ' has-blank' : '';
  return `<div class="ed ${cls}${blank}" contenteditable="true" spellcheck="false" data-path="${path}">${esc(v)}</div>`;
}
// Mục một câu (chuỗi) hoặc danh sách (mảng) — danh sách có nút thêm/xoá dòng.
function field(path) {
  const v = getPath(current.plan, path);
  if (!Array.isArray(v)) return ed(path);
  return `<ul class="ed-list">${v.map((_, i) => `<li>${ed(`${path}.${i}`)}<button class="x" data-del="${path}.${i}" title="Xoá dòng">✕</button></li>`).join('')}</ul>
    <button class="add" data-add="${path}">+ Thêm dòng</button>`;
}

function renderEmpty() {
  $('resultWrap').innerHTML = `
    <div class="empty-state">
      <div class="big-flower">${flowerSVG(120)}</div>
      <h3>Chưa có giáo án nào</h3>
      <p>Chọn một <b>giáo án mẫu</b> để xem ngay, hoặc nhập thông tin bên trái rồi bấm "Lập giáo án". App lắp giáo án đủ 3 phần (Mục đích – Yêu cầu theo S-T-E-A-M, Chuẩn bị, Cách tiến hành bảng Cô | Trẻ). Bạn sửa trực tiếp trên trang rồi tải file Word. Không cần mạng, không cần API.</p>
    </div>`;
}

function renderResult() {
  const p = current.plan;
  const ti = p.thong_tin || {};
  const pt = p.phan_tich || {};
  $('resultWrap').innerHTML = `
  <div class="result-head">
    <div class="eyebrow">Giáo án STEAM · ${esc(ti.quy_trinh)} · STEAM ${esc(String(ti.muc_do_steam || '').toLowerCase())}</div>
    <h2>${ed('thong_tin.ten_hoat_dong', 'title')}</h2>
    <div class="meta-grid">
      ${[['Chủ đề', 'chu_de'], ['Lĩnh vực', 'linh_vuc'], ['Độ tuổi', 'do_tuoi'], ['Thời gian', 'thoi_gian'], ['Hình thức', 'hinh_thuc'], ['Áp dụng STEAM', 'muc_do_steam']]
        .map(([l, k]) => `<div><span>${l}</span>${ed(`thong_tin.${k}`)}</div>`).join('')}
    </div>
    ${pt.canh_bao ? `<div class="warn-box">⚠️ ${esc(pt.canh_bao)}</div>` : ''}
    <div class="analysis">
      ${pt.ban_chat_hoat_dong ? `<div><b>Bản chất hoạt động:</b> ${esc(pt.ban_chat_hoat_dong)}</div>` : ''}
      ${pt.ly_do_chon_quy_trinh ? `<div><b>Vì sao chọn ${esc(ti.quy_trinh)}:</b> ${esc(pt.ly_do_chon_quy_trinh)}</div>` : ''}
    </div>
    <div class="blank-bar" id="blankBar"></div>
    <div class="toolbar">
      <button class="tool-btn primary" id="wordBtn">📄 Tải file Word (.docx)</button>
      <button class="tool-btn" id="copyBtn">📋 Sao chép</button>
      <button class="tool-btn" id="txtBtn">⬇️ Tải .txt</button>
      <button class="tool-btn" id="printBtn">🖨️ In</button>
      <button class="tool-btn" id="newBtn">🌼 Soạn giáo án mới</button>
    </div>
  </div>
  <div id="lessonBody">${lessonHTML(p)}</div>`;

  $('wordBtn').addEventListener('click', downloadWord);
  $('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(planToText(current.plan)).then(() => showToast('Đã sao chép toàn bộ giáo án!'));
  });
  $('txtBtn').addEventListener('click', downloadTxt);
  $('printBtn').addEventListener('click', () => window.print());
  $('newBtn').addEventListener('click', () => {
    current = null;
    $('preset').value = '';
    fillForm({});
    renderEmpty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  updateBlankBar();
}

function lessonHTML(p) {
  const md = p.muc_dich_yeu_cau || {};
  let html = '';

  html += `<div class="section-card"><h3><span class="num" style="background:var(--s-blue)">I</span>Mục đích – Yêu cầu</h3>
    <h4 class="sub-h">1. Kiến thức</h4>
    <div class="steam-grid">
    ${STEAM_LABELS.map(([k, en, vi]) => `<div class="steam-item ${k}"><div class="letter">${k}</div><div class="body"><b>${k} – ${en} <span class="vi">(${vi})</span></b>${field(`muc_dich_yeu_cau.kien_thuc.${k}`)}</div></div>`).join('')}
    </div>
    <h4 class="sub-h">2. Kỹ năng – Nhóm kỹ năng 4C's</h4>
    <div class="skill-grid">
      ${SKILL_LABELS.map(([k, label]) => `<div class="skill-item"><div class="skill-name">${label}</div>${field(`muc_dich_yeu_cau.ky_nang.${k}`)}</div>`).join('')}
    </div>
    <div class="plain-block"><b>Kỹ năng khác:</b> ${field('muc_dich_yeu_cau.ky_nang.ky_nang_khac')}</div>
    <h4 class="sub-h">3. Thái độ</h4>
    <div class="plain-block">${field('muc_dich_yeu_cau.thai_do')}</div>
  </div>`;

  const prepCol = (title, base, labels) => `<div class="prep-col"><div class="prep-title">${title}</div>
    ${labels.filter(([k]) => getPath(p, `${base}.${k}`) !== undefined)
      .map(([k, label]) => `<div class="prep-sub">${label}</div>${field(`${base}.${k}`)}`).join('')}</div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">II</span>Chuẩn bị</h3>
    <div class="prep-grid">
      ${prepCol('👩‍🏫 1. Chuẩn bị của Cô', 'chuan_bi.co', PREP_CO_LABELS)}
      ${prepCol('🧒 2. Chuẩn bị của Trẻ', 'chuan_bi.tre', PREP_TRE_LABELS)}
      <div class="prep-col"><div class="prep-title">👪 3. Phối hợp với Phụ huynh</div><div class="muted small">Chỉ ghi khi cần; để trống thì file Word bỏ mục này.</div>${field('chuan_bi.phu_huynh')}</div>
    </div></div>`;

  html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">III</span>Cách tiến hành</h3>
    <div class="table-scroll"><table class="flow-table">
      <thead><tr><th>Hoạt động của Cô</th><th>Hoạt động của Trẻ</th></tr></thead>
      <tbody>
      ${(p.cach_tien_hanh || []).map((s, i) => `
        <tr class="step-row"><td colspan="2">
          <div class="step-title">${ed(`cach_tien_hanh.${i}.ten_buoc`, 'inline')} <span class="step-time">${ed(`cach_tien_hanh.${i}.thoi_gian`, 'inline')}</span></div>
          <div class="step-purpose">🎯 ${ed(`cach_tien_hanh.${i}.muc_dich`, 'inline')}</div>
        </td></tr>
        ${(s.luot || []).map((_, j) => `<tr>
          <td class="co">${ed(`cach_tien_hanh.${i}.luot.${j}.co`)}</td>
          <td class="tre">${ed(`cach_tien_hanh.${i}.luot.${j}.tre`)}<button class="x turn-x" data-del-turn="${i}.${j}" title="Xoá lượt này">✕</button></td>
        </tr>`).join('')}
        <tr class="integrate-row"><td colspan="2">
          <button class="add" data-add-turn="${i}">+ Thêm lượt hỏi – đáp</button>
          <div>🌸 Tích hợp STEAM: ${ed(`cach_tien_hanh.${i}.tich_hop_steam`, 'inline')}</div>
        </td></tr>
      `).join('')}
      </tbody>
    </table></div></div>`;
  return html;
}

/* Sửa trực tiếp: ghi lại vào current.plan, lưu lịch sử (gộp nhiều lần gõ). */
let saveTimer;
$('resultWrap').addEventListener('input', (e) => {
  const el = e.target.closest('.ed');
  if (!el || !current) return;
  const text = el.innerText.replace(/\n+$/, '');
  setPath(current.plan, el.dataset.path, text);
  el.classList.toggle('has-blank', text.includes(BLANK));
  updateBlankBar();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { current.at = Date.now(); upsertHistory(current); }, 600);
});
// Dán chữ thuần, không mang định dạng từ Word/web vào.
$('resultWrap').addEventListener('paste', (e) => {
  if (!e.target.closest('.ed')) return;
  e.preventDefault();
  document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
});
$('resultWrap').addEventListener('click', (e) => {
  if (!current) return;
  const add = e.target.closest('[data-add]');
  const del = e.target.closest('[data-del]');
  const addTurn = e.target.closest('[data-add-turn]');
  const delTurn = e.target.closest('[data-del-turn]');
  let focusPath = null;
  if (add) {
    const arr = getPath(current.plan, add.dataset.add);
    arr.push('');
    focusPath = `${add.dataset.add}.${arr.length - 1}`;
  } else if (del) {
    const ks = del.dataset.del.split('.');
    const idx = Number(ks.pop());
    getPath(current.plan, ks.join('.')).splice(idx, 1);
  } else if (addTurn) {
    const luot = current.plan.cach_tien_hanh[addTurn.dataset.addTurn].luot;
    luot.push({ co: 'Cô: ', tre: '- Trẻ 1: ' });
    focusPath = `cach_tien_hanh.${addTurn.dataset.addTurn}.luot.${luot.length - 1}.co`;
  } else if (delTurn) {
    const [i, j] = delTurn.dataset.delTurn.split('.').map(Number);
    if (!confirm('Xoá lượt hỏi – đáp này?')) return;
    current.plan.cach_tien_hanh[i].luot.splice(j, 1);
  } else {
    return;
  }
  const y = window.scrollY;
  $('lessonBody').innerHTML = lessonHTML(current.plan);
  window.scrollTo(0, y);
  updateBlankBar();
  upsertHistory(current);
  if (focusPath) focusEnd(document.querySelector(`[data-path="${focusPath}"]`));
});

// Đặt con trỏ ở cuối ô vừa thêm để gõ tiếp.
function focusEnd(el) {
  if (!el) return;
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/* Thanh "còn N chỗ «…»" + nút nhảy tới chỗ tiếp theo. */
let blankCursor = -1;
function updateBlankBar() {
  const bar = $('blankBar');
  if (!bar) return;
  const n = countBlanks(current.plan);
  bar.innerHTML = n
    ? `✏️ Còn <b>${n}</b> chỗ <span class="blank-tag">${BLANK}</span> cần điền nội dung riêng của bài. <button class="tool-btn small" id="nextBlank">Tới chỗ tiếp theo →</button>`
    : '✅ Đã điền hết các chỗ «…». Bấm vào chữ bất kỳ để sửa thêm.';
  bar.classList.toggle('done', !n);
  $('nextBlank')?.addEventListener('click', gotoNextBlank);
}
function gotoNextBlank() {
  const els = [...document.querySelectorAll('.ed.has-blank')];
  if (!els.length) return;
  blankCursor = (blankCursor + 1) % els.length;
  const el = els[blankCursor];
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus();
  // Bôi đen đúng «…» để giáo viên gõ đè.
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const k = node.textContent.indexOf(BLANK);
    if (k >= 0) {
      const range = document.createRange();
      range.setStart(node, k);
      range.setEnd(node, k + BLANK.length);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      break;
    }
  }
}

/* ============ XUẤT FILE ============ */
async function downloadWord() {
  const btn = $('wordBtn');
  const n = countBlanks(current.plan);
  if (n && !confirm(`Giáo án còn ${n} chỗ «…» chưa điền. Vẫn tải file Word?`)) return;
  btn.disabled = true;
  btn.textContent = '⏳ Đang tạo file Word...';
  try {
    const { exportDocx } = await import('./exportDocx.js');
    await exportDocx(current.plan);
    showToast('Đã tải file Word!');
  } catch (err) {
    showToast('Không tạo được file Word: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '📄 Tải file Word (.docx)';
  }
}
function downloadTxt() {
  const blob = new Blob([planToText(current.plan)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GiaoAn_STEAM_' + fileSlug(current.plan.thong_tin?.ten_hoat_dong) + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

updateProcessUI();
renderEmpty();
renderHistory();
