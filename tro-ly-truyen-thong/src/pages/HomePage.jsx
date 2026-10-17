// Trang chủ: lối tắt tới các chức năng + trạng thái AI + hướng dẫn nhanh.
import { MODULES } from '../lib/catalog.js';

export default function HomePage({ go, aiStatus, prefs, settings, historyCount }) {
  const hasSettings = Object.values(settings).some((v) => v);
  const usingAI = aiStatus.connected && prefs.useAI;
  return (
    <div className="space-y-6">
      <div className={`card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${usingAI ? 'ring-green-200' : 'ring-amber-200'}`}>
        <p className="text-[15px] text-slate-700">
          {aiStatus.loading
            ? 'Đang kiểm tra kết nối AI…'
            : usingAI
              ? '✨ AI đã được kết nối. Nội dung sẽ được AI soạn dựa trên thông tin bạn nhập.'
              : '📋 AI chưa được kết nối (hoặc đang tắt). Mọi chức năng vẫn dùng được ở chế độ soạn theo mẫu có sẵn — kết quả được ghi rõ “Soạn theo mẫu”.'}
        </p>
        <button className="btn-ghost shrink-0" onClick={() => go('thiet-lap')}>Xem kết nối</button>
      </div>

      {!hasSettings && (
        <div className="card flex flex-col gap-3 bg-sky-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-slate-700">👋 Bắt đầu bằng việc nhập tên trường, tên lớp, tên giáo viên để các biểu mẫu tự điền sẵn.</p>
          <button className="btn-primary shrink-0" onClick={() => go('thiet-lap')}>⚙️ Thiết lập thông tin</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <button key={m.id} onClick={() => go(m.id)} className="card group flex items-start gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${m.color}`} aria-hidden="true">{m.icon}</span>
            <span>
              <span className="block text-base font-bold text-slate-800 group-hover:text-sky-700">{m.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">{m.desc}</span>
            </span>
          </button>
        ))}
        <button onClick={() => go('bien-tap')} className="card group flex items-start gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-2xl" aria-hidden="true">🪄</span>
          <span>
            <span className="block text-base font-bold text-slate-800 group-hover:text-sky-700">Biên tập nội dung</span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">Sửa chính tả, rút gọn, đổi giọng văn, chuyển thành tin Zalo hay thông báo chính thức.</span>
          </span>
        </button>
        <button onClick={() => go('lich-su')} className="card group flex items-start gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vang text-2xl" aria-hidden="true">🕘</span>
          <span>
            <span className="block text-base font-bold text-slate-800 group-hover:text-sky-700">Lịch sử nội dung</span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{historyCount ? `${historyCount} nội dung đã lưu trên máy này.` : 'Xem lại, sao chép các nội dung đã soạn.'}</span>
          </span>
        </button>
      </div>

      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">Cách dùng nhanh</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] text-slate-700">
          <li>Chọn loại nội dung cần soạn (thông báo, tin nhắn, thư mời…).</li>
          <li>Điền thông tin — hoặc bấm <strong>“Điền dữ liệu mẫu”</strong> để thử ngay.</li>
          <li>Bấm <strong>“Soạn nội dung”</strong>, đọc lại, bấm vào chữ để sửa trực tiếp.</li>
          <li>Sao chép gửi Zalo/Facebook, tải tệp .txt hoặc in.</li>
        </ol>
        <p className="mt-3 text-sm text-slate-500">Lưu ý: không nhập thông tin cá nhân nhạy cảm của trẻ (họ tên đầy đủ, bệnh lý, hoàn cảnh gia đình…).</p>
      </section>
    </div>
  );
}
