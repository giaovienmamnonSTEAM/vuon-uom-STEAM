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

// [ký hiệu, tên tiếng Anh, tên tiếng Việt] — file Word/văn bản ghi "S – Science:" như mẫu của giáo viên.
export const STEAM_LABELS = [
  ['S', 'Science', 'Khoa học'],
  ['T', 'Technology', 'Công nghệ'],
  ['E', 'Engineering', 'Kỹ thuật'],
  ['A', 'Art', 'Nghệ thuật'],
  ['M', 'Mathematics', 'Toán học']
];

export const SKILL_LABELS = [
  ['tu_duy_phan_bien', 'Critical Thinking (Tư duy phản biện)'],
  ['sang_tao', 'Creativity (Sáng tạo)'],
  ['hop_tac', 'Collaboration (Hợp tác)'],
  ['giao_tiep', 'Communication (Giao tiếp)']
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

// Mục có thể là một câu (định dạng mới) hoặc mảng (giáo án cũ trong lịch sử) — luôn trả về mảng.
export function toList(v) {
  if (Array.isArray(v)) return v.map((x) => String(x ?? '').trim()).filter(Boolean);
  const t = String(v ?? '').trim();
  return t ? [t] : [];
}

export function steamItems(kt, k) {
  const items = toList(kt?.[k]);
  return items.length ? items : ['Không áp dụng.'];
}

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

  L.push('GIÁO ÁN STEAM', '');
  [
    ['Tên hoạt động', ti.ten_hoat_dong], ['Chủ đề', ti.chu_de], ['Lĩnh vực', ti.linh_vuc],
    ['Độ tuổi', ti.do_tuoi], ['Thời gian', ti.thoi_gian], ['Hình thức', ti.hinh_thuc],
    ['Quy trình', ti.quy_trinh], ['Áp dụng STEAM', ti.muc_do_steam]
  ].forEach(([k, v]) => v && L.push(`${k}: ${v}`));

  // Một ý thì viết cùng dòng với nhãn, nhiều ý thì xuống dòng thành các gạch "+".
  const item = (label, v, pad = '') => {
    const xs = toList(v);
    if (!xs.length) return;
    if (xs.length === 1) L.push(`${pad}- ${label}: ${xs[0]}`);
    else { L.push(`${pad}- ${label}:`); xs.forEach((x) => L.push(`${pad}  + ${x}`)); }
  };

  L.push('', 'I. MỤC ĐÍCH - YÊU CẦU', '1. Kiến thức');
  STEAM_LABELS.forEach(([k, en]) => item(`${k} – ${en}`, steamItems(kt, k)));
  L.push('2. Kỹ năng', "- Nhóm kỹ năng 4C's:");
  SKILL_LABELS.forEach(([k, label]) => toList(kn[k]).forEach((x) => L.push(`  + ${label}: ${x}`)));
  item('Kỹ năng khác', kn.ky_nang_khac);
  L.push('3. Thái độ'); toList(md.thai_do).forEach((x) => L.push(`- ${x}`));

  L.push('', 'II. CHUẨN BỊ', '1. Chuẩn bị của Cô');
  PREP_CO_LABELS.forEach(([k, label]) => item(label, cb.co?.[k]));
  L.push('2. Chuẩn bị của Trẻ');
  PREP_TRE_LABELS.forEach(([k, label]) => item(label, cb.tre?.[k]));
  if (toList(cb.phu_huynh).length) { L.push('3. Phối hợp chuẩn bị với Phụ huynh học sinh'); toList(cb.phu_huynh).forEach((x) => L.push(`- ${x}`)); }

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
