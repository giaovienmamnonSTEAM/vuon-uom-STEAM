// Khung kết quả: xem, chỉnh sửa trực tiếp, sao chép, tải .txt, in, rút gọn, tạo phiên bản mới, xóa.
import { useEffect, useRef, useState } from 'react';
import { copyText, downloadTxt, printText } from '../lib/exporters.js';
import { Spinner, useUI } from './UI.jsx';

export default function OutputPanel({ output, onTextChange, onClear, onRegenerate, onShorten, busy, emptyHint }) {
  const { toast, confirm } = useUI();
  const [editing, setEditing] = useState(false);
  const taRef = useRef(null);
  const text = output?.text || '';
  const has = text.trim().length > 0;

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

  const handleDownload = () => {
    const name = downloadTxt(text, output?.title || 'noi-dung');
    toast(`Đã tải xuống tệp ${name}`);
  };

  if (!has && !busy) {
    return (
      <div className="card flex min-h-[220px] flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
        <div className="text-4xl" aria-hidden="true">📝</div>
        <p className="max-w-sm text-[15px]">{emptyHint || 'Nội dung sẽ hiển thị ở đây sau khi bạn bấm nút soạn.'}</p>
      </div>
    );
  }

  return (
    <section className="card overflow-hidden" aria-label="Kết quả">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-sky-50/60 px-4 py-3">
        <h2 className="text-base font-bold text-slate-800">Kết quả</h2>
        {output?.source && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${output.source === 'ai' ? 'bg-la text-green-900' : 'bg-vang text-amber-900'}`}>
            {output.source === 'ai' ? '✨ Soạn bằng AI' : '📋 Soạn theo mẫu (không dùng AI)'}
          </span>
        )}
      </div>

      <div className="relative">
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-white/70 text-[15px] font-medium text-sky-800">
            <Spinner /> Đang soạn nội dung…
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

      {output?.notes?.length > 0 && (
        <ul className="space-y-1 border-t border-sky-100 bg-kem px-4 py-3 text-sm text-slate-600">
          {output.notes.map((n, i) => (
            <li key={i}>💡 {n}</li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-2 border-t border-sky-100 p-3 sm:grid-cols-4">
        <button className="btn-primary" onClick={handleCopy} disabled={!has || !!busy}>📋 Sao chép</button>
        <button className="btn-soft" onClick={() => setEditing((v) => !v)} disabled={!has || !!busy} aria-pressed={editing}>
          {editing ? '✅ Xong' : '✏️ Chỉnh sửa'}
        </button>
        <button className="btn-soft" onClick={onShorten} disabled={!has || !!busy}>
          {busy === 'shorten' ? <Spinner /> : '✂️'} Rút gọn
        </button>
        <button className="btn-soft" onClick={onRegenerate} disabled={!!busy}>
          {busy === 'regen' ? <Spinner /> : '🔄'} Phiên bản mới
        </button>
        <button className="btn-ghost" onClick={handleDownload} disabled={!has || !!busy}>⬇️ Tải .txt</button>
        <button className="btn-ghost" onClick={() => printText(text, output?.title)} disabled={!has || !!busy}>🖨️ In</button>
        <button className="btn-danger col-span-2" onClick={handleClear} disabled={!has || !!busy}>🗑️ Xóa nội dung</button>
      </div>
    </section>
  );
}
