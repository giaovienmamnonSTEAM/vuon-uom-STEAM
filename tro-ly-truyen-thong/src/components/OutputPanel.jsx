// Khung kết quả: xem, chỉnh sửa trực tiếp, sao chép, tải .txt, in, rút gọn, tạo phiên bản mới, xóa.
import { useEffect, useRef, useState } from 'react';
import { copyText, downloadTxt, printText, inClaude } from '../lib/exporters.js';
import { Spinner, useUI } from './UI.jsx';
import { EmptyArt, LoadingArt, SuccessArt } from '../illustrations/icons.jsx';

// Các kiểu viết lại nhanh: áp lên văn bản đang có (không soạn lại từ đầu).
const QUICK_REWRITES = [
  { value: 'than-thien', label: '😊 Thân thiện hơn' },
  { value: 'trang-trong', label: '🎩 Trang trọng hơn' },
  { value: 'mo-rong', label: '➕ Mở rộng' },
  { value: 'ro-rang', label: '💡 Rõ ràng hơn' },
  { value: 'sua-chinh-ta', label: '✔️ Sửa chính tả' },
  { value: 'zalo', label: '📱 Thành tin Zalo' }
];

export default function OutputPanel({ output, onTextChange, onClear, onRegenerate, onShorten, onRewrite, busy, emptyHint, usingAI }) {
  const { toast, confirm } = useUI();
  const [editing, setEditing] = useState(false);
  const [rewriteOpen, setRewriteOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const taRef = useRef(null);
  const text = output?.text || '';
  const has = text.trim().length > 0;
  const missingCount = (text.match(/\[CẦN BỔ SUNG/g) || []).length;

  // Hiện biểu tượng "Đã xong" vài giây sau mỗi lần soạn / viết lại thành công
  const [done, setDone] = useState(false);
  const prev = useRef({ busy, text });
  useEffect(() => {
    const was = prev.current;
    prev.current = { busy, text };
    if (was.busy && !busy && text && text !== was.text) {
      setDone(true);
      const t = setTimeout(() => setDone(false), 4000);
      return () => clearTimeout(t);
    }
  }, [busy, text]);
  const loadingText = 'Cô đang chuẩn bị nội dung cho bạn...';

  useEffect(() => {
    if (editing && taRef.current) {
      const el = taRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  // Tự giãn chiều cao ô soạn thảo theo nội dung
  useEffect(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(el.scrollHeight, 280) + 'px';
    }
  }, [text, editing]);

  const handleCopy = async () => {
    const ok = await copyText(text);
    toast(ok ? 'Đã sao chép toàn bộ nội dung.' : 'Trình duyệt không cho sao chép tự động. Hãy bôi đen và nhấn Ctrl+C.', ok ? 'ok' : 'error');
  };

  const handleClear = async () => {
    const ok = await confirm({
      title: 'Xóa nội dung?',
      message: 'Nội dung trong khung kết quả sẽ bị xóa. Bản đã lưu trong mục Lịch sử (nếu có) vẫn được giữ lại.',
      confirmText: 'Xóa nội dung'
    });
    if (ok) {
      setEditing(false);
      onClear();
      toast('Đã xóa nội dung trong khung.');
    }
  };

  const handleDownload = async () => {
    const r = await downloadTxt(text, output?.title || 'noi-dung');
    toast(r.ok ? `Đã lưu tệp ${r.name}` : r.message, r.ok ? 'ok' : 'error');
  };

  const handlePrint = async () => {
    const r = await printText(text, output?.title || 'Nội dung');
    if (r.message) toast(r.message, r.ok ? 'info' : 'error');
  };

  if (!has && !busy) {
    return (
      <div className="card flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">
        <EmptyArt className="art w-44" />
        <p className="max-w-sm text-[15px]">{emptyHint || 'Nội dung sẽ hiển thị ở đây sau khi bạn bấm nút soạn.'}</p>
      </div>
    );
  }

  if (!has && busy) {
    return (
      <div className="card flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center" role="status" aria-live="polite">
        <LoadingArt className="art w-48" />
        <p className="flex items-center gap-2 text-[15px] font-semibold text-sky-800"><Spinner /> {loadingText}</p>
        {usingAI && <p className="text-sm text-slate-500">AI thường cần 10–60 giây.</p>}
      </div>
    );
  }

  return (
    <section className="card overflow-hidden" aria-label="Kết quả">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-sky-50/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {done && <SuccessArt className="pop-in h-8 w-8 shrink-0" />}
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-800">{done ? 'Đã xong! Nội dung của bạn đây' : 'Kết quả'}</h2>
            {output?.title && <p className="truncate text-sm text-slate-500" title={output.title}>{output.title}</p>}
          </div>
        </div>
        {output?.source && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${output.source === 'ai' ? 'bg-la text-green-900' : 'bg-vang text-amber-900'}`}>
            {output.source === 'ai' ? '✨ Soạn bằng AI' : '📋 Soạn theo mẫu (không dùng AI)'}
          </span>
        )}
      </div>

      <div className="relative">
        {busy && (
          <div className="flex items-center gap-3 border-b border-sky-100 bg-vang/40 px-4 py-2" role="status" aria-live="polite">
            <LoadingArt className="art w-16 shrink-0" />
            <p className="flex items-center gap-2 text-sm font-semibold text-sky-800">
              <Spinner /> {loadingText} {usingAI && <span className="font-normal text-slate-500">(nội dung cũ vẫn giữ bên dưới)</span>}
            </p>
          </div>
        )}
        {editing ? (
          <textarea
            ref={taRef}
            className="output-text block w-full resize-none border-0 bg-white px-4 py-4 text-[15px] leading-7 text-slate-800 focus:ring-2 focus:ring-inset focus:ring-sky-300"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            aria-label="Chỉnh sửa nội dung"
          />
        ) : (
          <div
            className="output-text min-h-[280px] cursor-text px-4 py-4 text-[15px] leading-7 text-slate-800"
            onClick={() => has && setEditing(true)}
            title="Bấm để chỉnh sửa"
          >
            {text}
          </div>
        )}
      </div>

      {missingCount > 0 && (
        <p className="border-t border-sky-100 bg-dao/40 px-4 py-2 text-sm font-medium text-orange-900">
          ✍️ Còn {missingCount} chỗ đánh dấu [CẦN BỔ SUNG] — hãy điền trước khi gửi.
        </p>
      )}

      {output?.notes?.length > 0 && (
        <ul className="space-y-1 border-t border-sky-100 bg-kem px-4 py-3 text-sm text-slate-600">
          {output.notes.map((n, i) => (
            <li key={i}>💡 {n}</li>
          ))}
        </ul>
      )}

      {onRewrite && rewriteOpen && has && (
        <div className="space-y-3 border-t border-sky-100 bg-sky-50/60 p-4">
          <p className="text-sm font-semibold text-slate-700">Viết lại văn bản đang có (giữ nguyên ngày giờ, dữ kiện):</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REWRITES.map((r) => (
              <button key={r.value} className="btn-ghost" disabled={!!busy} onClick={() => onRewrite(r.value)}>
                {r.label}
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="rewrite-instruction" className="label">Yêu cầu riêng {usingAI ? '' : '(cần AI)'}</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="rewrite-instruction"
                className="input sm:flex-1"
                maxLength={500}
                value={instruction}
                disabled={!usingAI}
                placeholder={usingAI ? 'VD: thêm câu nhắc bố mẹ mang áo mưa cho con; bỏ đoạn cuối' : 'Kết nối AI để ghi yêu cầu riêng'}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <button
                className="btn-primary"
                disabled={!usingAI || !instruction.trim() || !!busy}
                onClick={() => onRewrite('tuy-chinh', instruction.trim())}
              >
                {busy === 'rewrite' ? <Spinner /> : '✨'} Viết lại theo yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-sky-100 p-3 [&>button]:grow [&>button]:basis-[8rem] [&>button]:whitespace-nowrap">
        <button className="btn-primary" onClick={handleCopy} disabled={!has || !!busy}>📋 Sao chép</button>
        <button className="btn-soft" onClick={() => setEditing((v) => !v)} disabled={!has || !!busy} aria-pressed={editing}>
          {editing ? '✅ Xong' : '✏️ Chỉnh sửa'}
        </button>
        <button className="btn-soft" onClick={onShorten} disabled={!has || !!busy}>
          {busy === 'shorten' ? <Spinner /> : '✂️'} Rút gọn
        </button>
        <button className="btn-soft" onClick={onRegenerate} disabled={!!busy} title="Soạn lại một phiên bản mới từ thông tin đã nhập">
          {busy === 'regen' ? <Spinner /> : '🔄'} Tạo mới
        </button>
        {onRewrite && (
          <button className="btn-soft !basis-full" onClick={() => setRewriteOpen((v) => !v)} disabled={!has || !!busy} aria-expanded={rewriteOpen}>
            {busy === 'rewrite' ? <Spinner /> : '🪄'} Viết lại {rewriteOpen ? '▴' : '▾'}
          </button>
        )}
        <button className="btn-ghost" onClick={handleDownload} disabled={!has || !!busy}>⬇️ Tải .txt</button>
        <button className="btn-ghost" onClick={handlePrint} title={inClaude() ? 'Lưu bản in khổ A4 (.html) để mở và in' : 'In nội dung'} disabled={!has || !!busy}>🖨️ In</button>
        <button className="btn-danger" onClick={handleClear} disabled={!has || !!busy}>🗑️ Xóa nội dung</button>
      </div>
    </section>
  );
}
