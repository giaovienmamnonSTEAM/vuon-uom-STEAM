/* ============ DỮ LIỆU DÙNG CHUNG ============ */

export const AGES = [
  {
    id: 'nt', label: 'Nhà trẻ 24–36 tháng', short: 'Nhà trẻ<br>24–36 tháng', time: '10 – 15 phút',
    linhVuc: [
      'Phát triển nhận thức – Nhận biết (khám phá)',
      'Phát triển ngôn ngữ – Nhận biết tập nói',
      'Phát triển ngôn ngữ – Thơ',
      'Phát triển ngôn ngữ – Truyện',
      'Phát triển thể chất – Vận động',
      'TC-KNXH & Thẩm mĩ – Âm nhạc',
      'TC-KNXH & Thẩm mĩ – Tạo hình',
      'Trải nghiệm – Làm sản phẩm đơn giản'
    ]
  },
  {
    id: 'mgb', label: 'Mẫu giáo bé 3–4 tuổi', short: 'Mẫu giáo bé<br>3–4 tuổi', time: '15 – 20 phút',
    linhVuc: null
  },
  {
    id: 'mgn', label: 'Mẫu giáo nhỡ 4–5 tuổi', short: 'Mẫu giáo nhỡ<br>4–5 tuổi', time: '20 – 25 phút',
    linhVuc: null
  },
  {
    id: 'mgl', label: 'Mẫu giáo lớn 5–6 tuổi', short: 'Mẫu giáo lớn<br>5–6 tuổi', time: '25 – 35 phút',
    linhVuc: null
  }
];

export const LINH_VUC_MAU_GIAO = [
  'Phát triển nhận thức – Khám phá khoa học',
  'Phát triển nhận thức – Khám phá xã hội',
  'Phát triển nhận thức – Làm quen với toán',
  'Phát triển ngôn ngữ – Làm quen chữ cái',
  'Phát triển ngôn ngữ – Thơ',
  'Phát triển ngôn ngữ – Truyện',
  'Phát triển thể chất – Vận động',
  'Phát triển thẩm mĩ – Âm nhạc',
  'Phát triển thẩm mĩ – Tạo hình',
  'Trải nghiệm – Chế tạo sản phẩm',
  'Trải nghiệm – Nấu ăn / chế biến món ăn',
  'Phát triển TC-KNXH – Kỹ năng sống'
];

export function linhVucFor(ageId) {
  const a = AGES.find((x) => x.id === ageId);
  return a?.linhVuc || LINH_VUC_MAU_GIAO;
}

// Gợi ý quy trình theo loại hoạt động (nguyên tắc Thầy Phúc).
export function suggestProcess(linhVuc) {
  if (!linhVuc) return '';
  if (/Tạo hình|Chế tạo|Nấu ăn|sản phẩm/i.test(linhVuc)) {
    return 'Gợi ý: EDP — nếu sản phẩm có tính ứng dụng thật (dùng được, ăn được, chạy được...). Tô/xé/nặn theo mẫu thì không nên gán EDP.';
  }
  return 'Gợi ý: 5E — hoạt động mang tính tìm tòi, khám phá (STEAM một phần hoặc toàn phần).';
}

export const STEAM_LABELS = [
  ['S', 'Science (Khoa học)'],
  ['T', 'Technology (Công nghệ)'],
  ['E', 'Engineering (Kỹ thuật)'],
  ['A', 'Art (Nghệ thuật)'],
  ['M', 'Mathematics (Toán học)']
];

export const SKILL_LABELS = [
  ['tu_duy_phan_bien', 'Critical Thinking – Tư duy phản biện'],
  ['sang_tao', 'Creativity – Sáng tạo'],
  ['hop_tac', 'Collaboration – Hợp tác'],
  ['giao_tiep', 'Communication – Giao tiếp']
];

export const PREP_CO_LABELS = [
  ['tam_the_tam_ly_suc_khoe', 'Tâm thế – tâm lý – sức khỏe'],
  ['chuyen_mon', 'Chuyên môn'],
  ['do_dung_hoc_lieu', 'Đồ dùng – học liệu – nguyên vật liệu'],
  ['moi_truong', 'Môi trường'],
  ['an_toan', 'An toàn']
];

export const PREP_TRE_LABELS = [
  ['tam_the_tam_ly_suc_khoe', 'Tâm thế – tâm lý – sức khỏe'],
  ['do_dung_nguyen_lieu', 'Đồ dùng – nguyên vật liệu'],
  ['trang_phuc', 'Trang phục'],
  ['an_toan', 'An toàn']
];

export function splitLines(s) {
  return String(s ?? '').split(/\n+/).map((x) => x.trim()).filter(Boolean);
}

export function fileSlug(s) {
  return (String(s || 'STEAM')
    .normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'STEAM').slice(0, 60);
}

/* ============ XUẤT VĂN BẢN THUẦN ============ */
export function planToText(p) {
  const ti = p.thong_tin || {};
  const md = p.muc_dich_yeu_cau || {};
  const kt = md.kien_thuc || {};
  const kn = md.ky_nang || {};
  const cb = p.chuan_bi || {};
  const L = [];
  const list = (arr, pad = '  ') => (arr || []).forEach((x) => L.push(`${pad}- ${x}`));

  L.push('GIÁO ÁN STEAM', '');
  [
    ['Tên hoạt động', ti.ten_hoat_dong], ['Chủ đề', ti.chu_de], ['Lĩnh vực', ti.linh_vuc],
    ['Độ tuổi', ti.do_tuoi], ['Thời gian', ti.thoi_gian], ['Hình thức', ti.hinh_thuc],
    ['Quy trình', ti.quy_trinh], ['Áp dụng STEAM', ti.muc_do_steam]
  ].forEach(([k, v]) => v && L.push(`${k}: ${v}`));

  L.push('', 'I. MỤC ĐÍCH – YÊU CẦU', '1. Kiến thức');
  STEAM_LABELS.forEach(([k, label]) => {
    L.push(`${k} – ${label}:`);
    list(kt[k]?.length ? kt[k] : ['Không áp dụng.']);
  });
  L.push('2. Kỹ năng', "* Nhóm kỹ năng 4C's:");
  SKILL_LABELS.forEach(([k, label]) => { if (kn[k]?.length) { L.push(`  ${label}:`); list(kn[k], '    '); } });
  if (kn.ky_nang_khac?.length) { L.push('* Kỹ năng khác:'); list(kn.ky_nang_khac); }
  L.push('3. Thái độ'); list(md.thai_do);

  L.push('', 'II. CHUẨN BỊ', '1. Chuẩn bị của Cô');
  PREP_CO_LABELS.forEach(([k, label]) => { if (cb.co?.[k]?.length) { L.push(`${label}:`); list(cb.co[k]); } });
  L.push('2. Chuẩn bị của Trẻ');
  PREP_TRE_LABELS.forEach(([k, label]) => { if (cb.tre?.[k]?.length) { L.push(`${label}:`); list(cb.tre[k]); } });
  if (cb.phu_huynh?.length) { L.push('3. Phối hợp chuẩn bị với Phụ huynh học sinh'); list(cb.phu_huynh); }

  L.push('', 'III. CÁCH TIẾN HÀNH');
  (p.cach_tien_hanh || []).forEach((s) => {
    L.push('', `${s.ten_buoc}${s.thoi_gian ? ` (${s.thoi_gian})` : ''}`);
    if (s.muc_dich) L.push(`Mục đích: ${s.muc_dich}`);
    (s.luot || []).forEach((l) => {
      L.push('[Cô]'); splitLines(l.co).forEach((x) => L.push('  ' + x));
      L.push('[Trẻ]'); splitLines(l.tre).forEach((x) => L.push('  ' + x));
    });
    if (s.tich_hop_steam) L.push(`→ Tích hợp STEAM: ${s.tich_hop_steam}`);
  });
  return L.join('\n');
}
