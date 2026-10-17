// Lịch sử nội dung đã soạn (lưu trên trình duyệt của máy này).
import { useMemo, useState } from 'react';
import { HISTORY_TYPES, labelOf } from '../lib/catalog.js';
import { copyText } from '../lib/exporters.js';
import { useUI } from '../components/UI.jsx';
import { removeDiacritics } from '../lib/text.js';
import { ModuleIcon } from '../illustrations/icons.jsx';

function fmt(ts) {
  try {
    return new Date(ts).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

const norm = (s) => removeDiacritics(String(s || '')).toLowerCase();

export default function HistoryPage({ history, onOpen, onDelete, onDeleteAll, onUpdate, storageOK, storageMode }) {
  const { toast, confirm } = useUI();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return history.filter((h) => (!type || h.type === type) && (!nq || norm(h.title + ' ' + h.text).includes(nq)));
  }, [history, q, type]);

  const counts = useMemo(() => {
    const c = {};
    for (const h of history) c[h.type] = (c[h.type] || 0) + 1;
    return c;
  }, [history]);

  async function del(h) {
    const ok = await confirm({ title: 'Xóa nội dung này?', message: `“${h.title}” sẽ bị xóa khỏi lịch sử và không thể khôi phục.`, confirmText: 'Xóa' });
    if (ok) {
      onDelete(h.id);
      toast('Đã xóa khỏi lịch sử.');
    }
  }

  async function delAll() {
    const ok = await confirm({ title: 'Xóa toàn bộ lịch sử?', message: `Tất cả ${history.length} nội dung đã lưu trên máy này sẽ bị xóa và không thể khôi phục.`, confirmText: 'Xóa tất cả' });
    if (ok) {
      onDeleteAll();
      toast('Đã xóa toàn bộ lịch sử.');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800 sm:text-2xl"><ModuleIcon id="lich-su" className="h-14 w-14 shrink-0" /> Lịch sử nội dung</h2>
          <p className="mt-1 text-[15px] text-slate-600">Các nội dung đã soạn được tự lưu để xem lại, chỉnh sửa, sao chép.</p>
        </div>
        {history.length > 0 && <button className="btn-danger" onClick={delAll}>🗑️ Xóa tất cả</button>}
      </div>

      <div className="rounded-xl bg-vang/50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
        {storageMode === 'cloud'
          ? 'Lịch sử được lưu trong vùng riêng của tài khoản Claude của bạn (tối đa 300 mục gần nhất): mở trang này trên máy khác bằng cùng tài khoản vẫn thấy. Người khác, kể cả người chia sẻ trang, không xem được.'
          : storageMode === 'checking'
            ? 'Đang tải lịch sử từ tài khoản Claude…'
            : storageOK
          ? 'Lịch sử chỉ được lưu trong trình duyệt của máy này (tối đa 300 mục gần nhất), không lưu trên máy chủ và không đồng bộ giữa các thiết bị. Xóa dữ liệu trình duyệt sẽ làm mất lịch sử — hãy tải .txt những nội dung quan trọng.'
          : 'Trình duyệt đang chặn lưu trữ (có thể do chế độ ẩn danh). Lịch sử chỉ tồn tại đến khi bạn đóng trang.'}
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row">
        <label className="sr-only" htmlFor="h-search">Tìm kiếm</label>
        <input id="h-search" className="input sm:flex-1" placeholder="🔍 Tìm theo tiêu đề hoặc nội dung…" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="sr-only" htmlFor="h-type">Loại nội dung</label>
        <select id="h-type" className="input sm:w-60" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại ({history.length})</option>
          {HISTORY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label} ({counts[t.value] || 0})</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl" aria-hidden="true">📭</div>
          <p className="mt-2">{history.length ? 'Không tìm thấy nội dung phù hợp.' : 'Chưa có nội dung nào. Hãy soạn thử một thông báo hoặc tin nhắn!'}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((h) => (
            <li key={h.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-sky-100 px-2.5 py-1 font-semibold text-sky-800">{labelOf(HISTORY_TYPES, h.type) || 'Khác'}</span>
                <span className={`rounded-full px-2.5 py-1 font-semibold ${h.source === 'ai' ? 'bg-la text-green-900' : 'bg-vang text-amber-900'}`}>
                  {h.source === 'ai' ? 'AI' : 'Theo mẫu'}
                </span>
                <span className="text-slate-500">{fmt(h.updatedAt || h.createdAt)}</span>
              </div>
              <h3 className="mt-2 font-semibold text-slate-800">{h.title}</h3>
              {editingId === h.id ? (
                <textarea className="input output-text mt-2 min-h-[200px]" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Chỉnh sửa nội dung" />
              ) : (
                <p className="output-text mt-1 line-clamp-3 text-[15px] text-slate-600">{h.text}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {editingId === h.id ? (
                  <>
                    <button className="btn-primary" onClick={() => { onUpdate(h.id, { text: draft }); setEditingId(null); toast('Đã lưu thay đổi.'); }}>💾 Lưu</button>
                    <button className="btn-ghost" onClick={() => setEditingId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="btn-soft" onClick={() => onOpen(h)}>📂 Mở lại</button>
                    <button className="btn-ghost" onClick={() => { setEditingId(h.id); setDraft(h.text); }}>✏️ Chỉnh sửa</button>
                    <button className="btn-ghost" onClick={async () => toast((await copyText(h.text)) ? 'Đã sao chép.' : 'Không sao chép được.', 'ok')}>📋 Sao chép</button>
                    <button className="btn-danger" onClick={() => del(h)}>🗑️ Xóa</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
