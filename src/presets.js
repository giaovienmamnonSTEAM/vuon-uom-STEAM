/* ============ GIÁO ÁN MẪU ============
   Bộ thông tin điền sẵn vào form; bấm chọn là app lắp giáo án ngay để giáo viên xem và sửa.
*/
export const PRESETS = [
  {
    id: 'vuong-mien',
    ten: 'Làm vương miện (EDP – MG lớn)',
    ageId: 'mgl', linhVuc: 'Trải nghiệm – Chế tạo sản phẩm', quyTrinh: 'EDP',
    chuDe: 'Bản thân', deTai: 'Bé làm vương miện tặng bạn',
    doiTuong: 'chiếc vương miện', dungDuoc: true,
    vanDe: 'Bạn Thỏ Bông sắp tổ chức sinh nhật nhưng chưa có vương miện để đội',
    tieuChi: ['Vừa đầu, không bị rộng hay chật', 'Các chi tiết trang trí đính chắc, không bị rơi', 'Màu sắc hài hòa, đẹp mắt'],
    nguyenLieu: ['dải xốp/bìa màu dài 55 – 60 cm', 'kim tuyến', 'hạt cườm', 'hình ngôi sao, trái tim, hình tròn cắt sẵn bằng xốp kim tuyến'],
    dungCu: ['băng dính 2 mặt', 'keo dán khô', 'kéo thủ công đầu tròn'],
    moDau: 'bài hát "Mừng sinh nhật"',
    giaoDuc: 'biết quan tâm, chia sẻ niềm vui với bạn bè'
  },
  {
    id: 'thuyen-noi',
    ten: 'Làm thuyền nổi chở đồ (EDP – MG nhỡ)',
    ageId: 'mgn', linhVuc: 'Trải nghiệm – Chế tạo sản phẩm', quyTrinh: 'EDP',
    chuDe: 'Nước và các hiện tượng tự nhiên', deTai: 'Làm thuyền giúp các con vật qua sông',
    doiTuong: 'chiếc thuyền', dungDuoc: true,
    vanDe: 'Cây cầu bị nước lũ cuốn trôi, các con vật không qua sông về nhà được',
    tieuChi: ['Nổi được trên mặt nước', 'Chở được 3 con vật đồ chơi mà không bị lật', 'Chắc chắn, không bị bung khi xuống nước'],
    nguyenLieu: ['chai nhựa sạch', 'hộp xốp', 'que kem', 'nắp chai', 'chậu nước'],
    dungCu: ['băng dính', 'dây chun', 'kéo thủ công đầu tròn'],
    moDau: 'bài hát "Em đi chơi thuyền"',
    giaoDuc: 'biết giúp đỡ bạn bè khi gặp khó khăn, sử dụng lại vật liệu tái chế để bảo vệ môi trường'
  },
  {
    id: 'noi-chim',
    ten: 'Khám phá vật nổi – vật chìm (5E – MG nhỡ)',
    ageId: 'mgn', linhVuc: 'Phát triển nhận thức – Khám phá khoa học', quyTrinh: '5E',
    chuDe: 'Nước và các hiện tượng tự nhiên', deTai: 'Khám phá vật nổi – vật chìm',
    doiTuong: 'vật nổi – vật chìm',
    dacDiem: ['vật nào nổi trên mặt nước', 'vật nào chìm xuống đáy', 'vì sao vật nổi, vật chìm (nặng – nhẹ, rỗng – đặc)'],
    cachKhamPha: 'dự đoán, thả vật vào nước, quan sát và so sánh',
    nguyenLieu: ['chậu nước', 'lá cây', 'hòn sỏi', 'thìa nhựa', 'đinh sắt to', 'quả bóng nhựa', 'đá cuội'],
    dungCu: ['kẹp gắp', 'khay phân loại 2 ô "nổi – chìm"'],
    moDau: 'bài hát "Cá vàng bơi"',
    giaoDuc: 'biết tiết kiệm nước, không chơi gần ao hồ khi không có người lớn'
  },
  {
    id: 'con-ga',
    ten: 'Khám phá con gà trống (5E – Nhà trẻ)',
    ageId: 'nt', linhVuc: 'Phát triển nhận thức – Nhận biết (khám phá)', quyTrinh: '5E',
    chuDe: 'Những con vật đáng yêu', deTai: 'Nhận biết con gà trống',
    doiTuong: 'con gà trống',
    dacDiem: ['mào đỏ', 'mỏ nhọn', 'đuôi dài nhiều màu', 'tiếng kêu "ò ó o"'],
    cachKhamPha: 'nhìn, nghe tiếng kêu, sờ lông',
    nguyenLieu: ['mô hình con gà trống', 'lông gà sạch', 'tranh con gà'],
    dungCu: [],
    moDau: 'bài hát "Con gà trống"',
    giaoDuc: 'biết yêu quý, chăm sóc các con vật nuôi trong gia đình'
  },
  {
    id: 'banh-trung-thu',
    ten: 'Làm bánh Trung thu (EDP – MG bé)',
    ageId: 'mgb', linhVuc: 'Trải nghiệm – Nấu ăn / chế biến món ăn', quyTrinh: 'EDP',
    chuDe: 'Ngày hội của bé', deTai: 'Bé làm bánh Trung thu',
    doiTuong: 'chiếc bánh Trung thu', dungDuoc: true,
    vanDe: 'Chị Hằng sắp đến thăm lớp mà lớp mình chưa có bánh Trung thu để mời chị',
    tieuChi: ['Bánh tròn, không bị vỡ', 'Có hoa văn từ khuôn', 'Ăn được'],
    nguyenLieu: ['bột bánh dẻo đã nhào sẵn', 'nhân đỗ xanh vo viên', 'bột áo'],
    dungCu: ['khuôn bánh nhựa nhỏ', 'đĩa', 'găng tay nilon'],
    moDau: 'bài hát "Rước đèn tháng Tám"',
    giaoDuc: 'biết chia sẻ bánh với bạn bè, người thân; giữ vệ sinh khi chế biến'
  }
];
