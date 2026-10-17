// Soạn BÀI TRUYỀN THÔNG của nhà trường theo mẫu (không dùng AI).
// Không tự tạo số liệu, thành tích, tên người hay thông tin sự kiện chưa được cung cấp.
import { blocks, lines, pick, sentence, splitItems, t, upper, hashtag, lowerFirst } from '../text.js';

const TYPE_INFO = {
  facebook: { tags: ['#MamNon', '#HocMaChoi'], open: ['✨', '🌈', '🎈'] },
  website: { tags: [], open: [''] },
  zalo: { tags: [], open: ['📣', '🌼'] },
  'gioi-thieu': { tags: ['#MamNon', '#HoatDongGiaoDuc'], open: ['🌱', '📚'] },
  'chuyen-de': { tags: ['#MamNon', '#ChuyenDe'], open: ['📌', '🌱'] },
  'tong-ket': { tags: ['#MamNon', '#SuKien'], open: ['🎉', '🌟'] },
  'bieu-duong': { tags: ['#MamNon', '#LanToaYeuThuong'], open: ['🌟', '💐'] }
};

const KET = {
  facebook: [
    'Cảm ơn Quý phụ huynh đã luôn đồng hành cùng nhà trường trên hành trình nuôi dưỡng và giáo dục các bé!',
    'Hãy cùng nhà trường lưu giữ những khoảnh khắc đáng yêu này của các bé nhé!'
  ],
  website: [
    'Nhà trường trân trọng cảm ơn sự quan tâm, phối hợp của Quý phụ huynh và các đơn vị liên quan.',
    'Nhà trường sẽ tiếp tục tổ chức nhiều hoạt động bổ ích, góp phần nâng cao chất lượng chăm sóc, giáo dục trẻ.'
  ],
  zalo: ['Trân trọng cảm ơn Quý phụ huynh!', 'Cảm ơn các bố mẹ đã luôn đồng hành cùng nhà trường!'],
  'gioi-thieu': ['Rất mong Quý phụ huynh tiếp tục quan tâm, ủng hộ các hoạt động giáo dục của nhà trường.'],
  'chuyen-de': ['Mong rằng những chia sẻ trên sẽ hữu ích với Quý phụ huynh trong việc chăm sóc, giáo dục các con.'],
  'tong-ket': ['Xin chân thành cảm ơn tất cả những người đã góp phần làm nên thành công của hoạt động.'],
  'bieu-duong': ['Xin trân trọng ghi nhận và lan tỏa những việc làm đẹp này đến toàn thể cộng đồng nhà trường.']
};

const Y_NGHIA = {
  facebook: 'Những hoạt động như thế này giúp các bé được trải nghiệm, khám phá và thêm yêu trường, yêu lớp.',
  website: 'Hoạt động tạo cơ hội để trẻ được trải nghiệm, thể hiện bản thân, đồng thời tăng cường sự gắn kết giữa nhà trường và gia đình.',
  zalo: '',
  'gioi-thieu': 'Thông qua hoạt động, trẻ được học qua chơi, qua trải nghiệm thực tế, phù hợp với đặc điểm lứa tuổi mầm non.',
  'chuyen-de': 'Sự phối hợp giữa gia đình và nhà trường là yếu tố quan trọng giúp trẻ phát triển toàn diện.',
  'tong-ket': 'Hoạt động là dịp để các bé được vui chơi, trải nghiệm và gắn kết hơn với thầy cô, bạn bè.',
  'bieu-duong': 'Mỗi việc làm tốt, dù nhỏ, đều là tấm gương đẹp để các bé học tập và noi theo.'
};

export function generateTruyenThong(d, settings = {}, variant = 0) {
  const loai = d.loai || 'facebook';
  const info = TYPE_INFO[loai] || TYPE_INFO.facebook;
  const doDai = d.doDai || 'vua';
  const truong = t(d.tenTruong);
  const chuDe = t(d.chuDe) || '[Tên hoạt động]';
  const thoiGian = t(d.thoiGian);
  const diaDiem = t(d.diaDiem);
  const thanhPhan = lowerFirst(d.thanhPhan);
  const diem = splitItems(d.diemNoiBat);
  const thongDiep = t(d.thongDiep);
  const icon = pick(info.open, variant);
  const isPast = ['tong-ket', 'bieu-duong'].includes(loai);

  // Tiêu đề
  const tieuDe =
    loai === 'website'
      ? upper(`${truong || 'Nhà trường'} ${isPast ? 'tổ chức thành công' : 'tổ chức'} ${chuDe}`)
      : `${icon ? icon + ' ' : ''}${upper(chuDe)}${icon ? ' ' + icon : ''}`;

  // Câu mở
  const ctx = [thoiGian && thoiGian, diaDiem && `tại ${lowerFirst(diaDiem)}`].filter(Boolean).join(', ');
  const moDau = pick(
    [
      `${ctx ? cap(ctx) + ', ' : ''}${truong || 'nhà trường'} ${isPast ? 'đã tổ chức' : 'tổ chức'} ${chuDe}${thanhPhan ? ` với sự tham gia của ${thanhPhan}` : ''}.`,
      `${cap(chuDe)}${ctx ? ` diễn ra ${ctx}` : ''}${thanhPhan ? `, với sự tham gia của ${thanhPhan}` : ''}.`
    ],
    variant
  );

  const diemBlock =
    diem.length > 0
      ? loai === 'website' || doDai === 'chi-tiet'
        ? lines(doDai === 'chi-tiet' ? 'Những hoạt động nổi bật:' : '', diem.map((x) => `- ${sentence(x)}`))
        : lines(diem.map((x) => `${loai === 'facebook' ? '🔸' : '-'} ${sentence(x)}`))
      : '';

  const yNghia = doDai !== 'ngan' ? Y_NGHIA[loai] : '';
  const td = thongDiep && (loai === 'website' ? `Thông điệp: “${thongDiep}”.` : `💬 “${thongDiep}”`);
  const ket = pick(KET[loai] || KET.facebook, variant);

  // Hashtag
  const tags = [];
  if (t(d.hashtag)) tags.push(...t(d.hashtag).split(/[\s,]+/).filter(Boolean).map((x) => (x.startsWith('#') ? x : '#' + x)));
  if (truong) tags.push(hashtag(truong.replace(/^trường\s+/i, '').replace(/\(.*?\)/g, '')));
  tags.push(...info.tags);
  if (/steam/i.test(chuDe)) tags.push('#STEAM');
  if (/trải nghiệm/i.test(chuDe)) tags.push('#TraiNghiem');
  const uniqTags = [...new Set(tags.filter(Boolean))].slice(0, 6).join(' ');
  const showTags = !['website'].includes(loai);

  let body;
  if (doDai === 'ngan') {
    body = blocks(tieuDe, moDau, diem.length ? lines(diem.slice(0, 3).map((x) => `- ${sentence(x)}`)) : '', td, showTags && uniqTags);
  } else {
    body = blocks(
      tieuDe,
      moDau,
      diemBlock,
      yNghia,
      td,
      ket,
      loai === 'website' && truong && `${truong}`,
      showTags && uniqTags
    );
  }

  const notes = [];
  if (!diem.length) notes.push('Bạn chưa nhập diễn biến/điểm nổi bật nên bài chỉ có phần mở đầu và lời kết. Hãy bổ sung để bài sinh động hơn.');
  notes.push('Bài chỉ dùng thông tin bạn cung cấp; ứng dụng không tự thêm số liệu, thành tích hay tên người.');
  return { text: body, title: `${chuDe}`, notes, missing: [] };
}

function cap(s) {
  return s ? s.charAt(0).toLocaleUpperCase('vi') + s.slice(1) : s;
}
