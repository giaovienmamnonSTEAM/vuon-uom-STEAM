// Soạn THƯ MỜI theo mẫu (không dùng AI). Bố cục trang trọng, dễ dán sang Word/Canva.
import { blocks, lines, pick, sentence, splitItems, t, upper, missingCollector } from '../text.js';

const TYPE_INFO = {
  'hop-dau-nam': {
    heading: 'GIẤY MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Tới dự buổi họp phụ huynh đầu năm học',
    close: [
      'Buổi họp là dịp để nhà trường, giáo viên và gia đình cùng trao đổi, thống nhất kế hoạch chăm sóc, giáo dục các cháu trong năm học mới. Rất mong Quý phụ huynh sắp xếp thời gian tham dự đầy đủ, đúng giờ.',
      'Sự có mặt đầy đủ của Quý phụ huynh sẽ góp phần vào thành công của buổi họp và công tác phối hợp chăm sóc, giáo dục các cháu.'
    ]
  },
  'hop-cuoi-nam': {
    heading: 'GIẤY MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Tới dự buổi họp phụ huynh cuối năm học',
    close: ['Rất mong Quý phụ huynh sắp xếp thời gian tham dự đầy đủ, đúng giờ để buổi họp đạt kết quả tốt.']
  },
  'khai-giang': {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Tới dự',
    close: [
      'Sự hiện diện của Quý vị là niềm vinh dự và nguồn động viên to lớn đối với thầy cô giáo và các cháu trong ngày hội đến trường.',
      'Sự có mặt của Quý vị góp phần làm nên thành công của buổi lễ và là niềm vui lớn của các cháu trong ngày khai giảng.'
    ]
  },
  'tong-ket': {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Tới dự',
    close: ['Sự có mặt của Quý vị là niềm vinh dự của nhà trường và niềm vui của các cháu trong ngày lễ tổng kết.']
  },
  'ngay-hoi-den-truong': {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý phụ huynh và các bé',
    lead: 'Tới tham gia',
    close: ['Nhà trường rất mong được đón tiếp Quý phụ huynh và các bé trong ngày hội.']
  },
  steam: {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Tới tham dự và cổ vũ',
    close: ['Sự có mặt và cổ vũ của Quý vị là nguồn động viên lớn để các bé tự tin khám phá, sáng tạo.']
  },
  'trai-nghiem': {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý phụ huynh',
    lead: 'Cùng tham gia',
    close: ['Rất mong Quý phụ huynh cùng đồng hành với các bé trong hoạt động trải nghiệm.']
  },
  'su-kien': {
    heading: 'THƯ MỜI',
    defaultGuest: 'Quý vị',
    lead: 'Tới dự',
    close: ['Sự hiện diện của Quý vị là niềm vinh dự đối với nhà trường.']
  }
};

export function generateThuMoi(d, settings = {}, variant = 0) {
  const info = TYPE_INFO[d.loai] || TYPE_INFO['su-kien'];
  const mc = missingCollector();
  const chuQuan = t(d.donViChuQuan);
  const truong = t(d.tenTruong);
  const suKien = mc.need(d.tenSuKien, 'Tên sự kiện');
  const thoiGian = mc.need(d.thoiGian, 'Thời gian');
  const diaDiem = mc.need(d.diaDiem, 'Địa điểm');
  const khach = t(d.thanhPhan) || info.defaultGuest;
  const ct = splitItems(d.chuongTrinh);
  const luuY = splitItems(d.luuY);
  // Không tự thêm quốc hiệu, đơn vị chủ quản, người ký: chỉ ghi khi giáo viên cung cấp.
  const coQuocHieu = d.quocHieu === 'co';
  const chucVu = upper(d.chucVuKy);
  const ngay = t(d.diaDanhNgay) || (coQuocHieu ? mc.need('', 'địa danh, ngày ký') : '');

  const loiKet = t(d.loiKet) ? sentence(d.loiKet) : pick(info.close, variant);
  const tenSK = suKien.charAt(0).toLocaleUpperCase('vi') + suKien.slice(1);

  const text = blocks(
    lines(chuQuan && upper(chuQuan), truong && upper(truong)),
    coQuocHieu && lines('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 'Độc lập – Tự do – Hạnh phúc'),
    ngay,
    lines(info.heading, upper(tenSK)),
    `${pick(['Trân trọng kính mời', 'Trân trọng kính mời'], variant)}: ${khach}`,
    `${info.lead}: ${tenSK}.`.replace(/\.\.$/, '.'),
    lines(`🕘 Thời gian: ${thoiGian}`, `📍 Địa điểm: ${diaDiem}`).replace(/[🕘📍] /gu, '- '),
    ct.length > 0 && lines('Nội dung chương trình:', ct.map((x, i) => `${i + 1}. ${sentence(x)}`)),
    luuY.length > 0 && lines('Lưu ý:', luuY.map((x) => `- ${sentence(x)}`)),
    loiKet,
    'Trân trọng kính mời!',
    (chucVu || t(d.nguoiKy)) && lines(chucVu, chucVu && !t(d.nguoiKy) ? '(Ký, ghi rõ họ tên)' : '', t(d.nguoiKy))
  );

  const notes = [];
  if (mc.missing.length) notes.push(`Còn thiếu: ${mc.missing.join(', ')} — đã đánh dấu [CẦN BỔ SUNG] để bạn điền.`);
  notes.push('Mẹo: khi dán sang Word, căn giữa phần quốc hiệu, tiêu đề và khối ký tên; trên Canva, dán từng khối vào ô chữ riêng.');
  return { text, title: `Thư mời: ${tenSK}`, notes, missing: mc.missing };
}
