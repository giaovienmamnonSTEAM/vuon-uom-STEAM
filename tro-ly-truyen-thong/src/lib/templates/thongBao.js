// Soạn THÔNG BÁO theo mẫu (không dùng AI).
// Chỉ dùng thông tin giáo viên nhập; thiếu thông tin quan trọng thì để [chỗ trống].
import { NOTICE_TYPES, labelOf } from '../catalog.js';
import { blocks, lines, pick, sentence, splitItems, t, upper, lopName, lowerFirst } from '../text.js';

const TYPE_INFO = {
  'nghi-le': {
    title: 'Lịch nghỉ lễ, nghỉ học',
    close: ['Kính chúc Quý phụ huynh và các cháu có kỳ nghỉ vui vẻ, an toàn.', 'Chúc gia đình và các con có những ngày nghỉ an toàn, đầm ấm.']
  },
  'hoc-tro-lai': {
    title: 'Lịch học trở lại, lịch dạy bù',
    close: ['Rất mong Quý phụ huynh đưa các cháu đến lớp đúng giờ.', 'Kính mong Quý phụ huynh sắp xếp đưa đón các cháu đúng lịch.']
  },
  'thoi-khoa-bieu': {
    title: 'Thay đổi thời khóa biểu',
    close: ['Kính mong Quý phụ huynh lưu ý để thuận tiện trong việc đưa đón các cháu.']
  },
  'do-dung': {
    title: 'Chuẩn bị đồ dùng cho trẻ',
    close: ['Xin cảm ơn sự quan tâm, chuẩn bị chu đáo của Quý phụ huynh.', 'Sự chuẩn bị của gia đình sẽ giúp các con tham gia hoạt động thuận lợi hơn.']
  },
  'trai-nghiem': {
    title: 'Tổ chức hoạt động trải nghiệm',
    close: ['Rất mong nhận được sự ủng hộ và phối hợp của Quý phụ huynh để hoạt động diễn ra an toàn, vui vẻ.']
  },
  'hop-phu-huynh': {
    title: 'Họp phụ huynh',
    close: ['Sự có mặt đầy đủ, đúng giờ của Quý phụ huynh sẽ góp phần vào thành công của buổi họp.', 'Rất mong Quý phụ huynh sắp xếp thời gian tham dự đầy đủ, đúng giờ.']
  },
  'suc-khoe': {
    title: 'Sức khỏe và an toàn của trẻ',
    close: ['Khi trẻ có biểu hiện bất thường về sức khỏe, Quý phụ huynh vui lòng đưa trẻ đến cơ sở y tế để được thăm khám và báo cho giáo viên biết.'],
    note: 'Thông tin về sức khỏe trong thông báo cần căn cứ hướng dẫn của nhà trường và cơ quan y tế.'
  },
  'khoan-thu': {
    title: 'Các khoản thu',
    close: ['Mọi thắc mắc về các khoản thu, Quý phụ huynh vui lòng liên hệ trực tiếp nhà trường hoặc giáo viên chủ nhiệm để được giải đáp.'],
    note: 'Các khoản thu chỉ ghi đúng theo thông tin nhà trường cung cấp; ứng dụng không tự thêm số tiền.'
  },
  khan: {
    title: 'Thông báo khẩn',
    close: ['Đề nghị Quý phụ huynh lưu ý và thực hiện kịp thời. Xin cảm ơn!']
  },
  khac: { title: 'Thông báo', close: ['Rất mong nhận được sự quan tâm, phối hợp của Quý phụ huynh.'] }
};

export function generateThongBao(d, settings = {}, variant = 0) {
  const info = TYPE_INFO[d.loai] || TYPE_INFO.khac;
  const truong = t(d.tenTruong);
  const lop = lopName(d.tenLop);
  const tieuDe = t(d.tieuDe) || info.title || labelOf(NOTICE_TYPES, d.loai);
  const doiTuong = t(d.doiTuong) || (lop ? `Quý phụ huynh lớp ${lop}` : 'Quý phụ huynh');
  const noiDung = splitItems(d.noiDung);
  const phoiHop = splitItems(d.phoiHop);
  const isKhan = d.loai === 'khan';
  const sdt = t(settings.soDienThoai);
  const gv = t(settings.tenGiaoVien);
  const notes = [];
  if (info.note) notes.push(info.note);

  const style = d.phongCach || 'trang-trong';
  let text;

  if (style === 'ngan-gon') {
    text = blocks(
      `${isKhan ? '❗ THÔNG BÁO KHẨN' : '📢 THÔNG BÁO'}: ${upper(tieuDe)}`,
      lines(
        `Kính gửi: ${doiTuong}`,
        noiDung.length === 1 ? `- Nội dung: ${sentence(noiDung[0])}` : noiDung.map((x) => `- ${sentence(x)}`),
        t(d.thoiGian) && `- Thời gian: ${t(d.thoiGian)}`,
        t(d.diaDiem) && `- Địa điểm: ${t(d.diaDiem)}`,
        phoiHop.length > 0 && `- Phụ huynh vui lòng: ${phoiHop.map(lowerFirst).join('; ')}.`,
        t(d.hanPhanHoi) && `- Phản hồi trước: ${t(d.hanPhanHoi)}`
      ),
      pick(['Trân trọng cảm ơn!', 'Xin cảm ơn Quý phụ huynh!'], variant),
      lines(lop ? `GVCN lớp ${lop}${gv ? ' – ' + gv : ''}` : gv, truong)
    );
  } else if (style === 'than-thien') {
    const greet = pick(
      [`Kính gửi các bố mẹ ${lop ? 'lớp ' + lop : ''} thân mến!`, `Cô xin chào các bố mẹ${lop ? ' lớp ' + lop : ''} ạ!`, `Thân gửi các bố mẹ${lop ? ' của các bạn nhỏ lớp ' + lop : ''}!`],
      variant
    ).replace(/\s+!/, '!');
    const intro = pick(
      ['Cô xin gửi tới các bố mẹ thông báo như sau:', 'Lớp mình có một thông tin quan trọng, các bố mẹ cùng đọc giúp cô nhé:', 'Cô xin phép thông tin tới gia đình nội dung sau ạ:'],
      variant
    );
    text = blocks(
      `${isKhan ? '❗ THÔNG BÁO KHẨN' : '🌼 THÔNG BÁO'}: ${tieuDe}`,
      greet,
      intro,
      lines(
        noiDung.map((x) => `🔹 ${sentence(x)}`),
        t(d.thoiGian) && `🕘 Thời gian: ${t(d.thoiGian)}`,
        t(d.diaDiem) && `📍 Địa điểm: ${t(d.diaDiem)}`
      ),
      phoiHop.length > 0 && lines('Các bố mẹ giúp cô:', phoiHop.map((x) => `✅ ${sentence(x)}`)),
      t(d.hanPhanHoi) && `Bố mẹ phản hồi giúp cô trước ${t(d.hanPhanHoi)} nhé.`,
      pick(
        ['Cô cảm ơn các bố mẹ đã luôn đồng hành cùng lớp ạ! 💐', 'Cảm ơn các bố mẹ rất nhiều ạ! 💐', 'Cô cảm ơn sự quan tâm của các bố mẹ ạ! 🌸'],
        variant
      ),
      sdt && `Mọi thông tin cần trao đổi, bố mẹ liên hệ: ${sdt}.`
    );
  } else {
    const intro = pick(
      [
        `${truong || (lop ? 'Lớp ' + lop : 'Nhà trường')} trân trọng thông báo tới ${doiTuong} nội dung như sau:`,
        `${truong || (lop ? 'Lớp ' + lop : 'Nhà trường')} xin thông báo tới ${doiTuong} một số nội dung sau:`
      ],
      variant
    );
    const items = [];
    let n = 1;
    if (noiDung.length === 1) items.push(`${n++}. Nội dung: ${sentence(noiDung[0])}`);
    else if (noiDung.length > 1) items.push(`${n++}. Nội dung:\n${noiDung.map((x) => `- ${sentence(x)}`).join('\n')}`);
    if (t(d.thoiGian)) items.push(`${n++}. Thời gian: ${t(d.thoiGian)}.`.replace(/\.\.$/, '.'));
    if (t(d.diaDiem)) items.push(`${n++}. Địa điểm: ${t(d.diaDiem)}.`.replace(/\.\.$/, '.'));
    if (phoiHop.length) items.push(`${n++}. Đề nghị Quý phụ huynh phối hợp:\n${phoiHop.map((x) => `- ${sentence(x)}`).join('\n')}`);
    if (t(d.hanPhanHoi)) items.push(`${n++}. Thời hạn phản hồi: ${t(d.hanPhanHoi)}.`.replace(/\.\.$/, '.'));

    text = blocks(
      lines(truong && upper(truong), lop && `Lớp: ${lop}`),
      lines(isKhan ? 'THÔNG BÁO KHẨN' : 'THÔNG BÁO', `V/v: ${tieuDe}`),
      `Kính gửi: ${doiTuong}.`.replace(/\.\.$/, '.'),
      intro,
      items.join('\n'),
      pick(info.close, variant),
      sdt && `Mọi thông tin xin liên hệ: ${sdt}.`,
      'Trân trọng thông báo!',
      lines(lop ? 'GIÁO VIÊN CHỦ NHIỆM' : 'T/M NHÀ TRƯỜNG', gv)
    );
  }

  return { text, title: `Thông báo: ${tieuDe}`, notes, missing: [] };
}
