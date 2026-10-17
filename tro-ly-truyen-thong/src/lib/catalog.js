// Danh mục chức năng + mô tả biểu mẫu của từng chức năng.
// Giao diện biểu mẫu được dựng tự động từ các mô tả này (components/FormFields.jsx),
// nên thêm/bớt một ô nhập chỉ cần sửa ở đây.
//
// Thuộc tính một ô nhập:
//   name, label, type: text | textarea | select | chips
//   options (select/chips), placeholder, hint, required, rows
//   fromSettings: tên trường trong "Thiết lập thông tin" để tự điền sẵn
//   suggestions: gợi ý nhanh (datalist)

export const STYLES = [
  { value: 'ngan-gon', label: 'Ngắn gọn, dễ hiểu' },
  { value: 'than-thien', label: 'Thân thiện, gần gũi' },
  { value: 'trang-trong', label: 'Trang trọng, lịch sự' }
];

export const NOTICE_TYPES = [
  { value: 'nghi-le', label: 'Lịch nghỉ lễ, nghỉ học' },
  { value: 'hoc-tro-lai', label: 'Lịch học trở lại, lịch dạy bù' },
  { value: 'thoi-khoa-bieu', label: 'Thay đổi thời khóa biểu' },
  { value: 'do-dung', label: 'Chuẩn bị đồ dùng cho trẻ' },
  { value: 'trai-nghiem', label: 'Tổ chức hoạt động trải nghiệm' },
  { value: 'hop-phu-huynh', label: 'Họp phụ huynh' },
  { value: 'suc-khoe', label: 'Sức khỏe và an toàn của trẻ' },
  { value: 'khoan-thu', label: 'Các khoản thu (theo thông tin nhà trường cung cấp)' },
  { value: 'khan', label: 'Thông báo khẩn' },
  { value: 'khac', label: 'Thông báo khác' }
];

export const MESSAGE_TYPES = [
  { value: 'rieng', label: 'Tin nhắn riêng cho một phụ huynh' },
  { value: 'nhom', label: 'Tin nhắn gửi nhóm lớp' },
  { value: 'do-dung', label: 'Nhắc phụ huynh chuẩn bị đồ dùng' },
  { value: 'lich-hop', label: 'Nhắc lịch họp' },
  { value: 'ne-nep', label: 'Trao đổi về nề nếp sinh hoạt' },
  { value: 'dong-vien', label: 'Động viên phụ huynh phối hợp cùng giáo viên' },
  { value: 'nhay-cam', label: 'Trao đổi tình huống nhạy cảm (tế nhị, tôn trọng)' }
];

export const INVITE_TYPES = [
  { value: 'hop-dau-nam', label: 'Họp phụ huynh đầu năm' },
  { value: 'hop-cuoi-nam', label: 'Họp phụ huynh cuối năm' },
  { value: 'khai-giang', label: 'Lễ khai giảng' },
  { value: 'tong-ket', label: 'Lễ tổng kết năm học' },
  { value: 'ngay-hoi-den-truong', label: 'Ngày hội đến trường' },
  { value: 'steam', label: 'Hội thi, ngày hội STEAM' },
  { value: 'trai-nghiem', label: 'Hoạt động trải nghiệm' },
  { value: 'su-kien', label: 'Sự kiện của nhà trường' }
];

export const AGE_GROUPS = [
  { value: '24-36', label: '24–36 tháng' },
  { value: '3-4', label: '3–4 tuổi' },
  { value: '4-5', label: '4–5 tuổi' },
  { value: '5-6', label: '5–6 tuổi' }
];

export const TOPICS = [
  { value: 'dinh-duong', label: 'Dinh dưỡng và thói quen ăn uống' },
  { value: 've-sinh', label: 'Vệ sinh cá nhân' },
  { value: 'tai-nan', label: 'Phòng tránh tai nạn thương tích' },
  { value: 'ngon-ngu', label: 'Phát triển ngôn ngữ' },
  { value: 'cam-xuc', label: 'Phát triển cảm xúc và kỹ năng xã hội' },
  { value: 'lop-mot', label: 'Chuẩn bị tâm thế cho trẻ vào lớp Một' },
  { value: 'phoi-hop', label: 'Phối hợp giáo dục giữa gia đình và nhà trường' },
  { value: 'thiet-bi', label: 'Hạn chế thiết bị điện tử không phù hợp' },
  { value: 'tu-phuc-vu', label: 'Xây dựng thói quen tự phục vụ' },
  { value: 'moi-truong', label: 'Giáo dục bảo vệ môi trường' }
];

export const POST_TYPES = [
  { value: 'facebook', label: 'Bài đăng Facebook' },
  { value: 'website', label: 'Bài đăng website' },
  { value: 'zalo', label: 'Tin ngắn Zalo' },
  { value: 'gioi-thieu', label: 'Bài giới thiệu hoạt động giáo dục' },
  { value: 'chuyen-de', label: 'Bài tuyên truyền chuyên đề' },
  { value: 'tong-ket', label: 'Bài tổng kết sự kiện' },
  { value: 'bieu-duong', label: 'Bài biểu dương, lan tỏa gương tốt' }
];

export const LENGTHS = [
  { value: 'ngan', label: 'Ngắn' },
  { value: 'vua', label: 'Vừa' },
  { value: 'chi-tiet', label: 'Chi tiết' }
];

export const HISTORY_TYPES = [
  { value: 'thong-bao', label: 'Thông báo' },
  { value: 'tin-nhan', label: 'Tin nhắn' },
  { value: 'thu-moi', label: 'Thư mời' },
  { value: 'ban-tin', label: 'Bản tin tuần' },
  { value: 'tuyen-truyen', label: 'Tuyên truyền' },
  { value: 'truyen-thong', label: 'Bài truyền thông' },
  { value: 'bien-tap', label: 'Biên tập' }
];

export function labelOf(list, value) {
  return list.find((o) => o.value === value)?.label || '';
}

// ---------------------------------------------------------------------------
// Các chức năng soạn nội dung
// Dữ liệu mẫu (sample) là thông tin hư cấu để thử nhanh: không dùng tên thật,
// không chứa thông tin riêng tư của trẻ. Sau khi thử, giáo viên thay bằng
// thông tin của trường mình.
// ---------------------------------------------------------------------------

export const MODULES = [
  {
    id: 'thong-bao',
    title: 'Soạn thông báo',
    short: 'Thông báo',
    icon: '📢',
    color: 'bg-sky-100',
    desc: 'Thông báo nghỉ lễ, họp phụ huynh, chuẩn bị đồ dùng, thông báo khẩn…',
    fields: [
      { name: 'loai', label: 'Loại thông báo', type: 'select', options: NOTICE_TYPES, required: true },
      { name: 'tenTruong', label: 'Tên trường', type: 'text', fromSettings: 'tenTruong', placeholder: 'VD: Trường Mầm non …' },
      { name: 'tenLop', label: 'Tên lớp', type: 'text', fromSettings: 'tenLop', placeholder: 'VD: Mẫu giáo lớn A1' },
      {
        name: 'doiTuong', label: 'Đối tượng nhận thông báo', type: 'text',
        placeholder: 'VD: Phụ huynh lớp Mẫu giáo lớn A1',
        suggestions: ['Quý phụ huynh lớp', 'Toàn thể phụ huynh học sinh nhà trường', 'Phụ huynh các lớp mẫu giáo', 'Phụ huynh các nhóm nhà trẻ']
      },
      { name: 'tieuDe', label: 'Tiêu đề', type: 'text', placeholder: 'VD: Lịch nghỉ Tết Dương lịch' },
      { name: 'noiDung', label: 'Nội dung chính', type: 'textarea', rows: 4, required: true, placeholder: 'Ghi các ý chính, mỗi ý một dòng.' },
      { name: 'thoiGian', label: 'Thời gian', type: 'text', placeholder: 'VD: Từ thứ Năm 01/01 đến hết Chủ nhật 04/01' },
      { name: 'diaDiem', label: 'Địa điểm', type: 'text', placeholder: 'VD: Phòng học lớp A1' },
      { name: 'phoiHop', label: 'Yêu cầu phụ huynh phối hợp', type: 'textarea', rows: 3, placeholder: 'Mỗi yêu cầu một dòng.' },
      { name: 'hanPhanHoi', label: 'Hạn phản hồi (nếu có)', type: 'text', placeholder: 'VD: Trước 17h00 thứ Sáu, ngày 26/12' },
      { name: 'phongCach', label: 'Phong cách diễn đạt', type: 'chips', options: STYLES, required: true }
    ],
    defaults: { loai: 'nghi-le', phongCach: 'trang-trong' },
    sample: {
      loai: 'nghi-le',
      tenTruong: 'Trường Mầm non Ánh Dương (mẫu)',
      tenLop: 'Mẫu giáo lớn A1',
      doiTuong: 'Quý phụ huynh lớp Mẫu giáo lớn A1',
      tieuDe: 'Lịch nghỉ Tết Dương lịch',
      noiDung: 'Các con được nghỉ học dịp Tết Dương lịch theo kế hoạch của nhà trường\nCác con đi học trở lại bình thường vào thứ Hai, ngày 05/01',
      thoiGian: 'Từ thứ Năm, ngày 01/01 đến hết Chủ nhật, ngày 04/01',
      diaDiem: '',
      phoiHop: 'Nhắc nhở và trông giữ các con an toàn trong những ngày nghỉ\nCho các con ngủ nghỉ đúng giờ để đi học lại đúng giờ',
      hanPhanHoi: '',
      phongCach: 'trang-trong'
    },
    validate: (d) => (!d.noiDung?.trim() && !d.tieuDe?.trim() ? 'Vui lòng nhập ít nhất Tiêu đề hoặc Nội dung chính.' : '')
  },
  {
    id: 'tin-nhan',
    title: 'Tin nhắn phụ huynh',
    short: 'Tin nhắn',
    icon: '💬',
    color: 'bg-la',
    desc: 'Tin nhắn riêng, tin nhóm lớp, nhắc lịch, trao đổi tế nhị với phụ huynh.',
    fields: [
      { name: 'loai', label: 'Loại tin nhắn', type: 'select', options: MESSAGE_TYPES, required: true },
      {
        name: 'xungHo', label: 'Cách gọi phụ huynh', type: 'text',
        placeholder: 'VD: anh chị / bố mẹ bé / các bố mẹ',
        hint: 'Không cần ghi họ tên đầy đủ hay thông tin riêng tư của trẻ.',
        suggestions: ['anh chị', 'bố mẹ bé', 'các bố mẹ', 'Quý phụ huynh']
      },
      { name: 'tenGiaoVien', label: 'Tên giáo viên (người gửi)', type: 'text', fromSettings: 'tenGiaoVien', placeholder: 'VD: cô Lan' },
      { name: 'tenLop', label: 'Tên lớp', type: 'text', fromSettings: 'tenLop' },
      { name: 'noiDung', label: 'Nội dung cần trao đổi', type: 'textarea', rows: 4, required: true, placeholder: 'Ghi điều cần nói, mỗi ý một dòng. Nên mô tả việc cụ thể, tránh từ ngữ nhận xét về tính cách của trẻ.' },
      { name: 'thoiGian', label: 'Thời gian / hạn (nếu có)', type: 'text', placeholder: 'VD: Sáng thứ Hai, ngày 15/9' },
      { name: 'phongCach', label: 'Phong cách', type: 'chips', options: STYLES, required: true }
    ],
    defaults: { loai: 'nhom', phongCach: 'than-thien' },
    sample: {
      loai: 'do-dung',
      xungHo: 'các bố mẹ',
      tenGiaoVien: 'cô Hoa',
      tenLop: 'Mẫu giáo nhỡ B2',
      noiDung: 'Chuẩn bị cho con 1 bộ quần áo dự phòng để ở lớp\nGhi tên con lên khăn mặt và cốc uống nước\nMang 1 vỏ hộp sữa sạch để làm đồ chơi tái chế',
      thoiGian: 'Trước thứ Hai, ngày 15/9',
      phongCach: 'than-thien'
    },
    validate: (d) => (!d.noiDung?.trim() ? 'Vui lòng nhập nội dung cần trao đổi.' : '')
  },
  {
    id: 'thu-moi',
    title: 'Tạo thư mời',
    short: 'Thư mời',
    icon: '💌',
    color: 'bg-dao',
    desc: 'Thư mời họp phụ huynh, khai giảng, tổng kết, ngày hội, sự kiện.',
    fields: [
      { name: 'loai', label: 'Loại sự kiện', type: 'select', options: INVITE_TYPES, required: true },
      { name: 'donViChuQuan', label: 'Đơn vị chủ quản', type: 'text', fromSettings: 'donViChuQuan', placeholder: 'VD: UBND xã … / Phòng Giáo dục và Đào tạo …' },
      { name: 'tenTruong', label: 'Tên trường', type: 'text', fromSettings: 'tenTruong' },
      { name: 'tenSuKien', label: 'Tên sự kiện', type: 'text', required: true, placeholder: 'VD: Lễ khai giảng năm học 2026 – 2027' },
      { name: 'thoiGian', label: 'Thời gian', type: 'text', placeholder: 'VD: 7h30, thứ Bảy, ngày 05/9/2026' },
      { name: 'diaDiem', label: 'Địa điểm', type: 'text', placeholder: 'VD: Sân trường' },
      { name: 'thanhPhan', label: 'Thành phần tham dự (kính mời)', type: 'text', placeholder: 'VD: Quý phụ huynh học sinh toàn trường' },
      { name: 'chuongTrinh', label: 'Nội dung chương trình (nếu có)', type: 'textarea', rows: 3, placeholder: 'Mỗi nội dung một dòng.' },
      { name: 'luuY', label: 'Lưu ý (nếu có)', type: 'textarea', rows: 2, placeholder: 'VD: Trang phục, giờ đón trẻ…' },
      { name: 'loiKet', label: 'Lời kết (để trống để dùng lời kết gợi ý)', type: 'textarea', rows: 2 },
      { name: 'diaDanhNgay', label: 'Địa danh, ngày ký (nếu có)', type: 'text', placeholder: 'VD: Bắc Ninh, ngày 25 tháng 8 năm 2026' },
      {
        name: 'chucVuKy', label: 'Chức vụ người ký', type: 'text',
        placeholder: 'VD: HIỆU TRƯỞNG',
        suggestions: ['HIỆU TRƯỞNG', 'T/M BAN GIÁM HIỆU', 'GIÁO VIÊN CHỦ NHIỆM', 'BAN TỔ CHỨC']
      },
      { name: 'nguoiKy', label: 'Họ tên người ký (nếu có)', type: 'text' }
    ],
    defaults: { loai: 'khai-giang' },
    sample: {
      loai: 'khai-giang',
      donViChuQuan: 'UBND xã Hòa Bình (mẫu)',
      tenTruong: 'Trường Mầm non Ánh Dương (mẫu)',
      tenSuKien: 'Lễ khai giảng năm học 2026 – 2027',
      thoiGian: '7h30, thứ Bảy, ngày 05/9/2026',
      diaDiem: 'Sân trường Mầm non Ánh Dương',
      thanhPhan: 'Quý phụ huynh học sinh toàn trường',
      chuongTrinh: 'Văn nghệ chào mừng của các bé\nĐọc thư của Chủ tịch nước gửi ngành Giáo dục\nĐánh trống khai giảng năm học mới',
      luuY: 'Các bé mặc đồng phục của trường, có mặt tại lớp trước 7h15',
      loiKet: '',
      diaDanhNgay: '',
      chucVuKy: 'HIỆU TRƯỞNG',
      nguoiKy: ''
    },
    validate: (d) => (!d.tenSuKien?.trim() ? 'Vui lòng nhập tên sự kiện.' : '')
  },
  {
    id: 'ban-tin',
    title: 'Bản tin tuần của lớp',
    short: 'Bản tin tuần',
    icon: '🗞️',
    color: 'bg-vang',
    desc: 'Tổng hợp hoạt động học, chơi, ăn ngủ trong tuần gửi phụ huynh.',
    fields: [
      { name: 'tenLop', label: 'Tên lớp', type: 'text', fromSettings: 'tenLop' },
      { name: 'tuanHoc', label: 'Tuần học', type: 'text', placeholder: 'VD: Tuần 3 tháng 10 (từ 13/10 đến 17/10)' },
      { name: 'chuDe', label: 'Chủ đề', type: 'text', placeholder: 'VD: Gia đình yêu thương của bé' },
      { name: 'hocTap', label: 'Hoạt động học tập nổi bật', type: 'textarea', rows: 3, placeholder: 'Mỗi hoạt động một dòng.' },
      { name: 'vuiChoi', label: 'Hoạt động vui chơi', type: 'textarea', rows: 2 },
      { name: 'ngoaiTroi', label: 'Hoạt động ngoài trời', type: 'textarea', rows: 2 },
      { name: 'anNgu', label: 'Tình hình ăn, ngủ và nề nếp chung', type: 'textarea', rows: 2, hint: 'Chỉ ghi nhận xét chung của cả lớp, không ghi tình trạng sức khỏe riêng của từng trẻ.' },
      { name: 'phoiHop', label: 'Nội dung cần phối hợp với phụ huynh', type: 'textarea', rows: 2 },
      { name: 'tuanToi', label: 'Hoạt động dự kiến tuần tiếp theo', type: 'textarea', rows: 2 }
    ],
    defaults: {},
    sample: {
      tenLop: 'Mẫu giáo bé C1',
      tuanHoc: 'Tuần 3 tháng 10 (từ 13/10 đến 17/10)',
      chuDe: 'Gia đình yêu thương của bé',
      hocTap: 'Trò chuyện về các thành viên trong gia đình\nTô màu bức tranh "Ngôi nhà của bé"\nHọc bài hát "Cả nhà thương nhau"',
      vuiChoi: 'Chơi đóng vai "Gia đình nấu ăn" ở góc phân vai\nXếp hình ngôi nhà bằng khối gỗ',
      ngoaiTroi: 'Quan sát vườn rau của trường\nChơi trò chơi vận động "Về đúng nhà"',
      anNgu: 'Các con ăn hết suất, ngủ trưa đúng giờ\nNhiều bạn đã tự cất dép và gấp khăn sau khi lau mặt',
      phoiHop: 'Cùng con xem ảnh gia đình và kể tên các thành viên\nGửi 1 tấm ảnh gia đình để trang trí góc chủ đề (nếu gia đình đồng ý)',
      tuanToi: 'Làm thiệp tặng mẹ nhân ngày 20/10\nTìm hiểu đồ dùng trong gia đình'
    },
    validate: (d) => {
      const any = ['hocTap', 'vuiChoi', 'ngoaiTroi', 'anNgu', 'phoiHop', 'tuanToi'].some((k) => d[k]?.trim());
      return any ? '' : 'Vui lòng nhập ít nhất một mục hoạt động của tuần.';
    }
  },
  {
    id: 'tuyen-truyen',
    title: 'Tuyên truyền nuôi dạy trẻ',
    short: 'Tuyên truyền',
    icon: '🌱',
    color: 'bg-la',
    desc: 'Kiến thức dinh dưỡng, vệ sinh, an toàn, ngôn ngữ, cảm xúc… theo độ tuổi.',
    fields: [
      { name: 'doTuoi', label: 'Độ tuổi của trẻ', type: 'chips', options: AGE_GROUPS, required: true },
      { name: 'chuDe', label: 'Chủ đề tuyên truyền', type: 'select', options: TOPICS, required: true },
      {
        name: 'hinhThuc', label: 'Hình thức', type: 'chips', required: true,
        options: [
          { value: 'bai-viet', label: 'Bài tuyên truyền đầy đủ' },
          { value: 'zalo', label: 'Tin ngắn gửi Zalo' },
          { value: 'bang-tin', label: 'Bảng tin (gạch đầu dòng)' }
        ]
      },
      { name: 'boiCanh', label: 'Bối cảnh / lưu ý thêm (nếu có)', type: 'textarea', rows: 2, placeholder: 'VD: Thời tiết chuyển lạnh; lớp đang thực hiện chủ đề "Bé và gia đình"…' },
      { name: 'tenTruong', label: 'Tên trường (để ký cuối bài, nếu cần)', type: 'text', fromSettings: 'tenTruong' },
      { name: 'tenLop', label: 'Tên lớp (nếu cần)', type: 'text', fromSettings: 'tenLop' }
    ],
    defaults: { doTuoi: '3-4', chuDe: 'dinh-duong', hinhThuc: 'bai-viet' },
    sample: {
      doTuoi: '4-5',
      chuDe: 'tai-nan',
      hinhThuc: 'bai-viet',
      boiCanh: 'Chuẩn bị đến kỳ nghỉ hè, trẻ ở nhà nhiều hơn',
      tenTruong: 'Trường Mầm non Ánh Dương (mẫu)',
      tenLop: ''
    },
    validate: () => ''
  },
  {
    id: 'truyen-thong',
    title: 'Bài truyền thông nhà trường',
    short: 'Truyền thông',
    icon: '📰',
    color: 'bg-dao',
    desc: 'Bài Facebook, website, tin Zalo, tổng kết sự kiện, lan tỏa gương tốt.',
    fields: [
      { name: 'loai', label: 'Loại bài', type: 'select', options: POST_TYPES, required: true },
      { name: 'doDai', label: 'Độ dài', type: 'chips', options: LENGTHS, required: true },
      { name: 'tenTruong', label: 'Tên trường', type: 'text', fromSettings: 'tenTruong' },
      { name: 'chuDe', label: 'Tên hoạt động / sự kiện / chủ đề', type: 'text', required: true, placeholder: 'VD: Ngày hội STEAM "Bé làm nhà khoa học nhí"' },
      { name: 'thoiGian', label: 'Thời gian', type: 'text' },
      { name: 'diaDiem', label: 'Địa điểm', type: 'text' },
      { name: 'thanhPhan', label: 'Thành phần tham gia', type: 'text', placeholder: 'VD: Các bé khối mẫu giáo lớn cùng cha mẹ' },
      { name: 'diemNoiBat', label: 'Diễn biến, điểm nổi bật', type: 'textarea', rows: 4, placeholder: 'Ghi những gì đã/ sẽ diễn ra, mỗi ý một dòng. Ứng dụng chỉ dùng thông tin bạn nhập, không tự thêm số liệu hay thành tích.' },
      { name: 'thongDiep', label: 'Thông điệp muốn lan tỏa (nếu có)', type: 'text' },
      { name: 'hashtag', label: 'Hashtag riêng của trường (nếu có)', type: 'text', placeholder: 'VD: #MNAnhDuong' }
    ],
    defaults: { loai: 'facebook', doDai: 'vua' },
    sample: {
      loai: 'facebook',
      doDai: 'vua',
      tenTruong: 'Trường Mầm non Ánh Dương (mẫu)',
      chuDe: 'Ngày hội STEAM "Bé làm nhà khoa học nhí"',
      thoiGian: 'Sáng thứ Sáu, ngày 15/11',
      diaDiem: 'Sân trường',
      thanhPhan: 'Các bé khối mẫu giáo lớn',
      diemNoiBat: 'Các bé làm thí nghiệm vật chìm – vật nổi\nCác nhóm thiết kế thuyền từ vật liệu tái chế\nPhụ huynh cùng tham gia gian trưng bày sản phẩm',
      thongDiep: 'Học mà chơi – chơi mà học',
      hashtag: ''
    },
    validate: (d) => (!d.chuDe?.trim() ? 'Vui lòng nhập tên hoạt động / sự kiện / chủ đề.' : '')
  }
];

export const EDIT_ACTIONS = [
  { value: 'sua-chinh-ta', label: 'Sửa lỗi chính tả', icon: '✔️' },
  { value: 'than-thien', label: 'Viết lại thân thiện hơn', icon: '😊' },
  { value: 'rut-gon', label: 'Rút gọn', icon: '✂️' },
  { value: 'trang-trong', label: 'Trang trọng hơn', icon: '🎩' },
  { value: 'ro-rang', label: 'Rõ ràng, dễ hiểu hơn', icon: '💡' },
  { value: 'zalo', label: 'Chuyển thành tin nhắn Zalo', icon: '📱' },
  { value: 'thong-bao', label: 'Chuyển thành thông báo chính thức', icon: '📢' },
  { value: 'hanh-chinh', label: 'Viết lại theo văn phong hành chính', icon: '🏛️' },
  { value: 'ba-phien-ban', label: 'Tạo ba phiên bản để lựa chọn', icon: '🎲' }
];

export const EDITOR_SAMPLE =
  'kính gửi quý phụ huynh lớp A1 ,\nnhà trường xin trân thành thông báo : thứ 6 ngày 20/11 các con sẽ tham gia buổi giao lưu văn nghệ chào mừng ngày nhà giáo việt nam.Đề nghị phụ huynh cho con mặc đồng phục và đến lớp trước 7h30 .\nxin trân thành cảm ơn !';

export function getModule(id) {
  return MODULES.find((m) => m.id === id);
}

export function initialFormData(mod, settings) {
  const data = { ...(mod.defaults || {}) };
  for (const f of mod.fields) {
    if (data[f.name] === undefined) data[f.name] = '';
    if (f.fromSettings && settings?.[f.fromSettings] && !data[f.name]) data[f.name] = settings[f.fromSettings];
  }
  return data;
}
