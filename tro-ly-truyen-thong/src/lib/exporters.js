// Sao chép, tải tệp .txt và in nội dung.
import { slugify } from './text.js';

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* thử cách dự phòng */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Khi mở trên claude.ai (Artifact), trang không được tự tải tệp hay mở hộp thoại in:
// tệp phải đi qua khả năng "downloads" (người dùng xác nhận lưu).
export const inClaude = () => typeof window !== 'undefined' && Boolean(window.claude?.use);

let downloadsPromise = null;
function getDownloads() {
  if (!downloadsPromise) downloadsPromise = inClaude() ? Promise.resolve(window.claude.use('downloads')).catch(() => null) : Promise.resolve(null);
  return downloadsPromise;
}

function fileName(title, ext) {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${slugify(title)}-${stamp}.${ext}`;
}

// Trả về { ok, name, message }
async function saveViaClaude(name, data) {
  const downloads = await getDownloads();
  if (!downloads) return { ok: false, message: 'Trang này chưa được phép lưu tệp. Hãy dùng nút Sao chép rồi dán vào Word hoặc Notepad.' };
  try {
    await downloads.save({ filename: name, data });
    return { ok: true, name };
  } catch (e) {
    if (e?.code === 'declined') return { ok: false, message: 'Bạn đã hủy lưu tệp.' };
    if (e?.code === 'rate_limited') return { ok: false, message: 'Đang có một hộp lưu tệp mở. Hãy thử lại sau giây lát.' };
    return { ok: false, message: 'Không lưu được tệp. Hãy dùng nút Sao chép.' };
  }
}

export async function downloadTxt(text, title = 'noi-dung') {
  const name = fileName(title, 'txt');
  // Thêm BOM để Notepad trên Windows hiển thị đúng tiếng Việt; dùng CRLF cho Windows.
  const content = '\uFEFF' + text.replace(/\r?\n/g, '\r\n');
  if (inClaude()) return saveViaClaude(name, content);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { ok: true, name };
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function printableHtml(text, title, autoPrint) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 20mm 20mm 20mm 30mm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; max-width: 170mm; margin: 0 auto; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0; }
</style></head><body><pre>${escapeHtml(text)}</pre>${autoPrint ? '<script>window.onload=function(){window.print()}</scr' + 'ipt>' : ''}</body></html>`;
}

// Trên claude.ai không mở được hộp thoại in: lưu một tệp .html khổ A4,
// mở tệp đó trong trình duyệt là hộp thoại in tự hiện ra.
export async function printText(text, title = 'Nội dung') {
  if (inClaude()) {
    const r = await saveViaClaude(fileName(title, 'html').replace(/\.html$/, '-ban-in.html'), printableHtml(text, title, true));
    return r.ok ? { ...r, message: `Đã lưu ${r.name}. Mở tệp này, hộp thoại in sẽ tự hiện ra.` } : r;
  }
  printInFrame(text, title);
  return { ok: true };
}

// In bằng iframe ẩn để không bị trình duyệt chặn cửa sổ bật lên.
function printInFrame(text, title) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(printableHtml(text, title, false));
  doc.close();
  const done = () => setTimeout(() => iframe.remove(), 1000);
  iframe.contentWindow.onafterprint = done;
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(done, 60000);
  }, 50);
}

// Lưu một tệp bất kỳ (chuỗi hoặc Blob). Trên claude.ai đi qua hộp xác nhận lưu tệp.
export async function saveFile(name, data, mime = 'application/octet-stream') {
  if (inClaude()) return saveViaClaude(name, data);
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { ok: true, name };
}

// Xuất hình minh họa SVG (đang hiển thị trên trang) thành tệp .png hoặc .svg — không cần mạng.
export async function saveIllustration(svgEl, title, format = 'png') {
  if (!svgEl) return { ok: false, message: 'Không tìm thấy hình để lưu.' };
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const vb = (clone.getAttribute('viewBox') || '0 0 320 200').split(/\s+/).map(Number);
  const svgText = new XMLSerializer().serializeToString(clone);
  if (format === 'svg') return saveFile(fileName(title, 'svg'), svgText, 'image/svg+xml');
  const scale = 1600 / vb[2];
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(vb[2] * scale);
  canvas.height = Math.round(vb[3] * scale);
  const img = new Image();
  const loaded = new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
  try {
    await loaded;
  } catch {
    return { ok: false, message: 'Không chuyển được hình sang PNG. Hãy thử lưu dạng SVG.' };
  }
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return { ok: false, message: 'Không tạo được tệp PNG.' };
  return saveFile(fileName(title, 'png'), blob, 'image/png');
}
