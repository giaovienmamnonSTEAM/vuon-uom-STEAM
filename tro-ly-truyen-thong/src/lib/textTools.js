// Biên tập văn bản THEO QUY TẮC (không dùng AI).
// Các hàm ở đây chỉ chỉnh hình thức (khoảng trắng, dấu câu, viết hoa, một số lỗi
// chính tả thường gặp, cách xưng hô, bố cục). Chúng KHÔNG đổi ngày tháng, số liệu
// hay dữ kiện. Viết lại sâu về ý thì cần kết nối AI.
import { blocks, lines, t, upper } from './text.js';

// ---------------------------------------------------------------------------
// 1. Lỗi chính tả thường gặp (chỉ những cặp gần như luôn sai, so khớp nguyên cụm từ)
// ---------------------------------------------------------------------------
const COMMON_TYPOS = [
  ['trân thành', 'chân thành'],
  ['chân trọng', 'trân trọng'],
  ['giành cho', 'dành cho'],
  ['sử lý', 'xử lý'],
  ['xử dụng', 'sử dụng'],
  ['xắp xếp', 'sắp xếp'],
  ['chuẩn đoán', 'chẩn đoán'],
  ['dữ gìn', 'giữ gìn'],
  ['xinh hoạt', 'sinh hoạt'],
  ['suất sắc', 'xuất sắc'],
  ['tham quang', 'tham quan'],
  ['bổ xung', 'bổ sung'],
  ['sáng lạn', 'xán lạn'],
  ['năng xuất', 'năng suất'],
  ['sản suất', 'sản xuất'],
  ['chao đổi', 'trao đổi'],
  ['trương trình', 'chương trình'],
  ['khai giản', 'khai giảng'],
  ['nghĩ học', 'nghỉ học'],
  ['nghĩ lễ', 'nghỉ lễ'],
  ['nghĩ hè', 'nghỉ hè'],
  ['nghĩ tết', 'nghỉ tết'],
  ['sỉ số', 'sĩ số'],
  ['giúp đở', 'giúp đỡ'],
  ['phụ huỳnh', 'phụ huynh'],
  ['thông bào', 'thông báo'],
  ['chẳng lẻ', 'chẳng lẽ'],
  ['dành mạch', 'rành mạch'],
  ['dành giật', 'giành giật'],
  ['đồ chơi chẻ em', 'đồ chơi trẻ em'],
  ['chẻ em', 'trẻ em'],
  ['xâu sắc', 'sâu sắc'],
  ['dải thưởng', 'giải thưởng'],
  ['giải băng', 'dải băng'],
  ['kỹ niệm', 'kỷ niệm'],
  ['kĩ niệm', 'kỉ niệm'],
  ['chia xẻ', 'chia sẻ'],
  ['chia sẽ', 'chia sẻ'],
  ['vui chơi giải chí', 'vui chơi giải trí'],
  ['giải chí', 'giải trí'],
  ['dáo viên', 'giáo viên'],
  ['ngày nhà giáo việt nam', 'ngày Nhà giáo Việt Nam'],
  ['quốc khánh', 'Quốc khánh'],
  ['tết dương lịch', 'Tết Dương lịch'],
  ['tết nguyên đán', 'Tết Nguyên đán'],
  ['tết trung thu', 'Tết Trung thu'],
  ['quý phụ huynh', 'Quý phụ huynh']
].filter(([a, b]) => a !== b);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keepCase(src, repl) {
  // Nếu cụm gốc viết hoa chữ đầu thì viết hoa chữ đầu của cụm thay thế.
  if (src.charAt(0) !== src.charAt(0).toLocaleLowerCase('vi')) {
    return repl.charAt(0).toLocaleUpperCase('vi') + repl.slice(1);
  }
  return repl;
}

export function fixCommonTypos(text) {
  let out = text;
  const changes = [];
  for (const [wrong, right] of COMMON_TYPOS) {
    const re = new RegExp(`(?<![\\p{L}])${escapeRe(wrong)}(?![\\p{L}])`, 'giu');
    out = out.replace(re, (m) => {
      const r = keepCase(m, right);
      if (r !== m) changes.push(`“${m}” → “${r}”`);
      return r;
    });
  }
  return { text: out, changes };
}

// ---------------------------------------------------------------------------
// 2. Khoảng trắng, dấu câu, viết hoa đầu câu
// ---------------------------------------------------------------------------
export function normalizeSpacing(text) {
  let x = String(text || '').replace(/\r\n?/g, '\n');
  x = x.replace(/[ \t ]+/g, ' ');
  // bỏ khoảng trắng trước dấu câu
  x = x.replace(/ +([,.;:!?…)\]”])/g, '$1');
  // bỏ khoảng trắng sau dấu mở ngoặc
  x = x.replace(/([(\[“]) +/g, '$1');
  // thêm khoảng trắng sau dấu câu nếu liền chữ (không đụng tới số: 7.30, 1,5, 20/11, giờ 7:30)
  x = x.replace(/([,;!?])(?=[\p{L}])/gu, '$1 ');
  x = x.replace(/([.:])(?=[\p{Lu}])/gu, '$1 ');
  x = x.replace(/(\p{Ll})([.:])(?=\p{Ll})/gu, '$1$2 ');
  // lặp dấu
  x = x.replace(/,{2,}/g, ',').replace(/(?<!\.)\.{2}(?!\.)/g, '.');
  // dòng
  x = x
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return x.trim();
}

export function capitalizeSentences(text) {
  // Viết hoa chữ đầu dòng và chữ đầu sau . ! ? (không đụng tới số thập phân, chữ viết tắt).
  let x = text.replace(/(^|\n)(\s*(?:[-–•+*✅🔹📌]\s*)?)(\p{Ll})/gu, (m, a, b, c) => a + b + c.toLocaleUpperCase('vi'));
  x = x.replace(/([.!?]\s+)(\p{Ll})/gu, (m, a, c) => a + c.toLocaleUpperCase('vi'));
  return x;
}

export function fixSpelling(text) {
  const before = String(text || '');
  const { text: typoFixed, changes } = fixCommonTypos(before);
  const out = capitalizeSentences(normalizeSpacing(typoFixed));
  const notes = [];
  if (changes.length) notes.push(`Đã sửa ${changes.length} lỗi chính tả thường gặp: ${changes.join(', ')}.`);
  if (out !== typoFixed) notes.push('Đã chuẩn hóa khoảng trắng, dấu câu và viết hoa đầu câu.');
  if (!notes.length) notes.push('Không phát hiện lỗi theo các quy tắc cơ bản.');
  notes.push('Chế độ không dùng AI chỉ sửa được lỗi hình thức và một số lỗi thường gặp; nên đọc lại trước khi gửi.');
  return { text: out, notes };
}

// ---------------------------------------------------------------------------
// 3. Từ ngữ dễ gây tổn thương / phán xét khi trao đổi với phụ huynh
// ---------------------------------------------------------------------------
const SOFT_WORDS = [
  ['hư', 'chưa thực hiện đúng nề nếp'],
  ['hư hỏng', 'chưa thực hiện đúng nề nếp'],
  ['lười', 'chưa hứng thú'],
  ['lười ăn', 'ăn chưa được nhiều'],
  ['lười biếng', 'chưa tích cực'],
  ['nghịch ngợm', 'hiếu động'],
  ['hỗn', 'chưa lễ phép'],
  ['láo', 'chưa lễ phép'],
  ['bướng', 'còn giữ ý mình'],
  ['bướng bỉnh', 'còn giữ ý mình'],
  ['dốt', 'cần thêm thời gian để tiếp thu'],
  ['học kém', 'cần được hỗ trợ thêm'],
  ['chậm hiểu', 'cần thêm thời gian để tiếp thu'],
  ['đánh bạn', 'có va chạm với bạn'],
  ['phá phách', 'chưa giữ gìn đồ dùng'],
  ['mè nheo', 'cần được cô vỗ về nhiều hơn'],
  ['ăn vạ', 'bộc lộ cảm xúc mạnh'],
  ['gia đình không quan tâm', 'gia đình có thể dành thêm thời gian'],
  ['phụ huynh không chịu', 'phụ huynh chưa có điều kiện'],
  ['lỗi của gia đình', 'việc gia đình và cô cùng cần lưu ý']
];

export function findHarshWords(text) {
  const found = [];
  const sorted = [...SOFT_WORDS].sort((a, b) => b[0].length - a[0].length);
  let probe = String(text || '');
  for (const [w, s] of sorted) {
    const re = new RegExp(`(?<![\\p{L}])${escapeRe(w)}(?![\\p{L}])`, 'giu');
    if (re.test(probe)) {
      found.push({ word: w, suggestion: s });
      probe = probe.replace(re, ' ');
    }
  }
  return found;
}

export function softenWords(text) {
  let out = String(text || '');
  const sorted = [...SOFT_WORDS].sort((a, b) => b[0].length - a[0].length);
  const changes = [];
  for (const [w, s] of sorted) {
    const re = new RegExp(`(?<![\\p{L}])${escapeRe(w)}(?![\\p{L}])`, 'giu');
    out = out.replace(re, (m) => {
      changes.push(`“${m}” → “${s}”`);
      return keepCase(m, s);
    });
  }
  return { text: out, changes };
}

// ---------------------------------------------------------------------------
// 4. Đổi giọng văn (thay cụm xưng hô / cụm từ)
// ---------------------------------------------------------------------------
const TO_FRIENDLY = [
  ['Kính gửi Quý phụ huynh', 'Kính gửi các bố mẹ'],
  ['Kính gửi: Quý phụ huynh', 'Kính gửi các bố mẹ'],
  ['Đề nghị Quý phụ huynh', 'Cô nhờ các bố mẹ'],
  ['đề nghị Quý phụ huynh', 'nhờ các bố mẹ'],
  ['Đề nghị phụ huynh', 'Cô nhờ các bố mẹ'],
  ['đề nghị phụ huynh', 'nhờ các bố mẹ'],
  ['Quý phụ huynh', 'các bố mẹ'],
  ['quý phụ huynh', 'các bố mẹ'],
  ['các cháu', 'các con'],
  ['Đề nghị', 'Cô nhờ'],
  ['đề nghị', 'nhờ'],
  ['trân trọng thông báo', 'xin thông báo'],
  ['Trân trọng thông báo!', 'Cô cảm ơn các bố mẹ ạ!'],
  ['Trân trọng cảm ơn!', 'Cô cảm ơn các bố mẹ nhiều ạ!'],
  ['Trân trọng!', 'Cô cảm ơn các bố mẹ ạ!']
];

const TO_FORMAL = [
  ['các bố mẹ', 'Quý phụ huynh'],
  ['Các bố mẹ', 'Quý phụ huynh'],
  ['bố mẹ', 'phụ huynh'],
  ['Bố mẹ', 'Phụ huynh'],
  ['ba mẹ', 'phụ huynh'],
  ['Ba mẹ', 'Phụ huynh'],
  ['các con', 'các cháu'],
  ['Các con', 'Các cháu'],
  ['Cô nhờ', 'Đề nghị'],
  ['cô nhờ', 'đề nghị'],
  ['giúp cô', ''],
  ['nhé', ''],
  ['nha', ''],
  [' ạ!', '!'],
  [' ạ.', '.'],
  [' ạ', '']
];

function replacePhrases(text, pairs) {
  let out = text;
  for (const [a, b] of pairs) {
    const re = new RegExp(`(?<![\\p{L}])${escapeRe(a.trim())}(?![\\p{L}])`, 'gu');
    if (a.startsWith(' ')) out = out.split(a).join(b);
    else out = out.replace(re, b);
  }
  return out.replace(/ {2,}/g, ' ').replace(/ +([,.!?])/g, '$1');
}

const EMOJI_RE = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍]/gu;

export function stripEmoji(text) {
  return text.replace(EMOJI_RE, '').replace(/^[ \t]+/gm, '').replace(/ {2,}/g, ' ');
}

const GREETING_RE = /^(kính gửi|kính chào|thân gửi|chào|xin chào|cô xin chào|thân chào|kính thưa)/i;
const THANKS_RE = /(cảm ơn|trân trọng)/i;

function hasGreeting(text) {
  const first = text.trim().split('\n').slice(0, 3).join(' ');
  return GREETING_RE.test(first.replace(EMOJI_RE, '').trim()) || /kính gửi/i.test(first);
}

function hasThanks(text) {
  const last = text.trim().split('\n').slice(-3).join(' ');
  return THANKS_RE.test(last);
}

export function makeFriendly(text, variant = 0) {
  let x = replacePhrases(normalizeSpacing(text), TO_FRIENDLY);
  if (!hasGreeting(x)) x = ['Cô chào các bố mẹ ạ! 🌸', 'Kính gửi các bố mẹ thân mến!', 'Thân gửi các bố mẹ!'][variant % 3] + '\n\n' + x;
  if (!hasThanks(x)) x = x + '\n\n' + ['Cô cảm ơn các bố mẹ nhiều ạ! 💐', 'Cảm ơn các bố mẹ đã luôn đồng hành cùng cô và các con ạ!', 'Cô cảm ơn sự quan tâm của các bố mẹ ạ! 🌼'][variant % 3];
  return {
    text: capitalizeSentences(x),
    notes: ['Đã đổi cách xưng hô sang thân mật hơn, thêm lời chào/lời cảm ơn nếu thiếu. Nội dung, ngày giờ được giữ nguyên.']
  };
}

export function makeFormal(text) {
  let x = stripEmoji(normalizeSpacing(text));
  x = replacePhrases(x, TO_FORMAL);
  x = x.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?');
  if (!hasGreeting(x)) x = 'Kính gửi: Quý phụ huynh.\n\n' + x;
  if (!hasThanks(x)) x = x + '\n\nTrân trọng cảm ơn!';
  return {
    text: capitalizeSentences(normalizeSpacing(x)),
    notes: ['Đã bỏ biểu tượng cảm xúc, đổi cách xưng hô sang trang trọng, thêm lời kính gửi/lời cảm ơn nếu thiếu. Nội dung, ngày giờ được giữ nguyên.']
  };
}

// ---------------------------------------------------------------------------
// 5. Rút gọn, làm rõ, đổi định dạng
// ---------------------------------------------------------------------------
const FILLER_LINE_RE = /^(chúc (các|quý|cả)|kính chúc|chúc mọi người|chúc gia đình|thân ái|yêu thương)/i;
const FILLER_WORDS = [' thật sự', ' vô cùng', ' hết sức', ' rất là', ' thực sự'];

export function shorten(text) {
  let x = stripEmoji(normalizeSpacing(text));
  const kept = [];
  const seen = new Set();
  let removed = 0;
  for (const raw of x.split('\n')) {
    const l = raw.trim();
    const key = l.toLowerCase();
    if (l && seen.has(key)) { removed++; continue; }
    if (l && FILLER_LINE_RE.test(l) && !/\d/.test(l)) { removed++; continue; }
    if (l) seen.add(key);
    kept.push(l);
  }
  x = kept.join('\n').replace(/\n{3,}/g, '\n\n');
  for (const w of FILLER_WORDS) x = x.split(w).join('');
  const notes = ['Đã bỏ biểu tượng, dòng trống thừa, câu chúc và dòng lặp' + (removed ? ` (bỏ ${removed} dòng)` : '') + '. Ngày giờ, số liệu giữ nguyên.'];
  notes.push('Chế độ không dùng AI không tóm tắt lại ý được; muốn rút gọn sâu hơn hãy kết nối AI hoặc tự cắt bớt.');
  return { text: x.trim(), notes };
}

const DATE_RE = /(?<![\d/])(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)(?![\d/])/g;
const TIME_RE = /(?<![\d])(\d{1,2}\s?(?:h|giờ|:)\s?\d{0,2}(?:\s?phút)?)(?![\p{L}\d])/giu;

export function clarify(text) {
  let x = normalizeSpacing(text);
  // Tách câu dài có nhiều vế chấm phẩy thành gạch đầu dòng
  x = x
    .split('\n')
    .map((l) => {
      if (l.length > 120 && l.includes(';')) {
        const [head, ...rest] = l.split(';');
        return [head.trim(), ...rest.map((r) => '- ' + r.trim())].join('\n');
      }
      return l;
    })
    .join('\n');
  // Chuẩn hoá ký hiệu đầu dòng
  x = x.replace(/^\s*[•+*·]\s*/gm, '- ');
  x = capitalizeSentences(x);
  const dates = [...new Set([...x.matchAll(DATE_RE)].map((m) => m[1]))];
  const times = [...new Set([...x.matchAll(TIME_RE)].map((m) => m[1].trim()))];
  if (dates.length || times.length) {
    x += '\n\n📌 Ghi nhớ:' + (dates.length ? ` ngày ${dates.join(', ')}` : '') + (dates.length && times.length ? ';' : '') + (times.length ? ` lúc ${times.join(', ')}` : '') + '.';
  }
  return {
    text: x,
    notes: ['Đã chia câu dài thành gạch đầu dòng, chuẩn hóa ký hiệu và thêm dòng “Ghi nhớ” tóm tắt ngày giờ có trong bài (nếu có).']
  };
}

export function toZalo(text, settings = {}, variant = 0) {
  const lop = t(settings.tenLop);
  let body = replacePhrases(normalizeSpacing(text), TO_FRIENDLY);
  // bỏ các dòng tiêu đề hành chính
  body = body
    .split('\n')
    .filter((l) => !/^(CỘNG HÒA|Độc lập|Số:|Nơi nhận|-\s*Lưu)/i.test(l.trim()))
    .join('\n')
    .replace(/\n{2,}/g, '\n');
  if (hasGreeting(body)) {
    body = body.replace(/^.*\n?/, '');
  }
  const greet = ['🌸 Cô chào các bố mẹ' + (lop ? ` lớp ${lop}` : '') + ' ạ!', '🌼 Kính gửi các bố mẹ' + (lop ? ` lớp ${lop}` : '') + '!', '☀️ Thân gửi các bố mẹ' + (lop ? ` lớp ${lop}` : '') + '!'][variant % 3];
  let out = greet + '\n' + body.trim();
  if (!hasThanks(out)) out += '\nCô cảm ơn các bố mẹ ạ! 💐';
  return { text: capitalizeSentences(out), notes: ['Đã chuyển sang dạng tin nhắn Zalo: lời chào thân thiện, câu gọn, bỏ phần đầu văn bản hành chính.'] };
}

function guessSubject(text) {
  const first = text.trim().split('\n').find((l) => l.trim() && !GREETING_RE.test(l.trim())) || '';
  const clean = stripEmoji(first).replace(/^(thông báo|v\/v)[:\s]*/i, '').trim();
  return clean.length <= 70 && !/[.]$/.test(clean) ? clean : '';
}

const TRAILING_THANKS_RE = /(\n+\s*(xin |trân trọng |chân thành )*(chân thành |trân trọng )?(cảm ơn|thông báo)[^\n]*)+\s*$/i;

function stripGreeting(text) {
  const arr = text.split('\n');
  while (arr.length && (!arr[0].trim() || GREETING_RE.test(stripEmoji(arr[0]).trim()))) arr.shift();
  return arr.join('\n');
}

export function toOfficialNotice(text, settings = {}) {
  const truong = t(settings.tenTruong);
  const lop = t(settings.tenLop);
  const subject = guessSubject(text);
  let body = makeFormal(text).text;
  body = stripGreeting(body);
  if (subject) body = body.replace(subject, '').replace(/^\s*\n/, '');
  body = body.replace(TRAILING_THANKS_RE, '');
  const out = blocks(
    lines(truong && upper(truong), lop && `Lớp: ${lop}`),
    lines('THÔNG BÁO', subject ? `V/v: ${subject}` : 'V/v: [CẦN BỔ SUNG: nội dung thông báo]'),
    `Kính gửi: Quý phụ huynh${lop ? ' lớp ' + lop : ''}.`,
    body.trim(),
    'Trân trọng thông báo!',
    lines(lop ? 'GIÁO VIÊN CHỦ NHIỆM' : 'T/M NHÀ TRƯỜNG', t(settings.tenGiaoVien))
  );
  return { text: out, notes: ['Đã đặt nội dung vào bố cục thông báo chính thức (tên đơn vị, tiêu đề, kính gửi, nội dung, ký tên). Kiểm tra lại dòng “V/v”.'] };
}

export function toAdministrative(text, settings = {}) {
  const truong = t(settings.tenTruong);
  const chuQuan = t(settings.donViChuQuan);
  const subject = guessSubject(text);
  let body = stripGreeting(makeFormal(text).text);
  if (subject) body = body.replace(subject, '').replace(/^\s*\n/, '');
  body = body.replace(TRAILING_THANKS_RE, '');
  const out = blocks(
    lines(chuQuan ? upper(chuQuan) : '[CẦN BỔ SUNG: đơn vị chủ quản]', truong ? upper(truong) : '[CẦN BỔ SUNG: tên trường]', 'Số: …/TB-…'),
    lines('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 'Độc lập – Tự do – Hạnh phúc'),
    '…, ngày … tháng … năm …',
    lines('THÔNG BÁO', subject ? `Về việc ${subject.charAt(0).toLocaleLowerCase('vi') + subject.slice(1)}` : 'Về việc [CẦN BỔ SUNG: trích yếu]'),
    'Kính gửi: Quý phụ huynh học sinh.',
    body.trim(),
    'Đề nghị Quý phụ huynh quan tâm, phối hợp thực hiện./.',
    lines('Nơi nhận:', '- Như kính gửi;', '- Lưu: VT.'),
    lines('HIỆU TRƯỞNG', '(Ký, ghi rõ họ tên)')
  );
  return {
    text: out,
    notes: ['Đã trình bày theo bố cục văn bản hành chính (quốc hiệu, tiêu ngữ, số, ngày, trích yếu, nơi nhận). Các chỗ “…” và [CẦN BỔ SUNG] cần điền theo văn bản thật của nhà trường.']
  };
}

// Mở rộng theo quy tắc: chỉ thêm lời chào, lời cảm ơn và dòng tóm tắt ngày giờ; không thêm dữ kiện.
export function expand(text, variant = 0) {
  const friendly = makeFriendly(text, variant).text;
  const withMemo = clarify(friendly).text;
  return {
    text: withMemo,
    notes: [
      'Chế độ không dùng AI chỉ mở rộng được phần hình thức (lời chào, lời cảm ơn, dòng “Ghi nhớ” ngày giờ). Muốn diễn giải thêm ý, hãy dùng AI hoặc tự bổ sung.'
    ]
  };
}

export function threeVersions(text, settings = {}) {
  const a = shorten(text).text;
  const b = makeFriendly(text).text;
  const c = makeFormal(text).text;
  const out = [
    '━━━━ PHIÊN BẢN 1 – NGẮN GỌN ━━━━',
    a,
    '',
    '━━━━ PHIÊN BẢN 2 – THÂN THIỆN ━━━━',
    b,
    '',
    '━━━━ PHIÊN BẢN 3 – TRANG TRỌNG ━━━━',
    c
  ].join('\n');
  return { text: out, notes: ['Ba phiên bản được tạo theo quy tắc (rút gọn / thân thiện / trang trọng). Chọn bản phù hợp, xóa hai bản còn lại trước khi sao chép.'] };
}

export function applyEditAction(action, text, settings = {}, variant = 0) {
  // Mọi thao tác (trừ chính "Sửa lỗi chính tả") đều sửa lỗi cơ bản trước.
  const src = action === 'sua-chinh-ta' ? String(text || '') : fixSpelling(String(text || '')).text;
  switch (action) {
    case 'sua-chinh-ta': return fixSpelling(src);
    case 'than-thien': return makeFriendly(src, variant);
    case 'rut-gon': return shorten(src);
    case 'mo-rong': return expand(src, variant);
    case 'trang-trong': return makeFormal(src);
    case 'ro-rang': return clarify(src);
    case 'zalo': return toZalo(src, settings, variant);
    case 'thong-bao': return toOfficialNotice(src, settings);
    case 'hanh-chinh': return toAdministrative(src, settings);
    case 'ba-phien-ban': return threeVersions(src, settings);
    default: return { text: src, notes: [] };
  }
}
