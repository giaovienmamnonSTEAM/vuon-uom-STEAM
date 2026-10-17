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

export function downloadTxt(text, title = 'noi-dung') {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const name = `${slugify(title)}-${stamp}.txt`;
  // Thêm BOM để Notepad trên Windows hiển thị đúng tiếng Việt; dùng CRLF cho Windows.
  const blob = new Blob(['﻿' + text.replace(/\r?\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return name;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// In bằng iframe ẩn để không bị trình duyệt chặn cửa sổ bật lên.
export function printText(text, title = 'Nội dung') {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 20mm 20mm 20mm 30mm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0; }
</style></head><body><pre>${escapeHtml(text)}</pre></body></html>`);
  doc.close();
  const done = () => setTimeout(() => iframe.remove(), 1000);
  iframe.contentWindow.onafterprint = done;
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(done, 60000);
  }, 50);
}
