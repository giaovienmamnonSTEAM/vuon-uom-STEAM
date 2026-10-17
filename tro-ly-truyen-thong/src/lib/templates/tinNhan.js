// Soạn TIN NHẮN gửi phụ huynh theo mẫu (không dùng AI).
import { findHarshWords } from '../textTools.js';
import { blocks, lines, pick, sentence, splitItems, t, lopName, lowerFirst } from '../text.js';

function cap(s) {
  return s ? s.charAt(0).toLocaleUpperCase('vi') + s.slice(1) : s;
}

export function generateTinNhan(d, settings = {}, variant = 0) {
  const loai = d.loai || 'nhom';
  const style = d.phongCach || 'than-thien';
  const lop = lopName(d.tenLop);
  const gvRaw = t(d.tenGiaoVien);
  // Người gửi tự xưng: "cô Lan" → "cô"; nếu không có tên thì dùng "cô"
  const toi = 'cô';
  const gvIntro = gvRaw ? (/^(cô|thầy)\s/i.test(gvRaw) ? gvRaw : `cô ${gvRaw}`) : 'cô giáo';
  const isGroup = ['nhom', 'do-dung', 'lich-hop'].includes(loai);
  const xungHo = t(d.xungHo) || (isGroup ? 'các bố mẹ' : 'anh chị');
  const items = splitItems(d.noiDung);
  const thoiGian = t(d.thoiGian);
  const notes = [];

  const harsh = findHarshWords(d.noiDung);
  if (harsh.length) {
    notes.push(
      'Gợi ý từ ngữ nhẹ nhàng hơn: ' + harsh.map((h) => `“${h.word}” → “${h.suggestion}”`).join('; ') + '. Hãy cân nhắc sửa trong ô nội dung rồi soạn lại.'
    );
  }

  const formal = style === 'trang-trong';
  const short = style === 'ngan-gon';
  const a = formal ? '' : ' ạ';

  // Lời chào
  const chao = formal
    ? `Kính gửi ${cap(xungHo === 'các bố mẹ' ? 'Quý phụ huynh' : xungHo)}${lop ? ' lớp ' + lop : ''}.`
    : short
      ? `Chào ${xungHo}${a}!`
      : pick([`Chào ${xungHo}${a}!`, `${cap(toi)} chào ${xungHo}${a}!`, `Kính chào ${xungHo}${a}!`], variant);

  const tuGioiThieu = formal
    ? `Tôi là ${gvIntro}, giáo viên${lop ? ' lớp ' + lop : ''}.`
    : short
      ? ''
      : `${cap(gvIntro)}${lop ? ' lớp ' + lop : ''} xin phép nhắn ${xungHo}.`;

  const ds = (mark) => (items.length === 1 ? sentence(items[0]) : items.map((x) => `${mark} ${sentence(x)}`).join('\n'));
  const mark = formal || short ? '-' : '🔸';
  const hanStr = thoiGian ? (formal ? `Thời gian: ${thoiGian}.` : `⏰ ${thoiGian}`) : '';

  let body;
  let ket;
  switch (loai) {
    case 'do-dung':
      body = blocks(
        formal ? `Để các cháu tham gia hoạt động thuận lợi, đề nghị Quý phụ huynh chuẩn bị giúp các cháu:` : `${cap(toi)} nhờ ${xungHo} chuẩn bị giúp con${short ? ':' : ' một số đồ dùng sau nhé:'}`,
        ds(mark),
        hanStr
      );
      ket = formal ? 'Trân trọng cảm ơn Quý phụ huynh!' : pick([`${cap(toi)} cảm ơn ${xungHo}${a}! 💐`, `Cảm ơn ${xungHo} đã chuẩn bị chu đáo cho các con${a}! 🌸`], variant);
      break;
    case 'lich-hop':
      body = blocks(
        formal ? 'Lớp xin nhắc lịch họp phụ huynh như sau:' : `${cap(toi)} xin nhắc ${xungHo} lịch họp phụ huynh${short ? ':' : ' ạ:'}`,
        hanStr,
        ds(mark)
      );
      ket = formal
        ? 'Rất mong Quý phụ huynh sắp xếp thời gian tham dự đầy đủ, đúng giờ. Trân trọng cảm ơn!'
        : `${cap(xungHo)} sắp xếp thời gian tham dự giúp ${toi} nhé. ${cap(toi)} cảm ơn${a}! 🌼`;
      break;
    case 'ne-nep':
      body = blocks(
        formal
          ? 'Tôi xin trao đổi với gia đình một số điều về nề nếp sinh hoạt của cháu ở lớp để gia đình cùng nắm thông tin:'
          : `${cap(toi)} muốn chia sẻ với ${xungHo} một chút về nề nếp sinh hoạt của con ở lớp${a}:`,
        ds(mark),
        formal
          ? 'Ở lớp, giáo viên sẽ tiếp tục nhắc nhở, hướng dẫn cháu nhẹ nhàng. Rất mong gia đình cùng phối hợp duy trì thói quen này ở nhà.'
          : `Ở lớp ${toi} sẽ tiếp tục nhẹ nhàng nhắc và hướng dẫn con. Nếu ở nhà ${xungHo} cũng cùng nhắc con như vậy thì con sẽ quen nếp nhanh hơn${a}.`
      );
      ket = formal ? 'Trân trọng cảm ơn sự phối hợp của gia đình!' : `${cap(toi)} cảm ơn ${xungHo} đã luôn quan tâm, đồng hành cùng ${toi}${a}! 🌷`;
      break;
    case 'dong-vien':
      body = blocks(
        formal
          ? 'Lớp trân trọng cảm ơn sự quan tâm của gia đình thời gian qua và mong tiếp tục nhận được sự phối hợp trong những việc sau:'
          : `${cap(toi)} rất cảm ơn ${xungHo} đã luôn quan tâm đến các hoạt động của lớp${a}. Thời gian tới, ${toi} mong ${xungHo} tiếp tục cùng ${toi}:`,
        ds(mark),
        hanStr,
        formal ? 'Sự phối hợp giữa gia đình và nhà trường sẽ giúp các cháu tiến bộ mỗi ngày.' : `Có ${xungHo} đồng hành, các con sẽ tự tin và tiến bộ hơn mỗi ngày${a}!`
      );
      ket = formal ? 'Trân trọng!' : `${cap(toi)} cảm ơn ${xungHo} thật nhiều${a}! 💖`;
      break;
    case 'nhay-cam':
      body = blocks(
        formal
          ? 'Tôi xin phép được trao đổi riêng với gia đình một việc liên quan đến cháu. Tôi chia sẻ để gia đình cùng nắm thông tin và cùng tìm cách hỗ trợ cháu tốt nhất, không nhằm phàn nàn hay trách móc.'
          : `${cap(toi)} xin phép trao đổi riêng với ${xungHo} một chút về con${a}. ${cap(toi)} chia sẻ để mình cùng nắm thông tin và cùng giúp con tốt hơn, không phải để phàn nàn đâu${a}.`,
        ds(mark),
        formal
          ? 'Nếu thuận tiện, rất mong gia đình dành ít phút để trao đổi trực tiếp hoặc qua điện thoại với giáo viên.'
          : `Nếu ${xungHo} tiện, mình có thể trao đổi thêm trực tiếp khi đón con hoặc qua điện thoại để ${toi} hiểu con hơn${a}.`,
        hanStr
      );
      ket = formal ? 'Trân trọng cảm ơn sự thông cảm và hợp tác của gia đình!' : `${cap(toi)} cảm ơn ${xungHo} đã lắng nghe và thông cảm${a}! 🌸`;
      notes.push('Với tình huống nhạy cảm, nên ưu tiên trao đổi trực tiếp; tin nhắn chỉ để mở đầu câu chuyện. Không nêu tên trẻ khác trong tin nhắn.');
      break;
    case 'rieng':
      body = blocks(ds(mark), hanStr);
      ket = formal ? 'Trân trọng cảm ơn anh/chị!' : `${cap(toi)} cảm ơn ${xungHo}${a}!`;
      break;
    default: // nhom
      body = blocks(
        formal ? 'Lớp xin thông tin tới Quý phụ huynh một số nội dung sau:' : `${cap(toi)} xin gửi ${xungHo} một vài thông tin${short ? ':' : ' của lớp mình nhé:'}`,
        ds(mark),
        hanStr
      );
      ket = formal ? 'Trân trọng cảm ơn Quý phụ huynh!' : pick([`${cap(toi)} cảm ơn ${xungHo}${a}! 💐`, `Chúc ${xungHo} một ngày vui vẻ${a}! 🌞`, `Cảm ơn ${xungHo} đã luôn đồng hành cùng lớp${a}! 🌼`], variant);
  }

  const ky = formal ? lines(gvRaw ? cap(gvIntro) : '', lop ? `Giáo viên lớp ${lop}` : '') : '';
  let text = blocks(chao, tuGioiThieu, body, ket, ky);
  if (short) text = text.replace(/\n\n/g, '\n');
  if (formal) text = text.replace(/[💐🌸🌼🌷💖🌞🔸⏰]/gu, '');

  const titleMap = {
    rieng: 'Tin nhắn riêng', nhom: 'Tin nhắn nhóm lớp', 'do-dung': 'Nhắc chuẩn bị đồ dùng', 'lich-hop': 'Nhắc lịch họp',
    'ne-nep': 'Trao đổi nề nếp', 'dong-vien': 'Động viên phối hợp', 'nhay-cam': 'Trao đổi tế nhị'
  };
  return { text: text.trim(), title: `${titleMap[loai] || 'Tin nhắn'}${lop ? ' – lớp ' + lop : ''}: ${lowerFirst(items[0] || '').slice(0, 50)}`, notes, missing: [] };
}
