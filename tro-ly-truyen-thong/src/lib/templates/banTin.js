// Soạn BẢN TIN TUẦN theo mẫu (không dùng AI).
// Chỉ đưa vào những mục giáo viên đã nhập; không tự thêm tình hình sức khỏe, kết quả học tập.
import { blocks, lines, pick, sentence, splitItems, t, upper, lopName } from '../text.js';

const SECTIONS = [
  { key: 'hocTap', icon: '📚', title: 'Hoạt động học tập nổi bật' },
  { key: 'vuiChoi', icon: '🧩', title: 'Hoạt động vui chơi' },
  { key: 'ngoaiTroi', icon: '🌳', title: 'Hoạt động ngoài trời' },
  { key: 'anNgu', icon: '🍚', title: 'Ăn, ngủ và nề nếp chung' },
  { key: 'phoiHop', icon: '🤝', title: 'Bố mẹ cùng phối hợp với cô' },
  { key: 'tuanToi', icon: '📅', title: 'Tuần tới, các con sẽ' }
];

export function generateBanTin(d, settings = {}, variant = 0) {
  const lop = lopName(d.tenLop);
  const tuan = t(d.tuanHoc);
  const chuDe = t(d.chuDe);

  const title = pick(
    [
      `🌈 BẢN TIN TUẦN${lop ? ' – LỚP ' + upper(lop) : ''}`,
      `☀️ MỘT TUẦN CỦA CÁC BẠN NHỎ${lop ? ' LỚP ' + upper(lop) : ''}`,
      `🎈 CÙNG NHÌN LẠI TUẦN HỌC${lop ? ' – LỚP ' + upper(lop) : ''}`
    ],
    variant
  );
  const sub = lines(tuan && `🗓 ${tuan}`, chuDe && `🎯 Chủ đề: ${chuDe}`);

  const moDau = pick(
    [
      `Kính gửi các bố mẹ thân mến! Cô xin gửi tới gia đình những hoạt động của các con${lop ? ' lớp ' + lop : ''} trong tuần vừa qua${chuDe ? `, với chủ đề “${chuDe}”` : ''}.`,
      `Các bố mẹ thân mến! Một tuần nữa lại trôi qua, cô cùng các con${lop ? ' lớp ' + lop : ''} đã có nhiều hoạt động${chuDe ? ` xoay quanh chủ đề “${chuDe}”` : ''}. Cùng điểm lại nhé!`,
      `Chào các bố mẹ! Cô xin chia sẻ với gia đình bản tin tuần${tuan ? ' ' + tuan : ''} của lớp mình.`
    ],
    variant
  );

  const parts = SECTIONS.map((s) => {
    const items = splitItems(d[s.key]);
    if (!items.length) return '';
    return lines(`${s.icon} ${s.title.toLocaleUpperCase('vi')}`, items.map((x) => `- ${sentence(x)}`));
  });

  const ket = pick(
    [
      'Cảm ơn các bố mẹ đã luôn đồng hành cùng cô và các con. Chúc gia đình một cuối tuần vui vẻ, đầm ấm! 💐',
      'Mỗi ngày đến lớp là một ngày vui. Cảm ơn các bố mẹ đã cùng cô chăm sóc, yêu thương các con! 🌸',
      'Cô cảm ơn sự quan tâm, phối hợp của các bố mẹ. Hẹn gặp lại các con vào tuần tới nhé! 🌼'
    ],
    variant
  );

  const ky = lines(t(settings.tenGiaoVien) && `Cô giáo: ${t(settings.tenGiaoVien)}`, t(settings.tenTruong));

  const text = blocks(title, sub, moDau, ...parts, ket, ky);
  return {
    text,
    title: `Bản tin tuần${tuan ? ' ' + tuan : ''}${lop ? ' – ' + lop : ''}`,
    notes: ['Bản tin chỉ gồm các mục bạn đã nhập. Ứng dụng không tự thêm nhận xét sức khỏe hay kết quả học tập.'],
    missing: []
  };
}
