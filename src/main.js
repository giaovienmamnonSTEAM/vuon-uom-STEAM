import './style.css';
import { flowerSVG } from './flower.js';
import { generateLessonPlan } from './api.js';

document.getElementById('logoMark').innerHTML = flowerSVG(56);
document.getElementById('emptyFlower').innerHTML = flowerSVG(120);

/* ============ FORM STATE ============ */
let selectedAge = null;
document.querySelectorAll('.age-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.age-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedAge = btn.dataset.age;
  });
});
document.querySelectorAll('.qt-option').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    document.querySelectorAll('.qt-option').forEach(o=>o.classList.remove('active'));
    opt.classList.add('active');
    opt.querySelector('input').checked = true;
  });
});

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ============ RENDER ============ */
let currentPlan = null;
let currentTab = 'giaoan';

function esc(s){
  if(s===undefined||s===null) return '';
  return String(s);
}
function listHTML(arr){
  if(!arr || !arr.length) return '<p style="color:var(--ink-soft);font-size:13px;">(Không có)</p>';
  return '<ul>' + arr.map(x=>`<li>${esc(x)}</li>`).join('') + '</ul>';
}

function renderResult(){
  const wrap = document.getElementById('resultWrap');
  const p = currentPlan;
  const ti = p.thong_tin || {};

  const tabs = [
    {id:'giaoan', label:'📘 Giáo án'},
    {id:'bangghichep', label:'📋 Bảng ghi chép'},
    {id:'trochoi', label:'🎲 Trò chơi'},
    {id:'hocliệu', label:'🧺 Học liệu & PPT'},
    {id:'ai', label:'✨ Gợi ý AI'},
    {id:'danhgia', label:'⭐ Đánh giá & Mở rộng'},
  ];

  let html = `
  <div class="result-head">
    <div class="eyebrow">Giáo án STEAM · ${esc(ti.quy_trinh)}</div>
    <h2>${esc(ti.de_tai)}</h2>
    <div class="result-meta">
      <span>Chủ đề: <b>${esc(ti.chu_de)}</b></span>
      <span>Độ tuổi: <b>${esc(ti.do_tuoi)}</b></span>
      <span>Thời gian: <b>${esc(ti.thoi_gian)}</b></span>
      <span>Hình thức: <b>${esc(ti.hinh_thuc)}</b></span>
    </div>
    ${ti.ly_do_chon_quy_trinh ? `<div class="step-note" style="margin-top:12px;">💡 ${esc(ti.ly_do_chon_quy_trinh)}</div>` : ''}
    <div class="toolbar">
      <button class="tool-btn" id="copyBtn">📋 Sao chép toàn bộ</button>
      <button class="tool-btn" id="downloadBtn">⬇️ Tải về (.txt)</button>
      <button class="tool-btn" id="printBtn">🖨️ In giáo án</button>
      <button class="tool-btn" id="newBtn">🌼 Soạn giáo án mới</button>
    </div>
  </div>

  <div class="tabs">
    ${tabs.map(t=>`<button class="tab-btn ${t.id===currentTab?'active':''}" data-tab="${t.id}">${t.label}</button>`).join('')}
  </div>

  <div id="tabContent"></div>
  `;
  wrap.innerHTML = html;

  document.querySelectorAll('.tab-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      currentTab = b.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderTabContent();
    });
  });
  document.getElementById('copyBtn').addEventListener('click', copyAll);
  document.getElementById('downloadBtn').addEventListener('click', downloadTxt);
  document.getElementById('printBtn').addEventListener('click', ()=>window.print());
  document.getElementById('newBtn').addEventListener('click', resetForm);

  renderTabContent();
}

function renderTabContent(){
  const p = currentPlan;
  const target = document.getElementById('tabContent');
  let html = '';

  if(currentTab === 'giaoan'){
    const md = p.muc_dich_yeu_cau || {};
    const letters = [['S','Khoa học'],['T','Công nghệ'],['E','Kỹ thuật'],['A','Nghệ thuật'],['M','Toán học']];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--s-blue)">I</span>Mục đích – Yêu cầu (5 thành tố S-T-E-A-M)</h3>
      <div class="steam-grid">
      ${letters.map(([k,label])=>{
        const items = md[k] || [];
        if(!items.length) return '';
        return `<div class="steam-item ${k}"><div class="letter">${k}</div><div class="body"><b>${k} – ${label}</b><ul>${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></div>`;
      }).join('')}
      </div></div>`;

    const cb = p.chuan_bi || {};
    html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">II</span>Chuẩn bị</h3>
      <div class="prep-grid">
        <div class="prep-col"><div class="prep-title">👩‍🏫 Giáo viên</div>${listHTML(cb.giao_vien)}</div>
        <div class="prep-col"><div class="prep-title">🧒 Trẻ</div>${listHTML(cb.tre)}</div>
        <div class="prep-col"><div class="prep-title">👪 Phụ huynh</div>${listHTML(cb.phu_huynh)}</div>
      </div></div>`;

    const steps = p.tien_hanh || [];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">III</span>Cách tiến hành</h3>`;
    steps.forEach(s=>{
      html += `<div class="step-block">
        <div class="step-title">${esc(s.ten_buoc)} ${s.thoi_gian?`<span class="step-time">${esc(s.thoi_gian)}</span>`:''}</div>
        <ul>${(s.noi_dung||[]).map(n=>`<li>${esc(n)}</li>`).join('')}</ul>
        ${s.ghi_chu_tich_hop_steam?`<div class="step-note">🌸 Tích hợp STEAM: ${esc(s.ghi_chu_tich_hop_steam)}</div>`:''}
      </div>`;
    });
    html += `</div>`;

    if(p.giao_duc_cuoi_bai){
      html += `<div class="section-card"><h3><span class="num" style="background:var(--m-green)">✓</span>Giáo dục cuối giáo án</h3>
        <div class="plain-block"><p>${esc(p.giao_duc_cuoi_bai)}</p></div></div>`;
    }
  }

  if(currentTab === 'bangghichep'){
    const bg = p.bang_ghi_chep || {};
    html += `<div class="section-card"><h3><span class="num" style="background:var(--s-blue)">📋</span>Bảng ghi chép</h3>`;
    if(bg.co_su_dung === false){
      html += `<div class="plain-block"><p>Hoạt động này không cần bảng ghi chép. ${esc(bg.mo_ta||'')}</p></div>`;
    } else {
      html += `<div class="plain-block"><p><b>${esc(bg.ten)}</b></p><p>${esc(bg.mo_ta)}</p></div>`;
    }
    html += `</div>`;
  }

  if(currentTab === 'trochoi'){
    const games = p.tro_choi || [];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--a-pink)">🎲</span>Trò chơi STEAM</h3>`;
    if(!games.length){ html += `<p style="color:var(--ink-soft)">Không có trò chơi.</p>`; }
    games.forEach(g=>{
      html += `<div class="game-card">
        <div class="g-title">${esc(g.ten)}</div>
        <div class="g-meta">🎯 Mục tiêu: ${esc(g.muc_tieu)}</div>
        <p>${esc(g.cach_choi)}</p>
      </div>`;
    });
    html += `</div>`;
  }

  if(currentTab === 'hocliệu'){
    html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">🧺</span>Danh mục học liệu</h3>${listHTML(p.hoc_lieu)}</div>`;
    const pp = p.noi_dung_powerpoint || [];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">🖥️</span>Nội dung PowerPoint gợi ý</h3>`;
    if(!pp.length){ html += `<p style="color:var(--ink-soft)">Không có.</p>`; }
    else{
      html += `<table class="eval-table"><thead><tr><th style="width:110px;">Slide</th><th>Nội dung</th></tr></thead><tbody>`;
      pp.forEach(s=>{ html += `<tr><td>${esc(s.slide)}</td><td>${esc(s.noi_dung)}</td></tr>`; });
      html += `</tbody></table>`;
    }
    html += `</div>`;
  }

  if(currentTab === 'ai'){
    const prompts = p.prompt_ai || [];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--t-purple)">✨</span>Gợi ý công cụ AI hỗ trợ</h3>`;
    if(!prompts.length){ html += `<p style="color:var(--ink-soft)">Không có gợi ý AI cho đề tài này.</p>`; }
    prompts.forEach((pr,idx)=>{
      html += `<div class="ai-prompt-card">
        <div class="ap-type">${esc(pr.loai)} <button class="copy-mini" data-copy-idx="${idx}">Sao chép</button></div>
        <div class="ap-text" id="apText${idx}">${esc(pr.prompt)}</div>
      </div>`;
    });
    html += `</div>`;
  }

  if(currentTab === 'danhgia'){
    const eval_ = p.phieu_danh_gia || [];
    html += `<div class="section-card"><h3><span class="num" style="background:var(--m-green)">⭐</span>Phiếu đánh giá trẻ</h3>`;
    if(!eval_.length){ html += `<p style="color:var(--ink-soft)">Không có tiêu chí.</p>`; }
    else{
      html += `<table class="eval-table"><thead><tr><th>Tiêu chí</th><th style="width:90px;">Đạt</th><th style="width:110px;">Chưa đạt</th></tr></thead><tbody>`;
      eval_.forEach(e=>{ html += `<tr><td>${esc(e.tieu_chi)}</td><td>☐</td><td>☐</td></tr>`; });
      html += `</tbody></table>`;
    }
    html += `</div>`;
    html += `<div class="section-card"><h3><span class="num" style="background:var(--e-orange)">🌱</span>Gợi ý mở rộng hoạt động</h3>${listHTML(p.goi_y_mo_rong)}</div>`;
  }

  target.innerHTML = html;

  if(currentTab === 'ai'){
    document.querySelectorAll('[data-copy-idx]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const idx = btn.dataset.copyIdx;
        const text = document.getElementById('apText'+idx).textContent;
        navigator.clipboard.writeText(text).then(()=>showToast('Đã sao chép prompt!'));
      });
    });
  }
}

/* ============ TEXT EXPORT ============ */
function planToText(p){
  const ti = p.thong_tin || {};
  let lines = [];
  lines.push('GIÁO ÁN STEAM MẦM NON');
  lines.push('Được tạo bởi: Trần Quỳ - Giáo viên mầm non STEAM');
  lines.push('='.repeat(50));
  lines.push(`Chủ đề: ${ti.chu_de || ''}`);
  lines.push(`Đề tài: ${ti.de_tai || ''}`);
  lines.push(`Độ tuổi: ${ti.do_tuoi || ''}`);
  lines.push(`Thời gian: ${ti.thoi_gian || ''}`);
  lines.push(`Hình thức: ${ti.hinh_thuc || ''}`);
  lines.push(`Quy trình: ${ti.quy_trinh || ''}`);
  lines.push('');
  lines.push('I. MỤC ĐÍCH - YÊU CẦU (5 thành tố S-T-E-A-M)');
  const md = p.muc_dich_yeu_cau || {};
  ['S','T','E','A','M'].forEach(k=>{
    if(md[k] && md[k].length){
      lines.push(`${k}:`);
      md[k].forEach(i=>lines.push(`  - ${i}`));
    }
  });
  lines.push('');
  lines.push('II. CHUẨN BỊ');
  const cb = p.chuan_bi || {};
  lines.push('1. Giáo viên:'); (cb.giao_vien||[]).forEach(i=>lines.push(`  - ${i}`));
  lines.push('2. Trẻ:'); (cb.tre||[]).forEach(i=>lines.push(`  - ${i}`));
  lines.push('3. Phụ huynh:'); (cb.phu_huynh||[]).forEach(i=>lines.push(`  - ${i}`));
  lines.push('');
  lines.push('III. CÁCH TIẾN HÀNH');
  (p.tien_hanh||[]).forEach(s=>{
    lines.push(`${s.ten_buoc} (${s.thoi_gian || ''})`);
    (s.noi_dung||[]).forEach(n=>lines.push(`  - ${n}`));
    if(s.ghi_chu_tich_hop_steam) lines.push(`  [Tích hợp STEAM: ${s.ghi_chu_tich_hop_steam}]`);
    lines.push('');
  });
  if(p.giao_duc_cuoi_bai){ lines.push('GIÁO DỤC CUỐI GIÁO ÁN'); lines.push(p.giao_duc_cuoi_bai); lines.push(''); }

  const bg = p.bang_ghi_chep || {};
  lines.push('BẢNG GHI CHÉP');
  lines.push(bg.co_su_dung===false ? (bg.mo_ta||'Không sử dụng bảng ghi chép.') : `${bg.ten || ''}: ${bg.mo_ta || ''}`);
  lines.push('');

  lines.push('TRÒ CHƠI STEAM');
  (p.tro_choi||[]).forEach(g=>{ lines.push(`- ${g.ten} | Mục tiêu: ${g.muc_tieu}`); lines.push(`  Cách chơi: ${g.cach_choi}`); });
  lines.push('');

  lines.push('HỌC LIỆU'); (p.hoc_lieu||[]).forEach(i=>lines.push(`  - ${i}`)); lines.push('');

  lines.push('NỘI DUNG POWERPOINT');
  (p.noi_dung_powerpoint||[]).forEach(s=>lines.push(`  - ${s.slide}: ${s.noi_dung}`));
  lines.push('');

  lines.push('GỢI Ý AI / PROMPT AI');
  (p.prompt_ai||[]).forEach(pr=>{ lines.push(`- ${pr.loai}: ${pr.prompt}`); });
  lines.push('');

  lines.push('PHIẾU ĐÁNH GIÁ TRẺ');
  (p.phieu_danh_gia||[]).forEach(e=>lines.push(`  - ${e.tieu_chi}  [Đạt]  [Chưa đạt]`));
  lines.push('');

  lines.push('GỢI Ý MỞ RỘNG HOẠT ĐỘNG');
  (p.goi_y_mo_rong||[]).forEach(i=>lines.push(`  - ${i}`));

  return lines.join('\n');
}

function copyAll(){
  const text = planToText(currentPlan);
  navigator.clipboard.writeText(text).then(()=>showToast('Đã sao chép toàn bộ giáo án!'));
}
function downloadTxt(){
  const text = planToText(currentPlan);
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ti = currentPlan.thong_tin || {};
  const fname = ('GiaoAn_' + (ti.de_tai||'STEAM')).replace(/[^\p{L}\p{N}]+/gu,'_').slice(0,60) + '.txt';
  a.href = url; a.download = fname; a.click();
  URL.revokeObjectURL(url);
  showToast('Đã tải file .txt!');
}
function resetForm(){
  document.getElementById('resultWrap').innerHTML = `
    <div class="empty-state">
      <div class="big-flower">${flowerSVG(120)}</div>
      <h3>Chưa có giáo án nào</h3>
      <p>Chọn độ tuổi, nhập chủ đề và đề tài ở bên trái, rồi bấm "Soạn giáo án ngay".</p>
    </div>`;
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ============ GENERATE FLOW ============ */
document.getElementById('genBtn').addEventListener('click', async ()=>{
  const chuDe = document.getElementById('chuDe').value.trim();
  const deTai = document.getElementById('deTai').value.trim();
  const ghiChu = document.getElementById('ghiChu').value.trim();
  const quyTrinh = document.querySelector('input[name="quytrinh"]:checked').value;

  if(!selectedAge){ showToast('Vui lòng chọn độ tuổi'); return; }
  if(!chuDe){ showToast('Vui lòng nhập chủ đề'); return; }
  if(!deTai){ showToast('Vui lòng nhập đề tài'); return; }

  const btn = document.getElementById('genBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Đang soạn...';

  const loadingMsgs = [
    'Đang đọc lại khung 5E và EDP...',
    'Đang chọn quy trình phù hợp...',
    'Đang lồng ghép 5 thành tố S-T-E-A-M...',
    'Đang thiết kế trò chơi và bảng ghi chép...'
  ];
  let msgIdx = 0;
  document.getElementById('resultWrap').innerHTML = `
    <div class="loading-state">
      <div class="spin-flower">${flowerSVG(88)}</div>
      <div class="loading-msg" id="loadingMsg">${loadingMsgs[0]}</div>
      <div class="loading-sub">Vui lòng chờ trong giây lát...</div>
    </div>`;
  const msgInterval = setInterval(()=>{
    msgIdx = (msgIdx+1) % loadingMsgs.length;
    const el = document.getElementById('loadingMsg');
    if(el) el.textContent = loadingMsgs[msgIdx];
  }, 1800);

  try{
    const plan = await generateLessonPlan({ doTuoi: selectedAge, chuDe, deTai, quyTrinh, ghiChu });
    currentPlan = plan;
    currentTab = 'giaoan';
    clearInterval(msgInterval);
    renderResult();
    window.scrollTo({top:0, behavior:'smooth'});
  }catch(err){
    clearInterval(msgInterval);
    document.getElementById('resultWrap').innerHTML = `
      <div class="error-state">
        <b>Đã có lỗi xảy ra khi soạn giáo án.</b><br>
        ${esc(err.message)}<br><br>
        Vui lòng thử lại. Nếu lỗi tiếp diễn, hãy thử rút gọn nội dung "Yêu cầu thêm" hoặc đổi đề tài.
      </div>`;
  }finally{
    btn.disabled = false;
    btn.textContent = '🌼 Soạn giáo án ngay';
  }
});
