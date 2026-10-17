// Trang dùng chung cho 6 chức năng soạn nội dung: biểu mẫu + khung kết quả.
import { useEffect, useRef, useState } from 'react';
import FormFields from '../components/FormFields.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import { Spinner, useUI } from '../components/UI.jsx';
import { composeContent, editContent } from '../lib/compose.js';
import { initialFormData } from '../lib/catalog.js';
import { findHarshWords } from '../lib/textTools.js';

export default function ModulePage({ mod, state, setState, settings, ai, onSaved, onUpdateHistory }) {
  const { toast, confirm } = useUI();
  const [busy, setBusy] = useState(null); // 'new' | 'regen' | 'shorten'
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const resultRef = useRef(null);
  const saveTimer = useRef(null);
  const lastAttempt = useRef(null); // thao tác vừa thực hiện, để nút "Thử lại" lặp lại với dữ liệu mới nhất

  function retry() {
    const a = lastAttempt.current;
    if (!a) return;
    if (a.type === 'revise') revise(a.action, a.instruction, { forceTemplate: a.forceTemplate });
    else run(a.kind, { forceTemplate: a.forceTemplate });
  }

  const data = state.data;
  const setData = (d) => setState((s) => ({ ...s, data: d }));

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  async function run(kind, { forceTemplate = false } = {}) {
    const msg = mod.validate(data);
    if (msg) {
      setError(msg);
      toast(msg, 'error');
      return;
    }
    setError('');
    setAiError('');
    lastAttempt.current = { type: 'run', kind, forceTemplate };
    setBusy(kind);
    const variant = kind === 'regen' ? (state.variant || 0) + 1 : 0;
    try {
      const out = await composeContent({
        moduleId: mod.id,
        data,
        settings,
        variant,
        ai: forceTemplate ? { enabled: false } : ai
      });
      let historyId = state.historyId;
      if (kind === 'new' || !historyId) {
        historyId = onSaved({ type: mod.id, title: out.title, text: out.text, data, source: out.source });
      } else {
        onUpdateHistory(historyId, { text: out.text, source: out.source });
      }
      setState((s) => ({ ...s, output: out, variant, historyId }));
      if (kind === 'new') setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (e) {
      setAiError(e.message || 'Không soạn được nội dung bằng AI.');
    } finally {
      setBusy(null);
    }
  }

  // Rút gọn / viết lại: gửi VĂN BẢN HIỆN TẠI (kể cả phần giáo viên đã sửa tay) kèm yêu cầu.
  // Lỗi thì giữ nguyên văn bản cũ.
  async function revise(action, instruction, { forceTemplate = false } = {}) {
    const current = state.output?.text || '';
    if (!current.trim()) return;
    const kind = action === 'rut-gon' ? 'shorten' : 'rewrite';
    setAiError('');
    lastAttempt.current = { type: 'revise', action, instruction, forceTemplate };
    setBusy(kind);
    try {
      const out = await editContent({ action, text: current, settings, ai: forceTemplate ? { enabled: false } : ai, instruction });
      setState((s) => ({ ...s, output: { ...s.output, text: out.text, source: out.source, notes: out.notes } }));
      if (state.historyId) onUpdateHistory(state.historyId, { text: out.text, source: out.source });
      toast(action === 'rut-gon' ? 'Đã rút gọn nội dung.' : 'Đã viết lại nội dung.');
    } catch (e) {
      setAiError(e.message || 'Không viết lại được nội dung.');
    } finally {
      setBusy(null);
    }
  }

  function onTextChange(text) {
    setState((s) => ({ ...s, output: { ...s.output, text } }));
    clearTimeout(saveTimer.current);
    if (state.historyId) saveTimer.current = setTimeout(() => onUpdateHistory(state.historyId, { text }), 600);
  }

  async function fillSample() {
    const hasInput = Object.entries(data).some(([k, v]) => v && v !== mod.defaults?.[k] && !mod.fields.find((f) => f.name === k)?.fromSettings);
    if (hasInput) {
      const ok = await confirm({ title: 'Điền dữ liệu mẫu?', message: 'Thông tin bạn đang nhập trong biểu mẫu sẽ được thay bằng dữ liệu mẫu.', confirmText: 'Điền mẫu', danger: false });
      if (!ok) return;
    }
    setState((s) => ({ ...s, data: { ...initialFormData(mod, {}), ...mod.sample } }));
    setError('');
    toast('Đã điền dữ liệu mẫu. Đây là thông tin hư cấu để thử, hãy thay bằng thông tin của lớp bạn.', 'info');
  }

  async function resetForm() {
    const ok = await confirm({ title: 'Làm mới biểu mẫu?', message: 'Các ô đã nhập sẽ được xóa (thông tin từ “Thiết lập thông tin” vẫn được điền lại).', confirmText: 'Làm mới' });
    if (!ok) return;
    setState((s) => ({ ...s, data: initialFormData(mod, settings) }));
    setError('');
  }

  const harsh = mod.id === 'tin-nhan' ? findHarshWords(data.noiDung) : [];
  const usingAI = ai.enabled && ai.connected;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
            <span aria-hidden="true">{mod.icon}</span> {mod.title}
          </h2>
          <p className="mt-1 text-[15px] text-slate-600">{mod.desc}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={fillSample}>🧪 Điền dữ liệu mẫu</button>
          <button className="btn-ghost" onClick={resetForm}>↺ Làm mới</button>
        </div>
      </div>

      <form
        className="card space-y-5 p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          run('new');
        }}
        noValidate
      >
        <FormFields fields={mod.fields} data={data} onChange={setData} idPrefix={mod.id} />

        {harsh.length > 0 && (
          <div className="rounded-xl bg-dao/40 px-4 py-3 text-[15px] text-orange-900 ring-1 ring-dao">
            <strong>Gợi ý từ ngữ nhẹ nhàng hơn:</strong>{' '}
            {harsh.map((h) => `“${h.word}” → “${h.suggestion}”`).join('; ')}. Nên mô tả việc cụ thể thay vì nhận xét tính cách của trẻ.
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-800 ring-1 ring-red-200" role="alert">⚠️ {error}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" className="btn-primary px-6 text-base" disabled={!!busy}>
            {busy === 'new' ? <Spinner /> : usingAI ? '✨' : '📋'} {usingAI ? 'Tạo nội dung bằng AI' : 'Soạn nội dung theo mẫu'}
          </button>
          <p className="text-sm text-slate-500">
            {usingAI
              ? 'Thông tin trong biểu mẫu và Thiết lập được gửi tới Claude để soạn. Không cần ghi họ tên đầy đủ của trẻ. Hãy đọc lại trước khi gửi.'
              : 'AI chưa được kết nối hoặc đang tắt — nội dung được ghép từ mẫu có sẵn.'}
          </p>
        </div>
      </form>

      {aiError && (
        <div className="card flex flex-col gap-3 p-4 ring-red-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-[15px] text-red-800">
            ⚠️ {aiError}
            {state.output?.text && <span className="block text-sm text-slate-600">Nội dung trước đó vẫn được giữ nguyên bên dưới.</span>}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            {lastAttempt.current && (
              <button className="btn-primary" disabled={!!busy} onClick={retry}>🔁 Thử lại</button>
            )}
            <button className="btn-soft" disabled={!!busy} onClick={() => run('new', { forceTemplate: true })}>📋 Soạn theo mẫu thay thế</button>
          </div>
        </div>
      )}

      <div ref={resultRef} className="scroll-mt-20">
        <OutputPanel
          output={state.output}
          busy={busy}
          onTextChange={onTextChange}
          onClear={() => setState((s) => ({ ...s, output: null, historyId: null, variant: 0 }))}
          onRegenerate={() => run('regen')}
          onShorten={() => revise('rut-gon')}
          onRewrite={(action, instruction) => revise(action, instruction)}
          usingAI={usingAI}
          emptyHint="Điền biểu mẫu (hoặc bấm “Điền dữ liệu mẫu”), rồi bấm “Soạn nội dung”."
        />
      </div>
    </div>
  );
}
