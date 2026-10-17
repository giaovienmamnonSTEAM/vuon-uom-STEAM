// Thư viện hình minh họa theo nhóm — xem, lưu PNG/SVG để dùng cho bài truyền thông.
import { useRef, useState } from 'react';
import { GROUPS, SCENES, SceneArt, getScene } from '../illustrations/scenes.jsx';
import { saveIllustration } from '../lib/exporters.js';
import { Spinner, useUI } from '../components/UI.jsx';
import { ModuleIcon } from '../illustrations/icons.jsx';

export default function LibraryPage() {
  const { toast } = useUI();
  const [group, setGroup] = useState('');
  const [open, setOpen] = useState(null);
  const [saving, setSaving] = useState(null);
  const previewRef = useRef(null);
  const list = SCENES.filter((s) => !group || s.group === group);

  async function save(format) {
    setSaving(format);
    const r = await saveIllustration(previewRef.current, `hinh-${open}`, format);
    setSaving(null);
    toast(r.ok ? `Đã lưu hình ${r.name}` : r.message, r.ok ? 'ok' : 'error');
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800 sm:text-2xl"><ModuleIcon id="thu-vien-hinh" className="h-14 w-14 shrink-0" /> Thư viện hình minh họa</h2>
        <p className="mt-1 text-[15px] text-slate-600">
          {SCENES.length} hình vẽ sẵn cùng một phong cách, chia {GROUPS.length} nhóm. Bấm vào hình để xem lớn và lưu về máy. Hình có sẵn trong ứng dụng, xem được cả khi không có mạng.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo nhóm">
        {[{ value: '', label: 'Tất cả' }, ...GROUPS].map((g) => (
          <button
            key={g.value}
            type="button"
            aria-pressed={group === g.value}
            onClick={() => setGroup(g.value)}
            className={`min-h-[40px] rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition ${group === g.value ? 'bg-sky-500 text-white ring-sky-500' : 'bg-white text-slate-700 ring-slate-200 hover:bg-sky-50'}`}
          >
            {g.label} <span className="opacity-70">({g.value ? SCENES.filter((s) => s.group === g.value).length : SCENES.length})</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="card grid gap-4 p-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="art min-w-0 overflow-hidden rounded-2xl ring-1 ring-sky-100">
            <SceneArt id={open} svgRef={previewRef} />
          </div>
          <div className="min-w-0 space-y-3">
            <h3 className="text-lg font-bold text-slate-800">{getScene(open).title}</h3>
            <p className="text-sm text-slate-600">Nhóm: {GROUPS.find((g) => g.value === getScene(open).group)?.label}</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" disabled={!!saving} onClick={() => save('png')}>{saving === 'png' ? <Spinner /> : '🖼️'} Lưu hình PNG</button>
              <button className="btn-soft" disabled={!!saving} onClick={() => save('svg')}>{saving === 'svg' ? <Spinner /> : '✒️'} Lưu SVG</button>
              <button className="btn-ghost" onClick={() => setOpen(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                setOpen(s.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`card block w-full overflow-hidden p-2 text-left transition hover:-translate-y-0.5 hover:shadow-md ${open === s.id ? 'ring-2 ring-sky-400' : ''}`}
            >
              <span className="art block overflow-hidden rounded-xl"><SceneArt id={s.id} /></span>
              <span className="block px-1 pb-1 pt-2 text-sm font-semibold text-slate-700">{s.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
