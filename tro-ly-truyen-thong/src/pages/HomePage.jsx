// Trang chủ: lối tắt tới các chức năng + trạng thái AI + hướng dẫn nhanh.
import { MODULES } from '../lib/catalog.js';
import { ModuleIcon } from '../illustrations/icons.jsx';

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
        {[
          ...MODULES.map((m) => ({ id: m.id, title: m.title, desc: m.desc, tint: m.color })),
          { id: 'bien-tap', title: 'Biên tập nội dung', desc: 'Sửa chính tả, rút gọn, mở rộng, đổi giọng văn, chuyển thành tin Zalo hay thông báo.', tint: 'bg-sky-100' },
          { id: 'lich-su', title: 'Lịch sử nội dung', desc: historyCount ? `${historyCount} nội dung đã lưu.` : 'Xem lại, sao chép các nội dung đã soạn.', tint: 'bg-vang' },
          { id: 'thu-vien-hinh', title: 'Thư viện hình minh họa', desc: 'Hình vẽ dễ thương theo chủ đề trường lớp, gia đình, lễ hội, STEAM… để kèm bài đăng.', tint: 'bg-dao' },
          { id: 'thiet-lap', title: 'Thiết lập thông tin', desc: 'Tên trường, lớp, giáo viên… để các biểu mẫu và AI dùng lại.', tint: 'bg-la' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            className="card group flex items-center gap-4 overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2"
          >
            <ModuleIcon id={c.id} className="h-20 w-20 shrink-0 transition group-hover:scale-105" />
            <span className="min-w-0">
              <span className="block text-base font-bold text-slate-800 group-hover:text-sky-700">{c.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">{c.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">Cách dùng nhanh</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] text-slate-700">
          <li>Chọn loại nội dung cần soạn (thông báo, tin nhắn, thư mời…).</li>
          <li>Điền thông tin — hoặc bấm <strong>“Điền dữ liệu mẫu”</strong> để thử ngay.</li>
          <li>Bấm <strong>“{usingAI ? 'Tạo nội dung bằng AI' : 'Soạn nội dung theo mẫu'}”</strong>, đọc lại, bấm vào chữ để sửa trực tiếp; chọn hình minh họa gợi ý nếu cần.</li>
          <li>Sao chép gửi Zalo/Facebook, tải tệp .txt hoặc in.</li>
        </ol>
        <p className="mt-3 text-sm text-slate-500">Lưu ý: không nhập thông tin cá nhân nhạy cảm của trẻ (họ tên đầy đủ, bệnh lý, hoàn cảnh gia đình…).</p>
      </section>
    </div>
  );
}
