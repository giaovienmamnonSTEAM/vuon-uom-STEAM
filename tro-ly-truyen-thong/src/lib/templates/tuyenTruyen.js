// Soạn BÀI TUYÊN TRUYỀN theo mẫu, lấy nội dung từ kho kiến thức (kienThuc.js).
import { AGE_GROUPS, TOPICS, labelOf } from '../catalog.js';
import { KIEN_THUC } from './kienThuc.js';
import { blocks, lines, pick, sentence, t, upper, lopName } from '../text.js';

function rotate(arr, n) {
  if (!arr.length) return arr;
  const k = n % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

export function generateTuyenTruyen(d, settings = {}, variant = 0) {
  const kt = KIEN_THUC[d.chuDe] || KIEN_THUC['dinh-duong'];
  const tuoi = labelOf(AGE_GROUPS, d.doTuoi) || '';
  const ageTips = kt.byAge[d.doTuoi] || [];
  const doDai = d.doDai || 'vua';
  const tips = rotate(kt.tips, variant).slice(0, doDai === 'ngan' ? 3 : doDai === 'vua' ? 4 : 5);
  const mucTieu = t(d.mucTieu);
  const doiTuongDoc = t(d.doiTuongDoc);
  const boiCanh = t(d.boiCanh);
  const truong = t(d.tenTruong);
  const lop = lopName(d.tenLop);
  const ky = lines(lop && `Lớp ${lop}`, truong);
  const hinhThuc = d.hinhThuc || 'bai-viet';
  let text;

  if (hinhThuc === 'zalo') {
    text = blocks(
      `🌱 GÓC CHIA SẺ: ${kt.title.toLocaleUpperCase('vi')}`,
      pick(['Kính gửi các bố mẹ!', 'Các bố mẹ thân mến!', 'Chào các bố mẹ!'], variant) +
        (boiCanh ? ` ${sentence(boiCanh)}` : '') +
        ` Cô xin chia sẻ vài gợi ý nhỏ cho các bé${tuoi ? ' ' + tuoi : ''}:`,
      lines([...tips.slice(0, 3), ...ageTips.slice(0, 1)].map((x) => `✅ ${x}`)),
      kt.medical && `⚕️ ${kt.medical}`,
      `💐 ${kt.slogan}`
    );
  } else if (hinhThuc === 'bang-tin') {
    text = blocks(
      upper(kt.title),
      tuoi && `(Dành cho phụ huynh có con ${tuoi})`,
      lines('BỐ MẸ HÃY:', tips.map((x) => `• ${x}`)),
      ageTips.length > 0 && lines(`LƯU Ý VỚI TRẺ ${upper(tuoi)}:`, ageTips.map((x) => `• ${x}`)),
      kt.medical && lines('KHI NÀO CẦN HỎI Ý KIẾN CÁN BỘ Y TẾ?', `• ${kt.medical}`),
      `“${kt.slogan}”`,
      ky
    );
  } else {
    const moDau = doiTuongDoc
      ? `Kính gửi ${doiTuongDoc.charAt(0).toLocaleUpperCase('vi') + doiTuongDoc.slice(1)}!`
      : pick(['Kính gửi Quý phụ huynh!', 'Thưa các bậc phụ huynh!', 'Kính thưa Quý phụ huynh!'], variant);
    text = blocks(
      upper(kt.title),
      tuoi && `Bài tuyên truyền dành cho phụ huynh có con ${tuoi}`,
      moDau,
      lines(kt.intro, boiCanh && sentence(boiCanh), mucTieu && `Bài viết này mong muốn: ${sentence(mucTieu.charAt(0).toLocaleLowerCase('vi') + mucTieu.slice(1))}`),
      lines('1. Gia đình có thể làm gì?', tips.map((x) => `- ${x}`)),
      ageTips.length > 0 && lines(`2. Lưu ý riêng với trẻ ${tuoi}`, ageTips.map((x) => `- ${x}`)),
      kt.medical && lines(`${ageTips.length ? 3 : 2}. Khi nào cần hỏi ý kiến cán bộ y tế?`, kt.medical),
      pick(
        [
          'Mỗi việc làm nhỏ hằng ngày của gia đình đều góp phần giúp trẻ phát triển khỏe mạnh, vui vẻ. Nhà trường rất mong tiếp tục nhận được sự đồng hành của Quý phụ huynh.',
          'Rất mong gia đình và nhà trường cùng chung tay để các con được chăm sóc, giáo dục tốt nhất.'
        ],
        variant
      ),
      `“${kt.slogan}”`,
      ky
    );
  }

  return {
    text,
    title: `Tuyên truyền: ${labelOf(TOPICS, d.chuDe)}${tuoi ? ' (' + tuoi + ')' : ''}`,
    notes: [
      'Nội dung lấy từ kho kiến thức phổ thông có sẵn trong ứng dụng. Bạn nên đọc lại, bổ sung cho phù hợp thực tế lớp và hướng dẫn của nhà trường, cơ quan y tế.'
    ],
    missing: []
  };
}
