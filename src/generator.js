/* ============ BỘ SINH GIÁO ÁN (không dùng AI) ============
   Lắp giáo án STEAM từ khung "Công phá STEAM cùng Thầy Phúc" và mẫu câu viết sẵn
   theo độ tuổi. Giáo viên nhập sản phẩm / đối tượng khám phá, nguyên liệu, tiêu chí...;
   chỗ nào cần nội dung riêng của bài thì để «…» cho giáo viên điền khi chỉnh sửa.
   Kết quả có cùng cấu trúc dữ liệu mà giao diện và file Word đang dùng.
*/

export const BLANK = '«…»';

const AGE_CFG = {
  nt: {
    label: 'Nhà trẻ 24–36 tháng', time: '10 – 15 phút',
    hinhThuc: 'Cả lớp, chia 2 – 3 nhóm nhỏ có cô đi kèm', nhom: '2 – 3 nhóm nhỏ, mỗi nhóm có cô đi kèm',
    edp: ['2 – 3 phút', '2 – 3 phút', '1 – 2 phút', '4 – 5 phút', '2 – 3 phút'],
    e5: ['2 phút', '4 – 5 phút', '3 phút', '2 – 3 phút', '1 – 2 phút']
  },
  mgb: {
    label: 'Mẫu giáo bé 3–4 tuổi', time: '15 – 20 phút',
    hinhThuc: 'Cả lớp – nhóm nhỏ (3 – 4 nhóm)', nhom: '3 – 4 nhóm',
    edp: ['3 phút', '3 – 4 phút', '2 – 3 phút', '6 – 7 phút', '3 – 4 phút'],
    e5: ['2 – 3 phút', '5 – 6 phút', '4 phút', '3 – 4 phút', '2 phút']
  },
  mgn: {
    label: 'Mẫu giáo nhỡ 4–5 tuổi', time: '20 – 25 phút',
    hinhThuc: 'Nhóm (4 – 6 trẻ/nhóm)', nhom: '4 nhóm, mỗi nhóm 4 – 6 trẻ',
    edp: ['3 – 4 phút', '4 phút', '4 – 5 phút', '7 – 8 phút', '4 – 5 phút'],
    e5: ['3 phút', '6 – 7 phút', '5 phút', '4 – 5 phút', '2 – 3 phút']
  },
  mgl: {
    label: 'Mẫu giáo lớn 5–6 tuổi', time: '25 – 35 phút',
    hinhThuc: 'Nhóm (5 – 6 trẻ/nhóm)', nhom: '4 – 5 nhóm, mỗi nhóm 5 – 6 trẻ',
    edp: ['3 – 4 phút', '4 – 5 phút', '5 – 6 phút', '9 – 10 phút', '6 – 7 phút'],
    e5: ['3 – 4 phút', '8 – 9 phút', '6 – 7 phút', '5 – 6 phút', '3 phút']
  }
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const lower = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const clean = (arr) => (arr || []).map((x) => String(x).trim()).filter(Boolean);
function join(arr) {
  const a = clean(arr);
  if (a.length <= 1) return a[0] || BLANK;
  return a.slice(0, -1).join(', ') + ' và ' + a[a.length - 1];
}
// Tên ngắn để đưa vào lời thoại của trẻ (bỏ kích thước, ghi chú trong ngoặc...).
const short = (x) => String(x).split(/\s+\(|\s+dài\s|\s+cắt sẵn|\s+đã\s|\s+đủ\s/)[0].trim();
const pick = (arr, i, fb = BLANK) => short(clean(arr)[i] || clean(arr)[0] || fb);
const turn = (co, tre) => ({ co, tre });

export function isEdpField(linhVuc) {
  return /Tạo hình|Chế tạo|Nấu ăn|sản phẩm/i.test(linhVuc || '');
}

export function resolveProcess(input) {
  if (input.quyTrinh === '5E' || input.quyTrinh === 'EDP') return input.quyTrinh;
  return isEdpField(input.linhVuc) ? 'EDP' : '5E';
}

/** input: { ageId, linhVuc, chuDe, deTai, quyTrinh, doiTuong, dungDuoc, vanDe, tieuChi[],
 *           dacDiem[], cachKhamPha, nguyenLieu[], dungCu[], moDau, giaoDuc, soTre } */
export function generatePlan(input) {
  const age = AGE_CFG[input.ageId] || AGE_CFG.mgn;
  const qt = resolveProcess(input);
  const plan = qt === 'EDP' ? buildEdp(input, age) : build5E(input, age);
  plan.thong_tin = {
    ten_hoat_dong: input.deTai || BLANK,
    chu_de: input.chuDe || BLANK,
    linh_vuc: input.linhVuc || BLANK,
    do_tuoi: age.label,
    thoi_gian: age.time,
    hinh_thuc: age.hinhThuc + (input.soTre ? ` – ${input.soTre}` : ''),
    quy_trinh: qt,
    muc_do_steam: qt === 'EDP' || /khoa học/i.test(input.linhVuc || '') ? 'Toàn phần' : 'Một phần',
    ...plan.thong_tin
  };
  return plan;
}

/* ---------------- EDP ---------------- */
function buildEdp(inp, age) {
  const nt = inp.ageId === 'nt';
  const small = nt || inp.ageId === 'mgb';
  const big = inp.ageId === 'mgl';
  const sp = inp.doiTuong || 'sản phẩm';
  const nl = clean(inp.nguyenLieu);
  const dc = clean(inp.dungCu);
  const tc = clean(inp.tieuChi).length ? clean(inp.tieuChi) : [`${cap(sp)} dùng được`, 'Chắc chắn, không bị bung', 'Đẹp mắt'];
  const vd = inp.vanDe || BLANK;
  const gd = inp.giaoDuc || BLANK;
  const moDau = inp.moDau || `bài hát ${BLANK}`;

  const canhBao = inp.dungDuoc === false
    ? `Sản phẩm "${sp}" chưa có tính ứng dụng thật (chạy được, nổi được, đội được, ăn được, chứa được...). Theo nguyên tắc STEAM, không nên gán EDP cho hoạt động chỉ làm theo mẫu. Hãy cải biến sản phẩm để trẻ dùng được thật (VD: "tô màu ô tô" → "làm ô tô từ vật liệu tái chế chạy được") hoặc dạy theo cách truyền thống.`
    : '';

  const kienThuc = {
    S: nl.length
      ? `Trẻ nhận biết đặc điểm, đặc tính của một số nguyên vật liệu dùng để làm ${sp} (${join(nl)}).`
      : `Trẻ nhận biết đặc điểm, đặc tính của các nguyên vật liệu dùng để làm ${sp} (${BLANK}).`,
    T: dc.length
      ? `Trẻ biết sử dụng các công cụ, dụng cụ đơn giản (${join(dc)}) để ${nt ? 'cùng cô ' : ''}liên kết vật liệu, tạo ra ${sp}.`
      : 'Không áp dụng.',
    E: nt
      ? `Trẻ biết cùng cô thực hiện các thao tác đơn giản để làm ${sp} (chọn nguyên liệu, ${BLANK}).`
      : `Trẻ hiểu được quy trình tạo ra ${sp} (quan sát mẫu, lên ý tưởng${big ? ', vẽ bản thiết kế' : ''}, chọn nguyên liệu, ${BLANK}, thử nghiệm và cải tiến).`,
    A: `Trẻ phối hợp màu sắc, hình dạng và cách sắp xếp nguyên liệu tạo thành ${sp} hài hòa, đẹp mắt; ${lower(gd)}.`,
    M: nt
      ? `Trẻ đếm số lượng nguyên liệu trong phạm vi 2 – 3, nhận biết to – nhỏ khi làm ${sp}.`
      : `Trẻ ứng dụng kỹ năng đếm, so sánh, ước lượng (kích thước, số lượng nguyên liệu${big ? ', đo' : ''}) khi làm ${sp}.`
  };

  const kyNang = nt
    ? {
        tu_duy_phan_bien: `Trẻ biết thử ${sp} và nhận ra khi sản phẩm chưa dùng được (bị rơi, bị bung).`,
        sang_tao: `Trẻ tự chọn màu sắc, nguyên liệu mình thích để làm ${sp}.`,
        hop_tac: 'Trẻ biết chơi, làm cùng bạn và cô trong nhóm, chờ đến lượt.',
        giao_tiep: `Trẻ nói được từ, câu ngắn về ${sp} của mình (tên, màu sắc).`,
        ky_nang_khac: 'Vận động tinh (cầm, nắm, dán, xếp); quan sát; ghi nhớ có chủ định.'
      }
    : {
        tu_duy_phan_bien: `Trẻ biết kiểm tra sản phẩm theo tiêu chí (${tc.map(lower).join('; ')}), nhận ra điểm chưa đạt và tìm cách sửa.`,
        sang_tao: `Trẻ tự đưa ra ý tưởng, lựa chọn kiểu dáng, nguyên liệu và cách trang trí ${sp} theo ý thích.`,
        hop_tac: `Trẻ biết phân công, hỗ trợ bạn trong nhóm (${BLANK}).`,
        giao_tiep: big
          ? `Trẻ trình bày được bản thiết kế, cách làm, khó khăn và cách sửa; tự tin giới thiệu ${sp} trước cô và các bạn.`
          : `Trẻ nói được ý tưởng của mình và giới thiệu ${sp} của nhóm.`,
        ky_nang_khac: `Vận động tinh (${/nấu|ăn|bánh/i.test(inp.linhVuc || '') ? 'nặn, ấn khuôn, xoay' : 'cắt, dán, gắn, uốn'}); quan sát, so sánh; sử dụng ${dc.length ? join(dc.map((d) => lower(short(d)))) : 'công cụ'} an toàn.`
      };

  const plan = {
    thong_tin: {},
    phan_tich: {
      ban_chat_hoat_dong: `Trẻ giải quyết vấn đề: ${vd}`,
      ly_do_chon_quy_trinh: `Hoạt động tạo ra sản phẩm có tính ứng dụng (${sp}), trẻ được đặt vấn đề, lên ý tưởng, chế tạo, thử nghiệm và cải tiến nên dùng quy trình EDP.`,
      canh_bao: canhBao,
      van_de: vd,
      tieu_chi_san_pham: tc,
      gioi_han: ['Chỉ sử dụng nguyên vật liệu cô đã chuẩn bị', `Hoàn thành trong thời gian ${age.edp[3]}`]
    },
    muc_dich_yeu_cau: {
      kien_thuc: kienThuc,
      ky_nang: kyNang,
      thai_do: [
        `Trẻ tích cực, hứng thú tham gia thử thách làm ${sp}.`,
        'Trẻ kiên trì hoàn thành sản phẩm, biết giữ gìn đồ dùng và cùng cô thu dọn sau khi học.'
      ]
    },
    chuan_bi: prep(inp, nt, sp, nl, dc, 'EDP', big),
    cach_tien_hanh: []
  };

  const s = [];
  // Bước 1
  s.push({
    ten_buoc: 'Bước 1 – Đặt vấn đề (Hỏi – Tưởng tượng)', thoi_gian: age.edp[0],
    muc_dich: 'Tạo tình huống có vấn đề; trẻ đưa ra ý tưởng và cùng cô chốt tiêu chí sản phẩm.',
    tich_hop_steam: 'A – lồng ghép âm nhạc/câu chuyện; S – trẻ nêu hiểu biết ban đầu.',
    luot: nt ? [
      turn(`Cô cho trẻ hát, vận động theo ${moDau}.\nCô: Các con ơi, nhìn xem ai đến lớp mình này!`, '- Trẻ hát, vận động cùng cô.\n- Trẻ nhìn, chỉ tay, reo lên.'),
      turn(`Cô dùng rối/tranh kể ngắn: "${vd}."\nCô: Bạn ấy làm sao?`, '- Trẻ: Bạn buồn!\n- Trẻ: Không có ạ.\n- Trẻ chỉ vào rối/tranh.'),
      turn(`Cô: Mình giúp bạn nhé! Mình làm ${sp} cho bạn nhé?`, '- Trẻ: Có ạ!\n- Trẻ gật đầu, vỗ tay.')
    ] : [
      turn(`Cô cho trẻ hát, vận động theo ${moDau}; trẻ ngồi đội hình chữ U.\nCô: Các con ơi, hôm nay lớp mình nhận được một tin nhắn đặc biệt. Chúng mình cùng nghe nhé!`, '- Trẻ hát, vận động cùng cô.\n- Trẻ ngồi đội hình chữ U, chú ý lắng nghe.'),
      turn(`Cô mở tin nhắn (hoặc kể chuyện): "${vd}. Các bạn lớp mình giúp với nhé!"\nCô: Các con vừa nghe thấy chuyện gì xảy ra?`, `- Trẻ 1: Bạn ấy đang gặp khó khăn ạ.\n- Trẻ 2: Bạn ấy cần ${sp} ạ.\n- Trẻ 3: Lớp mình phải giúp bạn ạ.`),
      turn('Cô: Theo các con, chúng mình có thể làm gì để giúp bạn?', `- Trẻ 1: Con sẽ làm ${sp} tặng bạn ạ.\n- Trẻ 2: Mình đi mua cho bạn ạ.\n- Trẻ 3: Con mang ở nhà đến ạ.\n- Trẻ 4: Cả lớp mình cùng làm ạ.`),
      turn(`Cô lắng nghe, không nhận xét đúng – sai, khen các ý tưởng.\nCô: Có rất nhiều ý tưởng hay! Nếu tự làm ${sp} thì các con muốn làm như thế nào?`, `- Trẻ 1: Con làm bằng ${pick(nl, 0)} ạ.\n- Trẻ 2: Con muốn làm thật to ạ.\n- Trẻ 3: Con sẽ trang trí nhiều màu ạ.`),
      turn(`Cô: Vậy ${sp} lớp mình làm cần đạt được những gì thì mới giúp được bạn?`, tc.map((t, i) => `- Trẻ ${i + 1}: ${cap(t)} ạ.`).join('\n')),
      turn(`Cô chốt vấn đề và tiêu chí: "Lớp mình sẽ làm ${sp}. ${cap(sp)} cần: ${tc.map(lower).join('; ')}."\nCô: Chúng mình cùng tìm hiểu xem làm ${sp} như thế nào nhé!`, '- Trẻ lắng nghe, nhắc lại tiêu chí cùng cô.')
    ]
  });
  // Bước 2
  s.push({
    ten_buoc: 'Bước 2 – Khám phá', thoi_gian: age.edp[1],
    muc_dich: 'Trẻ khám phá sản phẩm mẫu, đặc tính của nguyên vật liệu; cô lưu ý phần khó, phần nguy hiểm.',
    tich_hop_steam: `S – đặc tính vật liệu; T – làm quen dụng cụ${dc.length ? ` (${join(dc)})` : ''}; M – đếm, so sánh.`,
    luot: nt ? [
      turn(`Cô đưa ${sp} mẫu cho trẻ xem, sờ.\nCô: Đây là gì? Màu gì?`, `- Trẻ: ${cap(sp)}!\n- Trẻ: Màu ${BLANK}!\n- Trẻ sờ, cầm thử.`),
      turn(`Cô cho trẻ sờ, cầm thử từng nguyên liệu: ${join(nl)}.\nCô: Cái này thế nào? Mềm hay cứng?`, '- Trẻ: Mềm!\n- Trẻ: Cứng!\n- Trẻ bóp, sờ, lắc nguyên liệu.'),
      turn('Cô làm mẫu chậm thao tác khó nhất, nhắc: "Không cho vào miệng nhé!"', '- Trẻ quan sát cô làm mẫu.\n- Trẻ nhắc lại: Không cho vào miệng!')
    ] : [
      turn(`Cô đưa ra ${sp} mẫu (hoặc hình ảnh).\nCô: Các con nhìn xem đây là gì? Nó được làm từ những gì?`, `- Trẻ 1: Đây là ${sp} ạ.\n- Trẻ 2: Làm bằng ${pick(nl, 0)} ạ.\n- Trẻ 3: Có cả ${pick(nl, 1)} nữa ạ.`),
      turn(`Cô: ${cap(sp)} có những bộ phận nào? Các bộ phận được gắn với nhau bằng cách nào?`, `- Trẻ 1: Có ${BLANK} ạ.\n- Trẻ 2: Dán bằng ${pick(dc, 0, 'keo')} ạ.\n- Trẻ 3: Con nghĩ là buộc lại ạ.`),
      turn(`Cô cho các nhóm cầm, sờ, thử uốn, gấp các nguyên vật liệu: ${join(nl)}.\nCô: Con thấy vật liệu này thế nào? Cứng hay mềm, có uốn cong được không?`, '- Trẻ cầm, sờ, thử uốn, gấp vật liệu.\n- Trẻ 1: Cái này mềm, uốn cong được ạ.\n- Trẻ 2: Cái này cứng hơn ạ.\n- Trẻ 3: Cái này lấp lánh ạ.'),
      turn(`Cô: Theo các con, vật liệu nào giúp ${sp} ${lower(tc[0])}? Vì sao?`, `- Trẻ 1: ${cap(pick(nl, 0))} ạ, vì nó chắc ạ.\n- Trẻ 2: Con chọn ${pick(nl, 1)} ạ.\n- Trẻ 3: Con chưa biết, con muốn thử ạ.`),
      turn(`Cô: Chúng mình thử nhanh xem nhé! (Cô cho trẻ thử.)\nCô lưu ý: "${dc.some((d) => /kéo/i.test(d)) ? 'Khi dùng kéo phải cầm đúng cách, không chĩa mũi kéo vào bạn. ' : ''}Không cho nguyên liệu nhỏ vào miệng, mũi, tai."`, '- Trẻ thử, nêu nhận xét.\n- Trẻ lắng nghe lưu ý an toàn.')
    ]
  });
  // Bước 3
  s.push({
    ten_buoc: 'Bước 3 – Lập kế hoạch (lên ý tưởng, thiết kế)', thoi_gian: age.edp[2],
    muc_dich: small ? 'Trẻ chọn nguyên liệu, màu sắc và nói ý tưởng của mình.' : 'Trẻ/nhóm nêu ý tưởng, chọn nguyên liệu, cách làm và vẽ bản thiết kế.',
    tich_hop_steam: `E – lên ý tưởng${small ? '' : ', thiết kế'}; A – lựa chọn màu sắc, hình dạng; M – ước lượng số lượng nguyên liệu.`,
    luot: nt ? [
      turn(`Cô: Con thích ${sp} màu gì? Con lấy cái nào?`, '- Trẻ: Màu đỏ!\n- Trẻ chỉ, chọn nguyên liệu mình thích.')
    ] : small ? [
      turn(`Cô chia trẻ thành ${age.nhom}.\nCô: Con muốn làm ${sp} như thế nào? Con chọn nguyên liệu gì, màu gì?`, `- Trẻ về nhóm.\n- Trẻ 1: Con làm màu đỏ ạ.\n- Trẻ 2: Con chọn ${pick(nl, 0)} ạ.\n- Trẻ 3: Con dán thêm ${pick(nl, 1)} ạ.`),
      turn('Cô: Con sẽ làm gì trước, làm gì sau?', `- Trẻ 1: Con ${BLANK} trước ạ.\n- Trẻ 2: Con dán sau ạ.`)
    ] : [
      turn(`Cô chia trẻ thành ${age.nhom}, phát bảng thiết kế cho mỗi nhóm.\nCô: Nhóm con muốn làm ${sp} như thế nào? Dùng những nguyên liệu gì?`, `- Trẻ về nhóm, thảo luận.\n- Trẻ 1: Nhóm con làm bằng ${pick(nl, 0)} ạ.\n- Trẻ 2: Nhóm con sẽ thêm ${pick(nl, nl.length - 1)} ạ.`),
      turn('Cô: Các con hãy vẽ ý tưởng của nhóm vào bảng thiết kế: hình dạng, nguyên liệu, số lượng.', '- Trẻ vẽ, dán hình nguyên liệu, đánh dấu số lượng lên bảng thiết kế.'),
      turn('Cô đến từng nhóm, hỏi gợi mở: "Phần nào khó nhất? Con định làm phần đó thế nào? Ai sẽ làm việc gì?"', `- Trẻ 1: Phần ${BLANK} khó nhất ạ.\n- Trẻ 2: Con cắt, bạn dán ạ.\n- Trẻ 3: Con sẽ đo trước rồi mới cắt ạ.`),
      turn('Cô mời đại diện 1 – 2 nhóm chia sẻ bản thiết kế.\nCô: Các bạn khác có ý kiến gì không? Có cách nào làm tốt hơn không?', '- Đại diện nhóm trình bày bản thiết kế.\n- Trẻ nhóm khác góp ý: "Thêm băng dính cho chắc hơn ạ."')
    ]
  });
  // Bước 4
  s.push({
    ten_buoc: 'Bước 4 – Thực hiện (chế tạo)', thoi_gian: age.edp[3],
    muc_dich: 'Trẻ tự lấy nguyên liệu, thực hành làm sản phẩm; cô bao quát, gợi mở, không làm thay.',
    tich_hop_steam: `E – chế tạo; T – sử dụng ${dc.length ? join(dc) : 'dụng cụ'}; M – đếm, đo; A – trang trí.`,
    luot: nt ? [
      turn('Cô bật nhạc nhẹ, cô ngồi cùng từng nhóm.\nCô: Mình cùng làm nào!', `- Trẻ cùng cô làm ${sp}.`),
      turn('Cô cầm tay hướng dẫn trẻ còn lúng túng, khen trẻ: "Con giỏi quá!"', '- Trẻ thực hiện, cười, khoe với cô.')
    ] : [
      turn(`Cô: Các nhóm lấy nguyên liệu${small ? '' : ' theo bản thiết kế'} và bắt đầu làm nhé! (Cô bật nhạc nhẹ theo chủ đề.)`, `- Trẻ lấy nguyên liệu, dụng cụ về nhóm.\n- Trẻ phân công, bắt đầu làm ${sp}.`),
      turn('Cô bao quát, đến từng nhóm: "Nhóm con đang làm đến đâu rồi? Con đang làm phần nào?"', `- Trẻ 1: Con đang gắn ${pick(nl, 0)} ạ.\n- Trẻ 2: Con đang trang trí ạ.`),
      turn('Khi trẻ gặp khó (vật liệu không dính, bị rơi, bị lệch...), cô không làm thay mà hỏi: "Vì sao bị như vậy? Con thử cách khác được không?"', `- Trẻ 1: Vì keo ít quá ạ.\n- Trẻ 2: Con dùng ${pick(dc, 1, 'băng dính')} thay ạ.\n- Trẻ thử lại cách khác.`),
      turn('Cô động viên nhóm làm chậm, nhắc trẻ dùng dụng cụ an toàn, giữ gọn nguyên liệu.\nCô: Còn 2 phút nữa, các nhóm hoàn thiện nhé!', `- Trẻ hoàn thiện, kiểm tra lại ${sp}.`)
    ]
  });
  // Bước 5
  s.push({
    ten_buoc: 'Bước 5 – Thử nghiệm, đánh giá, cải tiến, trưng bày, kết thúc', thoi_gian: age.edp[4],
    muc_dich: 'Trẻ thử sản phẩm theo tiêu chí, cải tiến nếu chưa đạt, trưng bày và chia sẻ.',
    tich_hop_steam: `E – thử nghiệm, cải tiến; A – vẻ đẹp sản phẩm và giáo dục: ${gd}.`,
    luot: nt ? [
      turn(`Cô cùng trẻ dùng thử ${sp}.\nCô: ${cap(sp)} của con đây! Dùng được chưa?`, '- Trẻ dùng thử, reo vui.\n- Trẻ: Được rồi!'),
      turn(`Cô khen cả lớp, giáo dục: ${gd}.\nCô cùng trẻ tặng ${sp} cho bạn trong câu chuyện, thu dọn đồ dùng.`, '- Trẻ vỗ tay, cùng cô thu dọn.')
    ] : [
      turn(`Cô: Chúng mình cùng thử xem ${sp} của các nhóm đã đạt yêu cầu chưa nhé! Tiêu chí thứ nhất: ${lower(tc[0])}.`, `- Trẻ thử nghiệm ${sp} theo từng tiêu chí.\n- Trẻ 1: Của nhóm con đạt rồi ạ!\n- Trẻ 2: Của nhóm con chưa được ạ.`),
      turn(`Cô: Vì sao ${sp} của nhóm con chưa đạt? Nhóm con sẽ sửa thế nào?`, `- Trẻ 1: Vì ${BLANK} ạ.\n- Trẻ 2: Con sẽ dán thêm cho chắc ạ.\n- Trẻ 3: Con làm lại phần ${BLANK} ạ.`),
      turn('Cô cho các nhóm chưa đạt thêm thời gian cải tiến rồi thử nghiệm lại.', '- Trẻ điều chỉnh, thử nghiệm lại.'),
      turn(big
        ? `Cô cho trẻ trưng bày sản phẩm, mời đại diện nhóm giới thiệu: "Nhóm con làm ${sp} bằng gì? Làm như thế nào? Có khó khăn gì và đã sửa ra sao?"`
        : `Cô cho trẻ trưng bày sản phẩm, mời trẻ giới thiệu: "Con làm ${sp} bằng gì?"`,
        big
          ? `- Đại diện nhóm: "Nhóm con làm ${sp} bằng ${join(nl.map(short))}. Lúc đầu bị ${BLANK}, nhóm con đã ${BLANK} ạ."`
          : `- Trẻ: Con làm bằng ${pick(nl, 0)} ạ.`),
      turn(`Cô: Con thích ${sp} của nhóm nào? Vì sao?`, '- Trẻ 1: Con thích của nhóm bạn vì đẹp ạ.\n- Trẻ 2: Vì làm chắc chắn ạ.'),
      turn(`Cô nhận xét chung về quá trình (hợp tác, kiên trì, sáng tạo) và giáo dục: ${gd}.\nCô cho trẻ dùng ${sp} để giải quyết tình huống ban đầu, cùng trẻ thu dọn đồ dùng.`, '- Trẻ lắng nghe, dùng sản phẩm.\n- Trẻ cùng cô thu dọn đồ dùng, nguyên liệu.')
    ]
  });
  plan.cach_tien_hanh = s;
  return plan;
}

/* ---------------- 5E ---------------- */
function build5E(inp, age) {
  const nt = inp.ageId === 'nt';
  const small = nt || inp.ageId === 'mgb';
  const dt = inp.doiTuong || 'đối tượng khám phá';
  const dd = clean(inp.dacDiem).length ? clean(inp.dacDiem) : ['tên gọi', 'đặc điểm nổi bật'];
  const nl = clean(inp.nguyenLieu);
  const dc = clean(inp.dungCu);
  const gd = inp.giaoDuc || BLANK;
  const moDau = inp.moDau || `bài hát ${BLANK}`;
  const cach = inp.cachKhamPha || (nt ? 'nhìn, sờ, nghe' : 'quan sát, sờ, thử, so sánh');
  const toan = /toán/i.test(inp.linhVuc || '');

  const plan = {
    thong_tin: {},
    phan_tich: {
      ban_chat_hoat_dong: `Trẻ khám phá ${dt}: ${join(dd)}.`,
      ly_do_chon_quy_trinh: 'Hoạt động có bản chất tìm tòi, khám phá, hình thành hiểu biết; sản phẩm không phải trọng tâm nên dùng quy trình 5E.',
      canh_bao: '', van_de: '', tieu_chi_san_pham: [], gioi_han: []
    },
    muc_dich_yeu_cau: {
      kien_thuc: {
        S: `Trẻ ${nt ? 'nhận biết, gọi tên' : 'biết tên gọi và một số đặc điểm của'} ${dt} (${join(dd)}).`,
        T: dc.length ? `Trẻ biết sử dụng các dụng cụ đơn giản (${join(dc)}) để quan sát, khám phá ${dt}.` : 'Không áp dụng.',
        E: `Trẻ tham gia ${cach} để tự khám phá đặc điểm của ${dt}${small ? '' : ', ghi lại kết quả vào bảng ghi chép'}.`,
        A: `Trẻ cảm nhận vẻ đẹp của ${dt} qua ${lower(moDau)}; ${lower(gd)}.`,
        M: toan
          ? `Trẻ ${nt ? 'nhận biết 1 – nhiều, to – nhỏ' : 'đếm, so sánh, phân loại'} khi khám phá ${dt} (${BLANK}).`
          : (nt ? 'Không áp dụng.' : `Trẻ đếm, so sánh (số lượng, kích thước) khi khám phá ${dt}.`)
      },
      ky_nang: nt
        ? {
            tu_duy_phan_bien: `Trẻ chỉ ra được điểm khác nhau đơn giản khi được cô hỏi (to – nhỏ, ${BLANK}).`,
            sang_tao: `Trẻ dùng cử chỉ, âm thanh để mô phỏng ${dt}.`,
            hop_tac: 'Trẻ chơi cùng bạn trong nhóm nhỏ, chờ đến lượt.',
            giao_tiep: `Trẻ nói được từ, câu ngắn về ${dt}.`,
            ky_nang_khac: 'Quan sát; ghi nhớ có chủ định; phát triển vốn từ.'
          }
        : {
            tu_duy_phan_bien: `Trẻ biết đưa ra dự đoán, nêu lý do và so sánh với kết quả khám phá về ${dt}.`,
            sang_tao: `Trẻ đưa ra nhiều cách khám phá, diễn đạt điều mình phát hiện theo cách riêng.`,
            hop_tac: 'Trẻ cùng bạn trong nhóm chia sẻ đồ dùng, cùng quan sát và ghi lại kết quả.',
            giao_tiep: small ? 'Trẻ nói được điều mình thấy bằng câu đơn giản.' : 'Trẻ trình bày được điều nhóm phát hiện, lắng nghe và bổ sung ý kiến của bạn.',
            ky_nang_khac: `Quan sát, so sánh, phân loại; ghi nhớ; ${small ? 'phát triển vốn từ' : 'ghi chép bằng ký hiệu'}.`
          },
      thai_do: [
        `Trẻ hứng thú, tích cực khám phá ${dt}.`,
        `Trẻ mạnh dạn chia sẻ, biết giữ gìn đồ dùng và cùng cô thu dọn sau khi học.`
      ]
    },
    chuan_bi: prep(inp, nt, dt, nl, dc, '5E', !small),
    cach_tien_hanh: []
  };

  const s = [];
  s.push({
    ten_buoc: 'E1 – Khơi gợi, gắn kết (Engage)', thoi_gian: age.e5[0],
    muc_dich: 'Gây hứng thú, dẫn dắt vào nội dung khám phá; cô chưa cung cấp kiến thức.',
    tich_hop_steam: 'A – lồng ghép âm nhạc/câu đố; S – trẻ nêu hiểu biết ban đầu.',
    luot: nt ? [
      turn(`Cô cho trẻ hát, vận động theo ${moDau}.\nCô: Ai đến lớp mình đây?`, '- Trẻ hát, vận động cùng cô.\n- Trẻ nhìn, chỉ tay.'),
      turn(`Cô đưa ra ${dt} (vật thật/mô hình).\nCô: Đây là gì?`, `- Trẻ: ${cap(dt)}!\n- Trẻ chỉ, reo lên.`)
    ] : [
      turn(`Cô cho trẻ hát, vận động theo ${moDau}.\nCô: Các con ơi, cô có một chiếc hộp bí mật. Các con đoán xem bên trong có gì nhé!`, `- Trẻ hát, vận động cùng cô.\n- Trẻ 1: Có đồ chơi ạ.\n- Trẻ 2: Có quà ạ.\n- Trẻ 3: Con đoán là ${dt} ạ.`),
      turn(`Cô mở hộp (hoặc đọc câu đố: ${BLANK}).\nCô: Các con đã biết gì về ${dt} rồi?`, `- Trẻ 1: Con thấy ở ${BLANK} rồi ạ.\n- Trẻ 2: Con chưa biết ạ.\n- Trẻ 3: Con muốn xem ạ.`),
      turn(`Cô: Hôm nay chúng mình sẽ cùng khám phá xem ${dt} có gì đặc biệt nhé!`, '- Trẻ hào hứng.')
    ]
  });
  const e2 = nt ? [
    turn(`Cô chia trẻ thành ${age.nhom}, cho trẻ ${cach} ${dt}${nl.length ? ` (${join(nl)})` : ''}.\nCô: Con sờ xem nào!`, `- Trẻ ${cach}.\n- Trẻ: Mềm!\n- Trẻ: To!`),
    turn(`Cô hỏi từng trẻ: ${dd.map((f) => `"${cap(f)} đâu?"`).join(' ')}`, '- Trẻ chỉ, nói từ đơn.')
  ] : [
    turn(`Cô chia trẻ thành ${age.nhom}, phát cho mỗi nhóm ${nl.length ? join(nl) : BLANK}${small ? '' : ', kèm bảng ghi chép'}.\nCô: Các con hãy cùng nhau ${cach} để tìm hiểu ${dt} nhé!`, `- Trẻ về nhóm, nhận đồ dùng.\n- Trẻ ${cach}.`),
    turn(`Cô đi đến từng nhóm, gợi mở về ${join(dd)}: "Con nhìn thấy gì? Con nghĩ điều gì sẽ xảy ra? Vì sao con nghĩ vậy?" Cô không giải thích, không nhận xét đúng – sai.`, `- Trẻ 1: Con thấy ${BLANK} ạ.\n- Trẻ 2: Con nghĩ là ${BLANK} ạ.\n- Trẻ 3: Con chưa chắc, con thử lại ạ.`)
  ];
  if (!small) e2.push(turn('Cô: Các con hãy ghi lại điều mình phát hiện vào bảng ghi chép bằng cách đánh dấu, dán hình nhé!', '- Trẻ đánh dấu, dán hình vào bảng ghi chép theo ý hiểu.'));
  if (!nt) e2.push(turn('Cô mời các nhóm chia sẻ điều nhóm phát hiện. Cô lắng nghe, chỉ động viên: "Cảm ơn nhóm con! Nhóm bạn có phát hiện khác không?"', `- Đại diện nhóm 1: Nhóm con thấy ${BLANK} ạ.\n- Đại diện nhóm 2: Nhóm con thấy khác, ${BLANK} ạ.\n- Trẻ các nhóm lắng nghe, bổ sung.`));
  s.push({
    ten_buoc: 'E2 – Khám phá (Explore)', thoi_gian: age.e5[1],
    muc_dich: 'Trẻ tự quan sát, trải nghiệm; cô tạo môi trường khám phá, không giảng giải.',
    tich_hop_steam: `S – khám phá ${dt}; E – thao tác ${cach}${dc.length ? `; T – sử dụng ${join(dc)}` : ''}.`,
    luot: e2
  });
  const e3 = [];
  dd.forEach((f) => {
    e3.push(turn(nt ? `Cô: ${cap(f)} của ${dt} đâu? Thế nào?` : `Cô: Các con đã phát hiện được gì về ${f}?`,
      nt ? '- Trẻ chỉ, nói theo cô.' : `- Trẻ 1: ${BLANK} ạ.\n- Trẻ 2: Con thấy ${BLANK} ạ.`));
    e3.push(turn(nt
      ? `Cô chỉ và nói: "Đây là ${f} của ${dt}." Cô cho từng trẻ chỉ, nói lại.`
      : `Cô ghi nhận ý kiến của trẻ rồi chốt về ${f}: "${BLANK}." Cô cho trẻ nhắc lại.`, '- Trẻ chỉ, nói lại cùng cô.'));
  });
  e3.push(turn(`Cô khái quát: "${cap(dt)} có ${join(dd)}..." Cô cho trẻ nhắc lại.`, '- Trẻ nhắc lại cùng cô.'));
  s.push({
    ten_buoc: 'E3 – Giải thích (Explain)', thoi_gian: age.e5[2],
    muc_dich: 'Trẻ nói trước, cô ghi nhận rồi chuẩn hóa kiến thức.',
    tich_hop_steam: `S – kiến thức về ${dt}${toan ? '; M – đếm, so sánh' : ''}.`,
    luot: e3
  });
  s.push({
    ten_buoc: 'E4 – Củng cố, mở rộng, áp dụng (Elaborate)', thoi_gian: age.e5[3],
    muc_dich: 'Trẻ củng cố qua trò chơi, mở rộng hiểu biết và vận dụng vào thực tế.',
    tich_hop_steam: nt ? 'A – trò chơi, vận động.' : 'A – trò chơi, vận động; M – đếm, so sánh trong trò chơi.',
    luot: nt ? [
      turn(`Trò chơi "${BLANK}": cô nói/làm tiếng, động tác, trẻ tìm đúng ${dt}.`, '- Trẻ chơi cùng cô, hứng thú.')
    ] : [
      turn(`Củng cố: Cô tổ chức trò chơi "${BLANK}" — cô nói đặc điểm, các đội tìm đúng ${dt}.`, '- Trẻ chơi theo luật, hứng thú.'),
      turn(`Mở rộng: Cô cho trẻ xem hình ảnh/video ${BLANK}.\nCô: Các con thấy điểm gì giống và khác với ${dt}?`, `- Trẻ 1: Giống ở ${BLANK} ạ.\n- Trẻ 2: Khác ở ${BLANK} ạ.`),
      turn('Áp dụng: Cô: Biết được điều này rồi, ở lớp và ở nhà chúng mình sẽ làm gì?', `- Trẻ 1: ${BLANK} ạ.\n- Trẻ 2: Con sẽ kể cho bố mẹ ạ.`)
    ]
  });
  s.push({
    ten_buoc: 'E5 – Đánh giá (Evaluate)', thoi_gian: age.e5[4],
    muc_dich: 'Trẻ nêu cảm nhận; cô đánh giá quá trình, giáo dục, khen ngợi, thu dọn.',
    tich_hop_steam: `A – giáo dục: ${gd}.`,
    luot: [
      turn(nt ? `Cô: Hôm nay con chơi với gì? Con thích không?` : `Cô: Hôm nay các con đã khám phá được điều gì về ${dt}? Con thích nhất điều gì?`,
        nt ? `- Trẻ: ${cap(dt)}!\n- Trẻ: Thích ạ!` : `- Trẻ 1: Con biết ${BLANK} ạ.\n- Trẻ 2: Con thích lúc được ${cach.split(',')[0]} ạ.`),
      turn(`Cô nhận xét chung (tinh thần khám phá, hợp tác, mạnh dạn chia sẻ), giáo dục: ${gd}. Cô khen ngợi, tặng sao/huy hiệu.`, '- Trẻ lắng nghe, vui vẻ.'),
      turn('Cô cùng trẻ thu dọn đồ dùng, chuyển hoạt động.', '- Trẻ thu dọn đồ dùng cùng cô.')
    ]
  });
  plan.cach_tien_hanh = s;
  return plan;
}

/* ---------------- CHUẨN BỊ ---------------- */
function prep(inp, nt, obj, nl, dc, qt, bang) {
  const doDung = [];
  if (bang) doDung.push(qt === 'EDP' ? 'Bảng thiết kế cho mỗi nhóm (giấy vẽ + bút màu).' : 'Bảng ghi chép bằng hình ảnh cho mỗi nhóm.');
  if (qt === 'EDP') doDung.push(`${cap(obj)} mẫu do cô làm sẵn (hoặc hình ảnh).`);
  else if (!nl.length) doDung.push(`${cap(obj)} (vật thật/mô hình/hình ảnh) đủ cho các nhóm.`);
  if (nl.length) doDung.push(`${qt === 'EDP' ? 'Nguyên vật liệu' : 'Đồ dùng khám phá'}: ${join(nl)}.`);
  if (dc.length) doDung.push(`Dụng cụ: ${join(dc)}.`);
  doDung.push(`Nhạc nền, ${inp.moDau || 'bài hát/câu đố mở đầu'}.`);

  const anToan = ['Kiểm tra nguyên vật liệu sạch sẽ, không có cạnh sắc, không quá nhỏ để tránh trẻ cho vào miệng, mũi, tai.'];
  if (dc.some((d) => /kéo/i.test(d))) anToan.push('Kéo mầm non đầu tròn; nhắc trẻ cầm kéo đúng cách, không chĩa vào bạn.');
  if (dc.some((d) => /keo|súng/i.test(d))) anToan.push('Keo dán khô/keo sữa an toàn; không dùng súng bắn keo nóng cho trẻ.');
  if (nl.some((x) => /nước/i.test(x)) || /nổi|chìm|nước/i.test(obj)) anToan.push('Chậu nước đặt chắc chắn; lau khô sàn ngay khi nước đổ để tránh trơn trượt.');
  if (/ăn|bánh|chè|cơm|nấu/i.test(`${obj} ${inp.linhVuc || ''}`)) anToan.push('Thực phẩm sạch, hỏi phụ huynh về dị ứng của trẻ; trẻ rửa tay trước khi làm.');

  return {
    co: {
      tam_the_tam_ly_suc_khoe: `Thoải mái, năng lượng, vui vẻ; sức khỏe tốt; nắm vững quy trình ${qt} và dự kiến các tình huống trẻ có thể gặp (${BLANK}).`,
      do_dung_hoc_lieu: doDung,
      moi_truong: nt
        ? 'Lớp học thoáng, sạch; trẻ ngồi chiếu/thảm theo nhóm nhỏ có cô đi kèm.'
        : `Không gian lớp học rộng rãi, chia khu vực theo nhóm${qt === 'EDP' ? '; có khu vực thử nghiệm và trưng bày sản phẩm' : '; có góc trưng bày kết quả khám phá'}.`,
      an_toan: anToan
    },
    tre: {
      tam_the_tam_ly_suc_khoe: 'Tâm lý vui vẻ, sẵn sàng tham gia trải nghiệm; sức khỏe ổn định.',
      do_dung_nguyen_lieu: [],
      trang_phuc: 'Gọn gàng, thoải mái khi di chuyển và vận động.',
      an_toan: nt ? 'Trẻ được cô nhắc không cho đồ vật vào miệng, mũi, tai.' : `Thuộc quy tắc không ngậm đồ chơi, nguyên liệu nhỏ${dc.length ? '; sử dụng dụng cụ theo hướng dẫn' : ''}.`
    },
    phu_huynh: clean(inp.phuHuynh)
  };
}

export function countBlanks(plan) {
  return (JSON.stringify(plan).match(/«…»/g) || []).length;
}
