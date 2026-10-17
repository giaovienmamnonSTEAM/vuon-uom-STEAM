// Prompt cho AI — ghép ở MÁY CHỦ để endpoint /api/generate không bị dùng gọi AI tuỳ ý.
// Thư mục bắt đầu bằng "_" nên Vercel không coi file này là một route.

export const TASKS = ['thong-bao', 'tin-nhan', 'thu-moi', 'ban-tin', 'tuyen-truyen', 'truyen-thong', 'bien-tap'];

export const SYSTEM_PROMPT = `Bạn là trợ lý truyền thông của giáo viên mầm non Việt Nam. Bạn viết thông báo, tin nhắn, thư mời, bản tin, bài tuyên truyền và bài truyền thông gửi phụ huynh, cộng đồng.

Nguyên tắc bắt buộc:
- Viết tiếng Việt có dấu chuẩn, đúng chính tả, câu rõ ràng, lịch sự, phù hợp môi trường giáo dục mầm non.
- CHỈ dùng thông tin giáo viên cung cấp. Không tự bịa tên người, tên trường, ngày giờ, địa điểm, số tiền, số liệu, thành tích, kết quả học tập hay tình hình sức khỏe. Nếu thiếu thông tin quan trọng, để chỗ trống dạng [Thời gian], [Địa điểm]… cho giáo viên tự điền.
- Giữ nguyên chính xác mọi ngày tháng, giờ, số liệu, tên riêng giáo viên đưa ra.
- Không phán xét trẻ, không đổ lỗi cho phụ huynh, không dùng từ ngữ gây tổn thương hoặc dễ hiểu lầm. Không nêu thông tin riêng tư của trẻ.
- Về sức khỏe: không chẩn đoán, không khuyên dùng thuốc hay liều lượng; khuyến khích phụ huynh hỏi ý kiến cán bộ y tế khi cần.
- Trình bày dạng văn bản thuần để dán vào Zalo, Facebook, Word: KHÔNG dùng Markdown (không **, không #, không bảng). Dùng xuống dòng, gạch đầu dòng "-" hoặc số thứ tự. Biểu tượng cảm xúc chỉ dùng vừa phải với văn phong thân thiện, không dùng với văn phong trang trọng/hành chính.
- Chỉ trả về đúng nội dung hoàn chỉnh. Không mở đầu bằng câu như "Dưới đây là…", không giải thích, không ghi chú cho giáo viên ở cuối.`;

const STYLE = {
  'ngan-gon': 'Ngắn gọn, dễ hiểu: câu ngắn, đi thẳng vào ý chính, ưu tiên gạch đầu dòng.',
  'than-thien': 'Thân thiện, gần gũi: xưng "cô" – gọi "bố mẹ"/"các bố mẹ" (trừ khi giáo viên chỉ định cách gọi khác), giọng ấm áp, có thể dùng vài biểu tượng cảm xúc.',
  'trang-trong': 'Trang trọng, lịch sự: dùng "Quý phụ huynh", "các cháu", không dùng biểu tượng cảm xúc.'
};

const LENGTH = {
  ngan: 'Độ dài ngắn: khoảng 60–100 chữ.',
  vua: 'Độ dài vừa: khoảng 150–250 chữ.',
  'chi-tiet': 'Độ dài chi tiết: khoảng 300–450 chữ, chia đoạn rõ ràng.'
};

const LABELS = {
  loai: 'Loại', tenTruong: 'Tên trường', tenLop: 'Tên lớp', doiTuong: 'Đối tượng nhận', tieuDe: 'Tiêu đề',
  noiDung: 'Nội dung chính', thoiGian: 'Thời gian', diaDiem: 'Địa điểm', phoiHop: 'Phụ huynh cần phối hợp',
  hanPhanHoi: 'Hạn phản hồi', xungHo: 'Cách gọi phụ huynh', tenGiaoVien: 'Tên giáo viên gửi', donViChuQuan: 'Đơn vị chủ quản',
  tenSuKien: 'Tên sự kiện', thanhPhan: 'Thành phần tham dự', chuongTrinh: 'Nội dung chương trình', luuY: 'Lưu ý',
  loiKet: 'Lời kết giáo viên muốn dùng', diaDanhNgay: 'Địa danh, ngày ký', chucVuKy: 'Chức vụ người ký', nguoiKy: 'Họ tên người ký',
  tuanHoc: 'Tuần học', chuDe: 'Chủ đề', hocTap: 'Hoạt động học tập nổi bật', vuiChoi: 'Hoạt động vui chơi',
  ngoaiTroi: 'Hoạt động ngoài trời', anNgu: 'Ăn, ngủ, nề nếp chung', tuanToi: 'Dự kiến tuần tới', doTuoi: 'Độ tuổi của trẻ',
  hinhThuc: 'Hình thức', boiCanh: 'Bối cảnh', doDai: 'Độ dài', diemNoiBat: 'Diễn biến, điểm nổi bật',
  thongDiep: 'Thông điệp', hashtag: 'Hashtag riêng', diaChi: 'Địa chỉ trường', soDienThoai: 'Số điện thoại liên hệ', namHoc: 'Năm học'
};

const TASK_GUIDE = {
  'thong-bao': 'Soạn một THÔNG BÁO gửi phụ huynh. Có tiêu đề, lời kính gửi, nội dung theo ý rõ ràng (thời gian, địa điểm, việc phụ huynh cần phối hợp, hạn phản hồi nếu có), lời cảm ơn và phần ký tên phù hợp. Với thông báo khoản thu, chỉ ghi đúng các khoản và số tiền được cung cấp. Với thông báo khẩn, nêu điều cần làm ngay ở đầu.',
  'tin-nhan': 'Soạn một TIN NHẮN gửi phụ huynh qua Zalo/điện thoại. Mở đầu bằng lời chào, nội dung ngắn gọn, kết bằng lời cảm ơn. Với tình huống nhạy cảm hoặc nề nếp: mô tả hành vi cụ thể một cách khách quan, nhẹ nhàng, nói rõ cô sẽ hỗ trợ con thế nào, mời phụ huynh cùng phối hợp hoặc trao đổi trực tiếp; tuyệt đối không dán nhãn trẻ, không trách phụ huynh, không nhắc tên trẻ khác.',
  'thu-moi': 'Soạn một THƯ MỜI/GIẤY MỜI trang trọng, bố cục dễ dán sang Word hoặc Canva: tên đơn vị chủ quản và tên trường (viết hoa), quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" – "Độc lập – Tự do – Hạnh phúc", địa danh ngày tháng (để "…, ngày … tháng … năm …" nếu chưa có), tiêu đề THƯ MỜI, "Trân trọng kính mời:", tên sự kiện, thời gian, địa điểm, chương trình và lưu ý (nếu có), lời kết, "Trân trọng kính mời!", chức vụ và họ tên người ký (nếu có).',
  'ban-tin': 'Soạn BẢN TIN TUẦN của lớp gửi phụ huynh: tiêu đề hấp dẫn, lời mở đầu thân thiện, các mục có tiêu đề nhỏ (chỉ những mục có thông tin), lời kết tích cực. Không thêm hoạt động, nhận xét sức khỏe hay kết quả học tập không có trong dữ liệu.',
  'tuyen-truyen': 'Soạn bài TUYÊN TRUYỀN kiến thức nuôi dạy trẻ cho phụ huynh, đúng độ tuổi được chọn: dễ hiểu, thực tế, có những việc cụ thể gia đình làm được tại nhà. Nếu chủ đề liên quan sức khỏe, thêm ý khuyến khích hỏi ý kiến cán bộ y tế khi cần. Hình thức "Tin ngắn gửi Zalo": dưới 150 chữ. "Bảng tin": tiêu đề và các gạch đầu dòng ngắn. "Bài tuyên truyền đầy đủ": có mở bài, các mục, kết bài.',
  'truyen-thong': 'Soạn BÀI TRUYỀN THÔNG cho kênh của nhà trường theo loại bài và độ dài được chọn: có tiêu đề, nội dung chính, lời kết; với Facebook/Zalo/bài lan tỏa thêm 3–6 hashtag phù hợp ở cuối (dùng hashtag riêng của trường nếu có). Bài website không cần hashtag, văn phong báo chí giáo dục. Không thêm số liệu, thành tích, tên người hay chi tiết sự kiện không có trong dữ liệu.'
};

const EDIT_GUIDE = {
  'sua-chinh-ta': 'Sửa lỗi chính tả, dấu câu, viết hoa, khoảng trắng. Giữ nguyên câu chữ và ý của tác giả ở mức tối đa, chỉ sửa lỗi.',
  'than-thien': 'Viết lại cho thân thiện, gần gũi hơn (xưng cô – gọi bố mẹ), vẫn lịch sự.',
  'rut-gon': 'Rút gọn còn khoảng một nửa độ dài, giữ đủ mọi thông tin quan trọng.',
  'trang-trong': 'Viết lại trang trọng, lịch sự hơn, bỏ biểu tượng cảm xúc.',
  'ro-rang': 'Viết lại rõ ràng, dễ hiểu hơn: câu ngắn, sắp xếp ý mạch lạc, tách các ý thành gạch đầu dòng khi cần.',
  zalo: 'Chuyển thành tin nhắn Zalo gửi nhóm phụ huynh: ngắn gọn, thân thiện, dễ đọc trên điện thoại.',
  'thong-bao': 'Chuyển thành thông báo chính thức: có tiêu đề THÔNG BÁO, V/v, kính gửi, nội dung theo mục, lời kết, ký tên.',
  'hanh-chinh': 'Viết lại theo văn phong và thể thức văn bản hành chính (tên cơ quan, số, quốc hiệu tiêu ngữ, địa danh ngày tháng, trích yếu, nội dung, nơi nhận, chức vụ người ký). Những chỗ chưa có thông tin để "…".',
  'ba-phien-ban': 'Tạo BA phiên bản khác nhau để giáo viên chọn: (1) ngắn gọn, (2) thân thiện, (3) trang trọng. Mở đầu mỗi bản bằng một dòng tiêu đề dạng "━━━━ PHIÊN BẢN 1 – NGẮN GỌN ━━━━".',
  'phien-ban-moi': 'Viết một phiên bản khác của nội dung này với câu chữ mới, cùng mục đích và văn phong.'
};

const MAX_FIELD = 4000;
const clip = (v, max = MAX_FIELD) => (typeof v === 'string' ? v.slice(0, max).trim() : '');

function fieldsBlock(data = {}, labelsOf = {}) {
  const rows = [];
  for (const [k, v] of Object.entries(data)) {
    if (!LABELS[k]) continue; // chỉ nhận các trường đã biết
    const val = clip(v);
    if (!val) continue;
    const shown = labelsOf[k] ? `${labelsOf[k]}` : val;
    rows.push(`- ${LABELS[k]}: ${shown.includes('\n') ? '\n  ' + shown.replace(/\n/g, '\n  ') : shown}`);
  }
  return rows.join('\n') || '(không có)';
}

// labels: nhãn tiếng Việt của các giá trị chọn (VD: loai: "Lịch nghỉ lễ"), do trình duyệt gửi kèm.
export function buildUserMessage({ task, data = {}, labels = {}, settings = {}, action, text, variant = 0 }) {
  const safeLabels = {};
  for (const [k, v] of Object.entries(labels || {})) if (LABELS[k]) safeLabels[k] = clip(v, 200);

  if (task === 'bien-tap') {
    const guide = EDIT_GUIDE[action] || EDIT_GUIDE['sua-chinh-ta'];
    return [
      `Yêu cầu biên tập: ${guide}`,
      'Giữ nguyên thông tin, ngày tháng, giờ, số liệu và ý nghĩa ban đầu. Không thêm dữ kiện mới.',
      fieldsBlock(settings) !== '(không có)' ? `Thông tin nhà trường (chỉ dùng khi cần cho bố cục):\n${fieldsBlock(settings)}` : '',
      `Văn bản gốc:\n"""\n${clip(text, 12000)}\n"""`
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  const parts = [TASK_GUIDE[task]];
  if (data.phongCach && STYLE[data.phongCach]) parts.push(`Văn phong: ${STYLE[data.phongCach]}`);
  if (data.doDai && LENGTH[data.doDai]) parts.push(LENGTH[data.doDai]);
  parts.push(`Thông tin giáo viên cung cấp:\n${fieldsBlock(data, safeLabels)}`);
  const s = fieldsBlock(settings);
  if (s !== '(không có)') parts.push(`Thông tin nhà trường đã lưu (dùng khi phù hợp, ví dụ ký tên, số điện thoại liên hệ):\n${s}`);
  if (variant > 0) parts.push(`Đây là lần soạn thứ ${variant + 1}: hãy viết một phiên bản mới với câu chữ khác các lần trước.`);
  return parts.join('\n\n');
}
