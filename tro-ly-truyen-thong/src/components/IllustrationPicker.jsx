// Khu vực "Hình minh họa gợi ý" dưới kết quả: xem trước, đổi hình, chọn theo chủ đề, lưu PNG/SVG.
// Hình lấy từ thư viện vẽ sẵn trong ứng dụng (không phải ảnh AI tạo, không tải từ mạng).
import { useMemo, useRef, useState } from 'react';
import { GROUPS, SCENES, SceneArt, getScene } from '../illustrations/scenes.jsx';
import { suggestScenes } from '../illustrations/suggest.js';
import { saveIllustration } from '../lib/exporters.js';
import { Spinner, useUI } from './UI.jsx';

export default function IllustrationPicker({ moduleId, data, text, selected, onSelect }) {
  const { toast } = useUI();
  const [group, setGroup] = useState('goi-y');
  const [saving, setSaving] = useState(null);
  const previewRef = useRef(null);
  const suggestions = useMemo(() => suggestScenes(moduleId, data, text, 4), [moduleId, data, text]);
  const current = getScene(selected) ? selected : suggestions[0];
  const list = group === 'goi-y' ? suggestions : SCENES.filter((s) => s.group === group).map((s) => s.id);
  const scene = getScene(current);

  async function save(format) {
    setSaving(format);
    const r = await saveIllustration(previewRef.current, `hinh-${scene.id}`, format);
    setSaving(null);
    if (r.ok) toast(`Đã lưu hình ${r.name}`);
    else toast(r.message, 'error');
  }

  return (
    <section className="card overflow-hidden" aria-labelledby={`illu-${moduleId}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-la/40 px-4 py-3">
        <h3 id={`illu-${moduleId}`} className="text-base font-bold text-slate-800">🎨 Hình minh họa gợi ý</h3>
        <label className="sr-only" htmlFor={`illu-group-${moduleId}`}>Chủ đề minh họa</label>
        <select id={`illu-group-${moduleId}`} className="input w-auto py-1.5 text-sm" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="goi-y">Gợi ý theo nội dung</option>
          {GROUPS.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-3 p-4">
        <figure className="min-w-0">
          <div className="art overflow-hidden rounded-2xl ring-1 ring-sky-100">
            <SceneArt id={current} svgRef={previewRef} />
          </div>
          <figcaption className="mt-2 text-sm font-medium text-slate-700">{scene.title}</figcaption>
        </figure>
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-semibold text-slate-600">{group === 'goi-y' ? 'Hình phù hợp với nội dung — bấm để đổi:' : 'Chọn hình trong chủ đề này:'}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {list.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                aria-pressed={id === current}
                title={getScene(id).title}
                className={`art overflow-hidden rounded-xl ring-2 transition ${id === current ? 'ring-sky-500' : 'ring-transparent hover:ring-sky-200'}`}
              >
                <SceneArt id={id} />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-soft" disabled={!!saving} onClick={() => save('png')}>
              {saving === 'png' ? <Spinner /> : '🖼️'} Lưu hình PNG
            </button>
            <button type="button" className="btn-ghost" disabled={!!saving} onClick={() => save('svg')}>
              {saving === 'svg' ? <Spinner /> : '✒️'} Lưu SVG
            </button>
          </div>
        </div>
      </div>
      <p className="border-t border-sky-100 bg-kem px-4 py-2 text-xs text-slate-500">
        Hình lấy từ thư viện minh họa vẽ sẵn của ứng dụng (không phải ảnh do AI tạo), dùng kèm bài đăng Zalo, Facebook hoặc chèn vào Word, Canva.
      </p>
    </section>
  );
}
