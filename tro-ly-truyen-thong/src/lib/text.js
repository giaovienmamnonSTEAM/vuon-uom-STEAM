// Tiện ích xử lý văn bản dùng chung cho các bộ soạn theo mẫu.

export const t = (v) => (typeof v === 'string' ? v.trim() : '');

// Chọn một phương án theo số phiên bản (để nút "Tạo phiên bản mới" ra câu chữ khác).
export function pick(arr, variant = 0) {
  if (!arr.length) return '';
  return arr[((variant % arr.length) + arr.length) % arr.length];
}

// Ghép các khối, bỏ khối rỗng, mỗi khối cách nhau một dòng trống.
export function blocks(...parts) {
  return parts
    .flat()
    .map((p) => (typeof p === 'string' ? p.replace(/\s+$/g, '') : ''))
    .filter((p) => p.trim() !== '')
    .join('\n\n');
}

// Ghép các dòng, bỏ dòng rỗng.
export function lines(...parts) {
  return parts
    .flat()
    .filter((p) => typeof p === 'string' && p.trim() !== '')
    .join('\n');
}

// Tách nội dung giáo viên nhập thành các ý (theo xuống dòng hoặc dấu chấm phẩy).
export function splitItems(text) {
  return t(text)
    .split(/\n|;/)
    .map((s) => s.replace(/^\s*([-–•+*]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

// Viết hoa chữ cái đầu, thêm dấu chấm cuối nếu thiếu.
export function sentence(s) {
  let x = t(s);
  if (!x) return '';
  x = x.charAt(0).toLocaleUpperCase('vi') + x.slice(1);
  if (!/[.!?…:]$/.test(x)) x += '.';
  return x;
}

export function lowerFirst(s) {
  const x = t(s);
  if (!x) return '';
  // Giữ nguyên nếu là tên riêng / chữ viết tắt (2 chữ hoa liền nhau)
  if (/^[A-ZÀ-Ỹ]{2}/.test(x)) return x;
  return x.charAt(0).toLocaleLowerCase('vi') + x.slice(1);
}

// Danh sách gạch đầu dòng.
export function bulletList(text, mark = '-') {
  const items = splitItems(text);
  return items.map((i) => `${mark} ${sentence(i)}`).join('\n');
}

export function upper(s) {
  return t(s).toLocaleUpperCase('vi');
}

export function removeDiacritics(s) {
  return t(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function hashtag(s) {
  const words = removeDiacritics(s)
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return '';
  return '#' + words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function slugify(s) {
  return (
    removeDiacritics(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'noi-dung'
  );
}

// Chỗ trống để giáo viên tự điền (dùng khi thiếu thông tin quan trọng, KHÔNG tự bịa).
export function blank(label) {
  return `[CẦN BỔ SUNG: ${label}]`;
}

// Tạo bộ thu thập "thông tin còn thiếu" cho mỗi lần soạn.
export function missingCollector() {
  const missing = [];
  return {
    missing,
    need(value, label) {
      const v = t(value);
      if (v) return v;
      missing.push(label);
      return blank(label);
    }
  };
}

// Tên lớp: tránh lặp chữ "Lớp lớp".
export function lopName(v) {
  const x = t(v);
  if (!x) return '';
  return /^l[ớo]p\s/i.test(x) ? x.replace(/^l[ớo]p\s+/i, '') : x;
}

export function firstLine(s, max = 80) {
  const x = t(s).split('\n')[0] || '';
  return x.length > max ? x.slice(0, max - 1) + '…' : x;
}
