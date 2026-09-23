import './style.css';
import { flowerSVG } from './flower.js';
import { generateLessonPlan, generateExtras } from './api.js';
import {
  AGES, linhVucFor, suggestProcess, STEAM_LABELS, SKILL_LABELS,
  PREP_CO_LABELS, PREP_TRE_LABELS, splitLines, planToText, fileSlug, toList, steamItems
} from './planModel.js';

document.getElementById('logoMark').innerHTML = flowerSVG(56);

/* ============ TIỆN ÍCH ============ */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function listHTML(v) {
  const arr = toList(v);
  if (!arr.length) return '<p class="muted">(Không có)</p>';
  return '<ul>' + arr.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>';
}
// Một ý: hiện dạng đoạn văn; nhiều ý: danh sách.
function textOrList(v) {
  const arr = toList(v);
  return arr.length === 1 ? `<p class="one-line">${esc(arr[0])}</p>` : listHTML(arr);
}
function linesHTML(s) {
  return splitLines(s).map((l) => `<p>${esc(l)}</p>`).join('');
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ============ LỊCH SỬ (localStorage, chỉ là tiện ích trên máy) ============ */
const HISTORY_KEY = 'vuonuom.history.v2';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 15))); } catch { /* bộ nhớ đầy/bị chặn */ }
}
function upsertHistory(entry) {
  const list = loadHistory().filter((x) => x.id !== entry.id);
  list.unshift(entry);
  saveHistory(list);
  renderHistory();
}
function renderHistory() {
  const list = loadHistory();
  const box = document.getElementById('historyBox');
  box.hidden = !list.length;
  document.getElementById('historyList').innerHTML = list.map((h) => {
    const ti = h.plan?.thong_tin || {};
    const d = new Date(h.at);
    return `<li>
      <button type="button" class="hist-open" data-id="${esc(h.id)}">
        <b>${esc(ti.ten_hoat_dong || 'Giáo án')}</b>
        <span>${esc(ti.do_tuoi || '')} · ${esc(ti.quy_trinh || '')} · ${d.toLocaleDateString('vi-VN')}</span>
      </button>
      <button type="button" class="hist-del" data-id="${esc(h.id)}" title="Xoá">✕</button>
    </li>`;
  }).join('');
}
document.getElementById('historyList').addEventListener('click', (e) => {
  const open = e.target.closest('.hist-open');
  const del = e.target.closest('.hist-del');
  if (open) {
    const h = loadHistory().find((x) => x.id === open.dataset.id);
    if (h) { current = h; currentTab = 'giaoan'; renderResult(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  } else if (del) {
    saveHistory(loadHistory().filter((x) => x.id !== del.dataset.id));
    renderHistory();
  }
});

/* ============ FORM ============ */
let selectedAge = null;
let doDai = 'chi_tiet';

const ageGrid = document.getElementById('ageGrid');
ageGrid.innerHTML = AGES.map((a) => `<button type="button" class="age-btn" data-age="${a.id}">${a.short}</button>`).join('');
ageGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.age-btn');
  if (!btn) return;
  ageGrid.querySelectorAll('.age-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  selectedAge = AGES.find((a) => a.id === btn.dataset.age);
  const sel = document.getElementById('linhVuc');
  const prev = sel.value;
  const opts = linhVucFor(selectedAge.id);
  sel.innerHTML = '<option value="">— Để AI tự xác định theo đề tài —</option>' +
    opts.map((o) => `<option ${o === prev ? 'selected' : ''}>${esc(o)}</option>`).join('');
  updateHint();
});
document.getElementById('linhVuc').addEventListener('change', updateHint);
function updateHint() {
  const v = document.getElementById('linhVuc').value;
  const time = selectedAge ? `⏱ Thời lượng tham khảo: ${selectedAge.time}. ` : '';
  document.getElementById('processHint').textContent = time + suggestProcess(v);
}

document.querySelectorAll('.qt-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.qt-option').forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    opt.querySelector('input').checked = true;
  });
});
document.getElementById('doDaiSeg').addEventListener('click', (e) => {
  const b = e.target.closest('.seg-btn');
  if (!b) return;
  document.querySelectorAll('#doDaiSeg .seg-btn').forEach((x) => x.classList.remove('active'));
  b.classList.add('active');
  doDai = b.dataset.v;
});

/* ============ KẾT QUẢ ============ */
let current = null;       // { id, at, input, plan, extras }
let currentTab = 'giaoan';

function renderEmpty() {
  document.getElementById('resultWrap').innerHTML = `
    <div class="empty-state">
      <div class="big-flower">${flowerSVG(120)}</div>
      <h3>Chưa có giáo án nào</h3>
      <p>Chọn độ tuổi, lĩnh vực, nhập chủ đề và đề tài rồi bấm "Soạn giáo án ngay". Giáo án được soạn đúng bản chất STEAM (chọn 5E hay EDP, S-T-E-A-M thực chất, 4C's gắn hành vi) và có bảng Cô | Trẻ với lời thoại đầy đủ, tải về file Word để in.</p>
    </div>`;
}

function renderResult() {
  const p = current.plan;
  const ti = p.thong_tin || {};
  const pt = p.phan_tich || {};
  const wrap = document.getElementById('resultWrap');

  wrap.innerHTML = `
  <div class="result-head">
    <div class="eyebrow">Giáo án STEAM · ${esc(ti.quy_trinh)}${ti.muc_do_steam ? ' · STEAM ' + esc(String(ti.muc_do_steam).toLowerCase()) : ''}</div>
    <h2>${esc(ti.ten_hoat_dong)}</h2>
    <div class="result-meta">
      <span>Chủ đề: <b>${esc(ti.chu_de)}</b></span>
      <span>Lĩnh vực: <b>${esc(ti.linh_vuc)}</b></span>
      <span>Độ tuổi: <b>${esc(ti.do_tuoi)}</b></span>
      <span>Thời gian: <b>${esc(ti.thoi_gian)}</b></span>
      <span>Hình thức: <b>${esc(ti.hinh_thuc)}</b></span>
    </div>
    ${pt.canh_bao ? `<div class="warn-box">⚠️ ${esc(pt.canh_bao)}</div>` : ''}
    <div class="analysis">
      ${pt.ban_chat_hoat_dong ? `<div><b>Bản chất hoạt động:</b> ${esc(pt.ban_chat_hoat_dong)}</div>` : ''}
      ${pt.ly_do_chon_quy_trinh ? `<div><b>Vì sao chọn ${esc(ti.quy_trinh)}:</b> ${esc(pt.ly_do_chon_quy_trinh)}</div>` : ''}
      ${pt.van_de ? `<div><b>Vấn đề trẻ cần giải quyết:</b> ${esc(pt.van_de)}</div>` : ''}
      ${pt.tieu_chi_san_pham?.length ? `<div><b>Tiêu chí sản phẩm:</b> ${pt.tieu_chi_san_pham.map(esc).join('; ')}</div>` : ''}
      ${pt.gioi_han?.length ? `<div><b>Giới hạn:</b> ${pt.gioi_han.map(esc).join('; ')}</div>` : ''}
    </div>
    <div class="toolbar">
      <button class="tool-btn primary" id="wordBtn">📄 Tải file Word (.docx)</button>
      <button class="tool-btn" id="copyBtn">📋 Sao chép</button>
      <button class="tool-btn" id="txtBtn">⬇️ Tải .txt</button>
      <button class="tool-btn" id="printBtn">🖨️ In</button>
      <button class="tool-btn" id="newBtn">🌼 Soạn giáo án mới</button>
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn ${currentTab === 'giaoan' ? 'active' : ''}" data-tab="giaoan">📘 Giáo án (I – II – III)</button>
    <button class="tab-btn ${currentTab === 'tainguyen' ? 'active' : ''}" data-tab="tainguyen">🧺 Tài nguyên hỗ trợ</button>
  </div>
  <div id="tabContent"></div>`;

  wrap.querySelectorAll('.tab-btn').forEach((b) => b.addEventListener('click', () => {
    currentTab = b.dataset.tab;
    wrap.querySelectorAll('.tab-btn').forEach((x) => x.classList.toggle('active', x === b));
    renderTab();
  }));
  document.getElementById('wordBtn').addEventListener('click', downloadWord);
  document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(planToText(p)).then(() => showToast('Đã sao chép toàn bộ giáo án!'));
  });
  document.getElementById('txtBtn').addEventListener('click', downloadTxt);
  document.getElementById('printBtn').addEventListener('click', () => {
    if (currentTab !== 'giaoan') { currentTab = 'giaoan'; renderResult(); }
    window.print();
  });
  document.getElementById('newBtn').addEventListener('click', () => {
    current = null; renderEmpty(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  renderTab();
}

function renderTab() {
  const target = document.getElementById('tabContent');
  target.innerHTML = currentTab === 'giaoan' ? lessonHTML(current.plan) : extrasHTML();
  if (currentTab === 'tainguyen') bindExtras();
}

function lessonHTML(p) {
  const md = p.muc_dich_yeu_cau || {};
  const kt = md.kien_thuc || {};
  const kn = md.ky_nang || {};
  const cb = p.chuan_bi || {};
  let html = '';

  // I. MỤC ĐÍCH – YÊU CẦU
  html += `<div class="section-card"><h3><span class="num" style="background:var(--s-blue)">I</span>Mục đích – Yêu cầu</h3>
    <h4 class="sub-h">1. Kiến thức</h4>
    <div class="steam-grid">
    ${STEAM_LABELS.map(([k, en, vi]) => {
      const items = steamItems(kt, k);
      const na = items.length === 1 && /^không áp dụng/i.test(items[0]);
      return `<div class="steam-item ${k} ${na ? 'na' : ''}"><div class="letter">${k}</div><div class="body"><b>${k} – ${en} <span class="vi">(${vi})</span></b>${textOrList(items)}</div></div>`;
    }).join('')}
    </div>
    <h4 class="sub-h">2. Kỹ năng</h4>
    <div class="skill-grid">
      ${SKILL_LABELS.map(([k, label]) => `<div class="skill-item"><div class="skill-name">${label}</div>${textOrList(kn[k])}</div>`).join('')}
    </div>
    ${toList(kn.ky_nang_khac).length ? `<div class="plain-block"><b>Kỹ năng khác:</b> ${textOrList(kn.ky_nang_khac)}</div>` : ''}
    <h4 class="sub-h">3. Thái độ</h4>
    <div class="plain-block">${listHTML(md.thai_do)}</div>
  </div>`;

  // II. CHUẨN BỊ
  const prepCol = (title, obj, labels) => `<div class="prep-col"><div class="prep-title">${title}</div>
    ${labels.map(([k, label]) => toList(obj?.[k]).length ? `<div class="prep-sub">${label}</div>${textOrList(obj[k])}` : '').join('')}</div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">II</span>Chuẩn bị</h3>
    <div class="prep-grid ${toList(cb.phu_huynh).length ? '' : 'two'}">
      ${prepCol('👩‍🏫 1. Chuẩn bị của Cô', cb.co, PREP_CO_LABELS)}
      ${prepCol('🧒 2. Chuẩn bị của Trẻ', cb.tre, PREP_TRE_LABELS)}
      ${toList(cb.phu_huynh).length ? `<div class="prep-col"><div class="prep-title">👪 3. Phối hợp với Phụ huynh</div>${listHTML(cb.phu_huynh)}</div>` : ''}
    </div></div>`;

  // III. CÁCH TIẾN HÀNH — bảng 2 cột
  html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">III</span>Cách tiến hành</h3>
    <div class="table-scroll"><table class="flow-table">
      <thead><tr><th>Hoạt động của Cô</th><th>Hoạt động của Trẻ</th></tr></thead>
      <tbody>
      ${(p.cach_tien_hanh || []).map((s) => `
        <tr class="step-row"><td colspan="2">
          <div class="step-title">${esc(s.ten_buoc)} ${s.thoi_gian ? `<span class="step-time">${esc(s.thoi_gian)}</span>` : ''}</div>
          ${s.muc_dich ? `<div class="step-purpose">🎯 ${esc(s.muc_dich)}</div>` : ''}
        </td></tr>
        ${(s.luot || []).map((l) => `<tr><td class="co">${linesHTML(l.co)}</td><td class="tre">${linesHTML(l.tre)}</td></tr>`).join('')}
        ${s.tich_hop_steam ? `<tr class="integrate-row"><td colspan="2">🌸 Tích hợp STEAM: ${esc(s.tich_hop_steam)}</td></tr>` : ''}
      `).join('')}
      </tbody>
    </table></div></div>`;
  return html;
}

/* ============ TÀI NGUYÊN HỖ TRỢ ============ */
let extrasLoading = false;

function extrasHTML() {
  const x = current.extras;
  if (extrasLoading) {
    return `<div class="section-card center"><div class="spin-flower small">${flowerSVG(56)}</div><p id="extrasProgress">Đang soạn trò chơi, bảng ghi chép, học liệu...</p></div>`;
  }
  if (!x) {
    return `<div class="section-card center">
      <p>Soạn thêm <b>bảng ghi chép / bảng vẽ thiết kế, trò chơi STEAM, danh mục học liệu, gợi ý slide, prompt AI, phiếu đánh giá trẻ</b> và gợi ý mở rộng — bám theo giáo án vừa soạn.</p>
      <button class="generate-btn inline" id="extrasBtn">✨ Soạn tài nguyên hỗ trợ</button>
    </div>`;
  }
  let html = '';
  const bg = x.bang_ghi_chep || {};
  html += `<div class="section-card"><h3><span class="num" style="background:var(--s-blue)">📋</span>${esc(bg.ten || 'Bảng ghi chép / Bảng thiết kế')}</h3>
    <div class="plain-block"><p>${bg.co_su_dung === false ? 'Không cần sử dụng. ' : ''}${esc(bg.mo_ta)}</p></div></div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--a-pink)">🎲</span>Trò chơi STEAM</h3>
    ${(x.tro_choi || []).map((g) => `<div class="game-card"><div class="g-title">${esc(g.ten)}</div>
      <div class="g-meta">🎯 ${esc(g.muc_tieu)}</div>
      ${g.chuan_bi ? `<p><b>Chuẩn bị:</b> ${esc(g.chuan_bi)}</p>` : ''}
      <p><b>Cách chơi:</b> ${esc(g.cach_choi)}</p>
      ${g.luat_choi ? `<p><b>Luật chơi:</b> ${esc(g.luat_choi)}</p>` : ''}</div>`).join('') || '<p class="muted">Không có.</p>'}</div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">🧺</span>Danh mục học liệu</h3>${listHTML(x.hoc_lieu)}</div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">🖥️</span>Gợi ý slide trình chiếu</h3>
    <table class="eval-table"><thead><tr><th style="width:120px">Slide</th><th>Nội dung</th></tr></thead><tbody>
    ${(x.slide || []).map((s) => `<tr><td>${esc(s.slide)}</td><td>${esc(s.noi_dung)}</td></tr>`).join('')}</tbody></table></div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">✨</span>Prompt AI dùng ngay</h3>
    ${(x.prompt_ai || []).map((pr, i) => `<div class="ai-prompt-card"><div class="ap-type">${esc(pr.loai)} <button class="copy-mini" data-idx="${i}">Sao chép</button></div><div class="ap-text">${esc(pr.prompt)}</div></div>`).join('')}</div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--m-green)">⭐</span>Phiếu đánh giá trẻ</h3>
    <table class="eval-table"><thead><tr><th>Tiêu chí</th><th style="width:80px">Đạt</th><th style="width:100px">Chưa đạt</th></tr></thead><tbody>
    ${(x.phieu_danh_gia || []).map((e) => `<tr><td>${esc(e.tieu_chi)}</td><td>☐</td><td>☐</td></tr>`).join('')}</tbody></table></div>`;
  html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">🌱</span>Gợi ý mở rộng</h3>${listHTML(x.goi_y_mo_rong)}</div>`;
  html += `<div class="center"><button class="tool-btn" id="extrasRedo">🔁 Soạn lại tài nguyên</button></div>`;
  return html;
}

function bindExtras() {
  const run = async () => {
    extrasLoading = true;
    renderTab();
    const entry = current;
    try {
      const x = await generateExtras(entry.plan, (n) => {
        const el = document.getElementById('extrasProgress');
        if (el) el.textContent = `Đang soạn tài nguyên... (${n.toLocaleString('vi-VN')} ký tự)`;
      });
      entry.extras = x;
      upsertHistory(entry);
    } catch (err) {
      showToast(err.message);
    } finally {
      extrasLoading = false;
      if (current === entry && currentTab === 'tainguyen') renderTab();
    }
  };
  document.getElementById('extrasBtn')?.addEventListener('click', run);
  document.getElementById('extrasRedo')?.addEventListener('click', run);
  document.querySelectorAll('.copy-mini').forEach((b) => b.addEventListener('click', () => {
    const pr = current.extras.prompt_ai[b.dataset.idx];
    navigator.clipboard.writeText(pr.prompt).then(() => showToast('Đã sao chép prompt!'));
  }));
}

/* ============ XUẤT FILE ============ */
async function downloadWord() {
  const btn = document.getElementById('wordBtn');
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

/* ============ SOẠN GIÁO ÁN ============ */
document.getElementById('genBtn').addEventListener('click', async () => {
  const payload = {
    doTuoi: selectedAge?.label,
    linhVuc: document.getElementById('linhVuc').value,
    chuDe: document.getElementById('chuDe').value.trim(),
    deTai: document.getElementById('deTai').value.trim(),
    quyTrinh: document.querySelector('input[name="quytrinh"]:checked').value,
    doDai,
    soTre: document.getElementById('soTre').value.trim(),
    ghiChu: document.getElementById('ghiChu').value.trim(),
    giaoAnCu: document.getElementById('giaoAnCu').value.trim()
  };
  if (!payload.doTuoi) { showToast('Vui lòng chọn độ tuổi'); return; }
  if (!payload.chuDe) { showToast('Vui lòng nhập chủ đề'); return; }
  if (!payload.deTai) { showToast('Vui lòng nhập đề tài'); return; }

  const btn = document.getElementById('genBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Đang soạn...';

  const msgs = [
    'Đang phân tích bản chất hoạt động...',
    'Đang chọn quy trình 5E hay EDP...',
    'Đang xác định S-T-E-A-M thực chất...',
    "Đang gắn 4C's với hành vi của trẻ...",
    'Đang viết lời thoại Cô – Trẻ...',
    'Đang kiểm tra an toàn và độ tuổi...'
  ];
  let i = 0;
  document.getElementById('resultWrap').innerHTML = `
    <div class="loading-state">
      <div class="spin-flower">${flowerSVG(88)}</div>
      <div class="loading-msg" id="loadingMsg">${msgs[0]}</div>
      <div class="loading-sub" id="loadingSub">Giáo án chi tiết có thể mất 1–3 phút, vui lòng không đóng trang.</div>
      <div class="progress"><div class="bar" id="progressBar"></div></div>
    </div>`;
  const timer = setInterval(() => {
    i = (i + 1) % msgs.length;
    const el = document.getElementById('loadingMsg');
    if (el) el.textContent = msgs[i];
  }, 2600);
  const expected = { chi_tiet: 45000, vua: 25000, gon: 14000 }[doDai];

  try {
    const plan = await generateLessonPlan(payload, (n) => {
      const sub = document.getElementById('loadingSub');
      const bar = document.getElementById('progressBar');
      if (sub) sub.textContent = `Đã viết được ${n.toLocaleString('vi-VN')} ký tự...`;
      if (bar) bar.style.width = Math.min(96, (n / expected) * 100) + '%';
    });
    if (!plan?.cach_tien_hanh?.length) throw new Error('Giáo án trả về thiếu phần Cách tiến hành. Vui lòng thử lại.');
    current = { id: String(Date.now()), at: Date.now(), input: payload, plan, extras: null };
    currentTab = 'giaoan';
    upsertHistory(current);
    renderResult();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    document.getElementById('resultWrap').innerHTML = `
      <div class="error-state">
        <b>Đã có lỗi xảy ra khi soạn giáo án.</b><br>${esc(err.message)}<br><br>
        Vui lòng thử lại. Nếu lỗi tiếp diễn, hãy chọn độ dài "Vừa" hoặc rút gọn phần "Yêu cầu thêm".
      </div>`;
  } finally {
    clearInterval(timer);
    btn.disabled = false;
    btn.textContent = '🌼 Soạn giáo án ngay';
  }
});

renderEmpty();
renderHistory();
