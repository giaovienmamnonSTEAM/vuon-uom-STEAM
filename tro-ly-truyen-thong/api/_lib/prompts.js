// "Bộ não" AI dùng chung cho mọi đường gọi (Claude trên claude.ai và hàm máy chủ /api/generate).
// Prompt được ghép từ dữ liệu biểu mẫu đã lọc, nên không dùng được để gọi AI tuỳ ý.
// Thư mục bắt đầu bằng "_" nên Vercel không coi file này là một route.

export const TASKS = ['thong-bao', 'tin-nhan', 'thu-moi', 'ban-tin', 'tuyen-truyen', 'truyen-thong', 'bien-tap'];

// Dấu phân cách giữa nội dung gửi phụ huynh và ghi chú riêng cho giáo viên.
export const NOTES_MARKER = '===GHI CHÚ CHO GIÁO VIÊN===';
export const MISSING_TAG = '[CẦN BỔ SUNG';

export const SYSTEM_PROMPT = `Bạn là trợ lý truyền thông chuyên nghiệp của giáo viên mầm non Việt Nam. Bạn hiểu đặc điểm tâm lý phụ huynh có con từ 24 tháng đến 6 tuổi, hiểu môi trường trường mầm non và cách giao tiếp tích cực giữa nhà trường với gia đình. Bạn viết hộ một giáo viên những văn bản sẽ gửi thật tới phụ huynh, nhà trường và cộng đồng.

Cách viết
- Tiếng Việt chuẩn, đúng chính tả, dấu câu, viết hoa danh từ riêng và ngày lễ (Tết Nguyên đán, ngày Nhà giáo Việt Nam 20/11…).
- Tự nhiên như một cô giáo có kinh nghiệm viết cho phụ huynh: tôn trọng, ấm áp, rõ ràng. Phụ huynh đọc trên điện thoại, nên câu ngắn, mỗi đoạn một ý, thông tin cần làm theo (ngày giờ, việc cần chuẩn bị) đặt ở chỗ dễ thấy.
- Văn bản hành chính (thông báo, thư mời, văn phong trang trọng) phải rõ ràng, đủ ý, trang trọng nhưng không khô cứng.
- Tránh giọng máy móc và sáo rỗng: không mở đầu kiểu "Trong không khí…", "Nhằm…", không chồng chất "vô cùng", "hết sức", "tuyệt vời"; không lặp lại cùng một ý bằng nhiều câu.
- Xưng hô nhất quán trong cả văn bản (cô – bố mẹ/các con; hoặc nhà trường – Quý phụ huynh/các cháu).

Dữ kiện
- Chỉ dùng dữ kiện giáo viên cung cấp hoặc đã lưu trong Thiết lập thông tin. KHÔNG bịa tên trường, tên người, chức vụ người ký, ngày giờ, địa điểm, số tiền, số lượng trẻ, thành tích, kết quả, lời phát biểu, tình hình ăn ngủ hay sức khỏe.
- Giữ nguyên chính xác mọi ngày tháng, giờ, số liệu, tên riêng giáo viên đưa ra; không tự đổi hay "làm tròn".
- Thiếu một thông tin quan trọng để văn bản dùng được (ví dụ thời gian họp, địa điểm), đặt đúng chỗ đó dấu [CẦN BỔ SUNG: tên thông tin] và nêu trong phần ghi chú. Không tự điền giá trị giả định.
- Có thể thêm câu chữ chuyển ý, lời chào, lời cảm ơn, lời khuyên phổ thông đúng đắn; nhưng mọi ý mới mang tính dữ kiện hoặc lời khuyên chuyên môn do bạn tự thêm phải được liệt kê trong phần ghi chú để giáo viên kiểm tra.

An toàn và tôn trọng
- Không phán xét, dán nhãn trẻ ("hư", "lười", "chậm"…); không đổ lỗi cho phụ huynh; không so sánh trẻ với bạn khác; không nêu tên trẻ khác.
- Không chẩn đoán bệnh, không suy đoán về sự phát triển của trẻ, không khuyên dùng thuốc hay liều lượng; khi có vấn đề sức khỏe, khuyến khích phụ huynh hỏi ý kiến nhân viên y tế hoặc bác sĩ.
- Không đưa thêm thông tin cá nhân của trẻ ngoài những gì cần cho văn bản; nếu dữ liệu có họ tên đầy đủ của trẻ trong văn bản gửi nhóm chung, hãy nhắc trong ghi chú.

Định dạng trả lời (bắt buộc)
- Văn bản thuần để dán vào Zalo, Facebook, Word: KHÔNG Markdown (không **, không #, không bảng). Dùng xuống dòng, gạch đầu dòng "-" hoặc số thứ tự. Biểu tượng cảm xúc chỉ dùng vài cái với văn phong thân thiện; không dùng trong văn bản trang trọng/hành chính.
- Viết ngay nội dung hoàn chỉnh, không câu dẫn kiểu "Dưới đây là…".
- Sau nội dung, xuống dòng và viết đúng dòng ${NOTES_MARKER}, rồi liệt kê ngắn gọn bằng gạch đầu dòng: thông tin còn thiếu, những ý bạn tự thêm cần giáo viên kiểm tra, lưu ý trước khi gửi. Nếu không có gì, viết "- Không có.". Phần này chỉ dành cho giáo viên và sẽ được ứng dụng tách riêng.`;

const STYLE = {
  'ngan-gon': 'Ngắn gọn, dễ hiểu: câu ngắn, đi thẳng vào ý chính, ưu tiên gạch đầu dòng, bỏ lời rào đón.',
  'than-thien': 'Thân thiện, gần gũi: xưng "cô" – gọi "bố mẹ"/"các bố mẹ" (trừ khi giáo viên chỉ định cách gọi khác), giọng ấm áp, có thể dùng 1–3 biểu tượng cảm xúc.',
  'trang-trong': 'Trang trọng, lịch sự: dùng "Quý phụ huynh", "các cháu", không dùng biểu tượng cảm xúc.'
};

const LENGTH = {
  ngan: 'Độ dài: ngắn, khoảng 60–120 chữ.',
  vua: 'Độ dài: vừa, khoảng 150–280 chữ.',
  'chi-tiet': 'Độ dài: chi tiết, khoảng 300–500 chữ, chia đoạn/mục rõ ràng.'
};

const LABELS = {
  loai: 'Loại', tenTruong: 'Tên trường', tenLop: 'Tên lớp', doiTuong: 'Đối tượng nhận', tieuDe: 'Tiêu đề',
  lyDo: 'Lý do / mục đích', noiDung: 'Nội dung chính', thoiGian: 'Thời gian', diaDiem: 'Địa điểm', phoiHop: 'Phụ huynh cần phối hợp',
  hanPhanHoi: 'Hạn phản hồi', xungHo: 'Cách gọi phụ huynh', tenGiaoVien: 'Tên giáo viên', donViChuQuan: 'Đơn vị chủ quản',
  tenSuKien: 'Tên sự kiện', thanhPhan: 'Thành phần tham dự / được mời', chuongTrinh: 'Nội dung chương trình', luuY: 'Lưu ý',
  loiKet: 'Lời kết giáo viên muốn dùng', diaDanhNgay: 'Địa danh, ngày ký', chucVuKy: 'Chức vụ người ký', nguoiKy: 'Họ tên người ký',
  quocHieu: 'Ghi quốc hiệu, tiêu ngữ', tuanHoc: 'Tuần học', chuDe: 'Chủ đề', hocTap: 'Hoạt động học tập nổi bật', vuiChoi: 'Hoạt động vui chơi',
  ngoaiTroi: 'Hoạt động ngoài trời', anNgu: 'Ăn, ngủ, nề nếp chung', tuanToi: 'Dự kiến tuần tới', doTuoi: 'Độ tuổi của trẻ',
  hinhThuc: 'Hình thức', mucTieu: 'Mục tiêu bài tuyên truyền', doiTuongDoc: 'Đối tượng đọc', boiCanh: 'Bối cảnh',
  doDai: 'Độ dài', diemNoiBat: 'Diễn biến, điểm nổi bật', thongDiep: 'Thông điệp', hashtag: 'Hashtag riêng',
  diaChi: 'Địa chỉ trường', soDienThoai: 'Số điện thoại liên hệ', namHoc: 'Năm học'
};

const TASK_GUIDE = {
  'thong-bao': `Nhiệm vụ: soạn một THÔNG BÁO gửi phụ huynh.
Bố cục: tiêu đề (THÔNG BÁO + nội dung ngắn) → lời kính gửi đúng đối tượng → câu mở đầu nêu lý do/mục đích (nếu có) → nội dung chính theo ý → thời gian, địa điểm (nếu có) → việc phụ huynh cần làm, mỗi việc một dòng → hạn phản hồi (nếu có) → lời cảm ơn lịch sự → ký tên theo thông tin có sẵn (giáo viên chủ nhiệm lớp …), không bịa tên người ký.
Tự điều chỉnh: thông báo khẩn → nêu điều cần làm ngay ở 1–2 câu đầu, ngắn, rõ; thông báo khoản thu → chỉ ghi đúng các khoản và số tiền được cung cấp, không thêm khoản nào; nghỉ lễ → có thể thêm lời chúc ngắn và nhắc giữ an toàn cho trẻ; họp phụ huynh → nhấn mạnh thời gian, địa điểm, đề nghị tham dự đúng giờ.`,
  'tin-nhan': `Nhiệm vụ: soạn một TIN NHẮN gửi phụ huynh qua Zalo — đọc trên điện thoại, dễ gửi ngay.
Bố cục: lời chào → nội dung chính → việc cần phụ huynh làm (nếu có) → lời cảm ơn. Tin nhóm lớp không nhắc tên riêng của trẻ.
Tình huống nhạy cảm (hành vi, sức khỏe, sự phát triển, va chạm giữa các bạn): mô tả khách quan đúng sự việc giáo viên kể, không thêm chi tiết, không kết luận vượt quá thông tin; nói rõ ở lớp cô đã/sẽ hỗ trợ con thế nào; mời phụ huynh chia sẻ thêm hoặc trao đổi trực tiếp; không dán nhãn trẻ, không trách phụ huynh, không nhắc tên trẻ khác. Với vấn đề sức khỏe, gợi ý phụ huynh theo dõi và hỏi ý kiến nhân viên y tế/bác sĩ khi cần.`,
  'thu-moi': `Nhiệm vụ: soạn nội dung THƯ MỜI/GIẤY MỜI bố cục rõ ràng, dễ dán sang Word hoặc Canva.
Bố cục: đơn vị tổ chức (tên đơn vị chủ quản và tên trường — CHỈ khi có trong dữ liệu) → tiêu đề THƯ MỜI hoặc GIẤY MỜI → "Trân trọng kính mời:" người/thành phần được mời → tên sự kiện → thời gian → địa điểm → nội dung chương trình và lưu ý (nếu có) → lời kết trân trọng phù hợp loại sự kiện → "Trân trọng kính mời!" → chức vụ và họ tên người ký (CHỈ khi có trong dữ liệu).
Chỉ ghi quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM – Độc lập – Tự do – Hạnh phúc" khi mục "Ghi quốc hiệu, tiêu ngữ" là "Có". Không tự thêm địa danh, ngày ký, đơn vị chủ quản, người ký.`,
  'ban-tin': `Nhiệm vụ: tổng hợp BẢN TIN TUẦN của lớp gửi phụ huynh từ các hoạt động giáo viên cung cấp.
Bố cục: tiêu đề hấp dẫn (có tuần, chủ đề nếu có) → lời mở đầu thân thiện 1–2 câu → các mục có tiêu đề nhỏ, CHỈ cho những mục có dữ liệu (hoạt động nổi bật, vui chơi, ngoài trời, ăn ngủ nề nếp, phối hợp, tuần tới) → lời kết tích cực.
Có thể diễn đạt sinh động hoạt động đã có (con được làm gì, học được gì một cách khái quát), nhưng KHÔNG thêm hoạt động mới, KHÔNG suy đoán tình hình ăn, ngủ, sức khỏe hay sự tiến bộ của trẻ khi không có dữ liệu, KHÔNG nêu tên trẻ.`,
  'tuyen-truyen': `Nhiệm vụ: soạn bài TUYÊN TRUYỀN kiến thức nuôi dạy trẻ cho gia đình, đúng độ tuổi được chọn.
Yêu cầu: dễ hiểu với phụ huynh bình thường; thực tế, có những việc cụ thể gia đình làm được ngay tại nhà; phù hợp đặc điểm phát triển của lứa tuổi đó (24–36 tháng khác 5–6 tuổi); có thể đưa ví dụ tình huống quen thuộc trong gia đình Việt Nam. Chỉ đưa kiến thức phổ thông đã được thừa nhận rộng rãi; không đưa số liệu, nghiên cứu, mốc phát triển cụ thể hay khuyến cáo y tế nếu không chắc chắn. Chủ đề y tế, an toàn: thận trọng, nhắc tham khảo nhân viên y tế/bác sĩ, ghi số cấp cứu 115 khi nói về tai nạn.
Hình thức "Tin ngắn gửi Zalo": dưới 150 chữ. "Bảng tin": tiêu đề và các gạch đầu dòng ngắn để in dán bảng tuyên truyền. "Bài tuyên truyền đầy đủ": mở bài, các mục có tiêu đề, kết bài.`,
  'truyen-thong': `Nhiệm vụ: viết BÀI TRUYỀN THÔNG cho kênh của nhà trường theo loại bài và độ dài được chọn.
Bố cục: tiêu đề → phần mở đầu (sự kiện gì, khi nào, ở đâu — theo dữ liệu) → nội dung chính dựa trên diễn biến/điểm nổi bật được cung cấp → ý nghĩa khái quát của hoạt động với trẻ (không nêu kết quả cụ thể) → lời kết → hashtag nếu phù hợp.
Facebook/Zalo/bài lan tỏa: giọng gần gũi, 3–6 hashtag cuối bài (dùng hashtag riêng của trường nếu có). Website: văn phong tin bài giáo dục, không hashtag, không biểu tượng cảm xúc.
TUYỆT ĐỐI không bịa tên người tham dự, chức danh khách mời, thành tích, giải thưởng, số lượng trẻ/phụ huynh, kết quả sự kiện hay trích dẫn lời phát biểu.`
};

export const EDIT_GUIDE = {
  'sua-chinh-ta': 'Chỉ sửa lỗi chính tả, dấu câu, viết hoa, khoảng trắng. Giữ nguyên câu chữ, cách xưng hô và bố cục của tác giả ở mức tối đa.',
  'than-thien': 'Viết lại thân thiện, gần gũi hơn (xưng cô – gọi bố mẹ), vẫn lịch sự; giữ đủ mọi ý.',
  'rut-gon': 'Rút gọn còn khoảng một nửa độ dài: bỏ lời rào đón, ý lặp; giữ đủ mọi thông tin cần thiết (ai, việc gì, khi nào, ở đâu, cần làm gì).',
  'mo-rong': 'Mở rộng cho đầy đủ, mạch lạc hơn: thêm lời chào, câu chuyển ý, giải thích ngắn lý do và lời cảm ơn phù hợp. KHÔNG thêm dữ kiện mới (ngày giờ, số liệu, tên, sự việc); ý giải thích bạn thêm phải liệt kê trong ghi chú.',
  'trang-trong': 'Viết lại trang trọng, lịch sự hơn (Quý phụ huynh, các cháu), bỏ biểu tượng cảm xúc.',
  'ro-rang': 'Viết lại rõ ràng, dễ hiểu hơn: câu ngắn, sắp xếp ý mạch lạc, tách các việc cần làm thành gạch đầu dòng.',
  zalo: 'Chuyển thành tin nhắn Zalo gửi nhóm phụ huynh: ngắn gọn, thân thiện, dễ đọc trên điện thoại.',
  'thong-bao': 'Chuyển thành thông báo chính thức: tiêu đề THÔNG BÁO, V/v, kính gửi, nội dung theo mục, lời kết, ký tên (chỉ theo thông tin có sẵn).',
  'hanh-chinh': 'Viết lại theo văn phong và thể thức văn bản hành chính (tên cơ quan, số, quốc hiệu tiêu ngữ, địa danh ngày tháng, trích yếu, nội dung, nơi nhận, chức vụ người ký). Thông tin chưa có thì để [CẦN BỔ SUNG: …], không tự điền.',
  'ba-phien-ban': 'Tạo BA phiên bản khác nhau để giáo viên chọn: (1) ngắn gọn, (2) thân thiện, (3) trang trọng. Mở đầu mỗi bản bằng một dòng tiêu đề dạng "━━━━ PHIÊN BẢN 1 – NGẮN GỌN ━━━━".',
  'phien-ban-moi': 'Viết một phiên bản khác của nội dung này với câu chữ mới, cùng mục đích và văn phong.',
  'tuy-chinh': 'Sửa văn bản theo yêu cầu riêng của giáo viên ghi bên dưới. Chỉ thay đổi những gì yêu cầu nói tới, phần còn lại giữ nguyên.'
};

const MAX_FIELD = 4000;
const MAX_TEXT = 12000;
const MAX_INSTRUCTION = 500;
const clip = (v, max = MAX_FIELD) => (typeof v === 'string' ? v.slice(0, max).trim() : '');

function fieldsBlock(data = {}, labelsOf = {}) {
  const rows = [];
  for (const [k, v] of Object.entries(data || {})) {
    if (!LABELS[k]) continue; // chỉ nhận các trường đã biết
    const val = clip(v);
    if (!val) continue;
    const shown = labelsOf[k] ? `${labelsOf[k]}` : val;
    rows.push(`- ${LABELS[k]}: ${shown.includes('\n') ? '\n  ' + shown.replace(/\n/g, '\n  ') : shown}`);
  }
  return rows.join('\n');
}

// labels: nhãn tiếng Việt của các giá trị chọn (VD: loai: "Lịch nghỉ lễ"), do trình duyệt gửi kèm.
// instruction: yêu cầu chỉnh sửa riêng của giáo viên (chỉ với task "bien-tap", action "tuy-chinh").
export function buildUserMessage({ task, data = {}, labels = {}, settings = {}, action, text, instruction, variant = 0 }) {
  const safeLabels = {};
  for (const [k, v] of Object.entries(labels || {})) if (LABELS[k]) safeLabels[k] = clip(v, 200);
  const s = fieldsBlock(settings);

  if (task === 'bien-tap') {
    const guide = EDIT_GUIDE[action] || EDIT_GUIDE['sua-chinh-ta'];
    const ins = action === 'tuy-chinh' ? clip(instruction, MAX_INSTRUCTION) : '';
    return [
      `Nhiệm vụ: biên tập văn bản giáo viên đã có. ${guide}`,
      ins && `Yêu cầu của giáo viên: ${ins}`,
      'Giữ nguyên ý nghĩa, mọi ngày tháng, giờ, số liệu, tên riêng và dữ kiện của bản gốc. Không thêm dữ kiện mới. Giữ nguyên các dấu [CẦN BỔ SUNG: …] nếu có.',
      s && `Thông tin nhà trường đã lưu (chỉ dùng khi bố cục cần, ví dụ ký tên):\n${s}`,
      variant > 0 && `Đây là lần thứ ${variant + 1}: hãy dùng câu chữ khác các lần trước.`,
      `Văn bản gốc:\n"""\n${clip(text, MAX_TEXT)}\n"""`
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  const parts = [TASK_GUIDE[task]];
  if (data.phongCach && STYLE[data.phongCach]) parts.push(`Văn phong: ${STYLE[data.phongCach]}`);
  if (data.doDai && LENGTH[data.doDai]) parts.push(LENGTH[data.doDai]);
  parts.push(`Thông tin giáo viên nhập (đây là dữ kiện, giữ nguyên):\n${fieldsBlock(data, safeLabels) || '(trống)'}`);
  if (s) parts.push(`Thông tin trường/lớp/giáo viên đã lưu trong Thiết lập (dùng khi phù hợp: tên trường, lớp, ký tên, số điện thoại liên hệ; thông tin giáo viên nhập ở trên được ưu tiên nếu khác):\n${s}`);
  if (variant > 0) parts.push(`Đây là lần soạn thứ ${variant + 1}: viết một phiên bản mới với cách mở đầu, câu chữ khác các lần trước, dữ kiện giữ nguyên.`);
  return parts.join('\n\n');
}

// Bỏ câu dẫn kiểu "Dưới đây là…", ký hiệu Markdown; tách ghi chú cho giáo viên.
export function parseOutput(raw) {
  let x = String(raw || '').replace(/\r\n?/g, '\n').trim();
  let notes = [];
  const i = x.indexOf(NOTES_MARKER);
  if (i >= 0) {
    notes = x
      .slice(i + NOTES_MARKER.length)
      .split('\n')
      .map((l) => l.replace(/^\s*[-•*]\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1').trim())
      .filter((l) => l && !/^không có\.?$/i.test(l));
    x = x.slice(0, i);
  }
  x = x.replace(/^(dưới đây là|sau đây là|đây là)[^\n]*:\s*\n+/i, '');
  x = x.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#{1,6}\s+/gm, '');
  x = x.replace(/^```[a-z]*\n?|\n?```$/g, '');
  x = x.replace(/\n-{3,}\s*$/, '');
  return { text: x.trim(), notes };
}

// Giữ cho mã cũ: chỉ trả về phần nội dung.
export function cleanOutput(raw) {
  return parseOutput(raw).text;
}

export function isValidEditAction(a) {
  return Object.prototype.hasOwnProperty.call(EDIT_GUIDE, a);
}
