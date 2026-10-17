// Thiết lập thông tin nhà trường + trạng thái kết nối AI.
import { useEffect, useState } from 'react';
import { useUI } from '../components/UI.jsx';
import { EMPTY_SETTINGS } from '../lib/storage.js';

const FIELDS = [
  { name: 'tenTruong', label: 'Tên trường', placeholder: 'VD: Trường Mầm non …' },
  { name: 'donViChuQuan', label: 'Đơn vị chủ quản', placeholder: 'VD: UBND xã … / Phòng GD&ĐT …' },
  { name: 'diaChi', label: 'Địa chỉ', placeholder: 'Địa chỉ trường' },
  { name: 'soDienThoai', label: 'Số điện thoại liên hệ (nếu cần)', placeholder: 'Số điện thoại của trường / lớp' },
  { name: 'tenGiaoVien', label: 'Tên giáo viên', placeholder: 'VD: Nguyễn Thị …' },
  { name: 'tenLop', label: 'Tên lớp', placeholder: 'VD: Mẫu giáo lớn A1' },
  { name: 'namHoc', label: 'Năm học', placeholder: 'VD: 2026 – 2027' }
];

export default function SettingsPage({ settings, onSave, onClear, prefs, onPrefs, aiStatus, onRecheck, storageOK }) {
  const { toast, confirm } = useUI();
  const [form, setForm] = useState(settings);
  const [code, setCode] = useState(prefs.accessCode || '');
  useEffect(() => setForm(settings), [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  async function clearAll() {
    const ok = await confirm({ title: 'Xóa thông tin đã lưu?', message: 'Thông tin nhà trường lưu trên máy này sẽ bị xóa. Lịch sử nội dung không bị ảnh hưởng.', confirmText: 'Xóa thông tin' });
    if (ok) {
      onClear();
      setForm(EMPTY_SETTINGS);
      toast('Đã xóa thông tin nhà trường.');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl"><span aria-hidden="true">⚙️</span> Thiết lập thông tin</h2>
        <p className="mt-1 text-[15px] text-slate-600">Nhập một lần, các biểu mẫu sẽ tự điền sẵn. Ô nào để trống thì nội dung soạn ra sẽ không có thông tin đó.</p>
      </div>

      <form
        className="card space-y-4 p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, (v || '').trim()]));
          const ok = onSave(clean);
          toast(ok ? 'Đã lưu thông tin trên máy này.' : 'Không lưu được: trình duyệt đang chặn lưu trữ. Thông tin chỉ dùng được đến khi đóng trang.', ok ? 'ok' : 'error');
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <label className="label" htmlFor={`st-${f.name}`}>{f.label}</label>
              <input id={`st-${f.name}`} className="input" value={form[f.name] || ''} placeholder={f.placeholder} maxLength={200} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-vang/50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          {storageOK
            ? '💾 Thông tin được lưu trong trình duyệt của máy đang dùng, không gửi lên máy chủ (trừ khi bạn soạn bằng AI: khi đó thông tin cần thiết được gửi kèm yêu cầu để AI soạn). Dữ liệu không đồng bộ giữa các thiết bị: dùng máy khác thì cần nhập lại.'
            : '⚠️ Trình duyệt đang chặn lưu trữ (có thể do chế độ ẩn danh), thông tin sẽ mất khi đóng trang.'}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn-primary" disabled={!dirty}>💾 Lưu thông tin</button>
          <button type="button" className="btn-danger" onClick={clearAll}>🗑️ Xóa thông tin đã lưu</button>
        </div>
      </form>

      <section className="card space-y-4 p-4 sm:p-6" aria-labelledby="ai-h">
        <h3 id="ai-h" className="text-lg font-bold text-slate-800">🤖 Kết nối AI</h3>
        <div className={`rounded-xl px-4 py-3 text-[15px] ring-1 ${aiStatus.connected ? 'bg-la/60 text-green-900 ring-green-200' : 'bg-dao/40 text-orange-900 ring-dao'}`}>
          {aiStatus.loading
            ? 'Đang kiểm tra kết nối…'
            : aiStatus.connected
              ? `Đã kết nối AI: ${aiStatus.provider || 'máy chủ AI'}. Nội dung soạn ra được đánh dấu “Soạn bằng AI”.`
              : `Chưa kết nối AI. ${aiStatus.reason || ''} Ứng dụng vẫn dùng đầy đủ được ở chế độ soạn theo mẫu (đánh dấu “Soạn theo mẫu”).`}
        </div>
        <label className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
          <input type="checkbox" className="h-5 w-5 rounded text-sky-500 focus:ring-sky-400" checked={prefs.useAI} onChange={(e) => onPrefs({ ...prefs, useAI: e.target.checked })} />
          Dùng AI khi đã kết nối (bỏ chọn để luôn soạn theo mẫu)
        </label>
        {aiStatus.needsCode && (
          <div>
            <label className="label" htmlFor="ai-code">Mã truy cập AI (do nhà trường cấp)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="ai-code" type="password" autoComplete="off" className="input sm:flex-1" value={code} onChange={(e) => setCode(e.target.value)} />
              <button className="btn-soft" onClick={() => { onPrefs({ ...prefs, accessCode: code.trim() }); toast('Đã lưu mã truy cập trên máy này.'); }}>Lưu mã</button>
            </div>
          </div>
        )}
        <button className="btn-ghost" onClick={onRecheck}>🔄 Kiểm tra lại kết nối</button>
        <details className="text-sm text-slate-600">
          <summary className="cursor-pointer font-semibold text-slate-700">Dành cho quản trị viên: cách bật AI</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Đưa ứng dụng lên Vercel (thư mục gốc dự án: <code>tro-ly-truyen-thong</code>).</li>
            <li>Vào Settings → Environment Variables, thêm <code>ANTHROPIC_API_KEY</code> (API key Claude của nhà trường).</li>
            <li>Tùy chọn: thêm <code>APP_ACCESS_CODE</code> để chỉ người có mã mới dùng được AI.</li>
            <li>Deploy lại, rồi bấm “Kiểm tra lại kết nối”.</li>
          </ol>
          <p className="mt-2">API key chỉ nằm trên máy chủ, không bao giờ được đưa vào mã nguồn trình duyệt.</p>
        </details>
      </section>
    </div>
  );
}
