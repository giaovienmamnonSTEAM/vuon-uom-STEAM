// Chức năng 7: Biên tập và cải thiện nội dung giáo viên đã viết.
import { useRef, useState } from 'react';
import OutputPanel from '../components/OutputPanel.jsx';
import { Spinner, useUI } from '../components/UI.jsx';
import { EDIT_ACTIONS, EDITOR_SAMPLE } from '../lib/catalog.js';
import { editContent } from '../lib/compose.js';
import IllustrationPicker from '../components/IllustrationPicker.jsx';
import { ModuleIcon } from '../illustrations/icons.jsx';

export default function EditorPage({ state, setState, settings, ai, onSaved, onUpdateHistory }) {
  const { toast, confirm } = useUI();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const [failed, setFailed] = useState(null);
  const resultRef = useRef(null);
  const saveTimer = useRef(null);
  const usingAI = ai.enabled && ai.connected;

  async function run(action, { kind = 'new', forceTemplate = false, source, instruction } = {}) {
    const text = source ?? state.input;
    if (!text?.trim()) {
      const m = 'Vui lòng dán hoặc nhập văn bản cần biên tập.';
      setError(m);
      toast(m, 'error');
      return;
    }
    setError('');
    setFailed(null);
    setBusy(kind === 'new' ? action : kind);
    const variant = kind === 'regen' ? (state.variant || 0) + 1 : 0;
    try {
      const out = await editContent({ action, text, settings, variant, instruction, ai: forceTemplate ? { enabled: false } : ai });
      let historyId = state.historyId;
      if (kind === 'new' || !historyId) {
        historyId = onSaved({ type: 'bien-tap', title: out.title, text: out.text, data: { input: state.input, action }, source: out.source });
      } else {
        onUpdateHistory(historyId, { text: out.text });
      }
      setState((s) => ({ ...s, output: out, lastAction: ['shorten', 'rewrite'].includes(kind) ? s.lastAction : action, variant, historyId }));
      if (kind === 'new') setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (e) {
      setError(e.message || 'Không biên tập được bằng AI.');
      setFailed({ action, kind, source, instruction });
    } finally {
      setBusy(null);
    }
  }

  function onTextChange(text) {
    setState((s) => ({ ...s, output: { ...s.output, text } }));
    clearTimeout(saveTimer.current);
    if (state.historyId) saveTimer.current = setTimeout(() => onUpdateHistory(state.historyId, { text }), 600);
  }

  async function clearInput() {
    if (!state.input) return;
    const ok = await confirm({ title: 'Xóa văn bản gốc?', message: 'Văn bản bạn đã dán trong ô nhập sẽ bị xóa.', confirmText: 'Xóa' });
    if (ok) setState((s) => ({ ...s, input: '' }));
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-3">
        <ModuleIcon id="bien-tap" className="h-14 w-14 shrink-0" />
        <div>
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Biên tập và cải thiện nội dung</h2>
        <p className="mt-0.5 text-[15px] text-slate-600">Dán nội dung bạn đã viết, rồi chọn thao tác. Ngày tháng, số liệu và ý chính được giữ nguyên.</p>
        </div>
        </div>
      </div>

      <div className="card space-y-4 p-4 sm:p-6">
        <div>
          <label htmlFor="editor-input" className="label">Văn bản cần biên tập</label>
          <textarea
            id="editor-input"
            className="input min-h-[180px]"
            rows={8}
            value={state.input}
            maxLength={12000}
            placeholder="Dán nội dung thông báo, tin nhắn, bài viết… vào đây."
            onChange={(e) => setState((s) => ({ ...s, input: e.target.value }))}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => setState((s) => ({ ...s, input: EDITOR_SAMPLE }))}>🧪 Dùng văn bản mẫu</button>
            <button className="btn-ghost" onClick={clearInput} disabled={!state.input}>🗑️ Xóa văn bản gốc</button>
            <span className="self-center text-sm text-slate-500">{(state.input || '').length}/12000 ký tự</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {EDIT_ACTIONS.map((a) => (
            <button key={a.value} className="btn-soft justify-start text-left" disabled={!!busy} onClick={() => run(a.value)}>
              {busy === a.value ? <Spinner /> : <span aria-hidden="true">{a.icon}</span>} {a.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-500">
          {usingAI
            ? 'Đang dùng AI để biên tập.'
            : 'AI chưa kết nối: các thao tác chạy theo quy tắc (sửa lỗi khoảng trắng, dấu câu, viết hoa, một số lỗi chính tả thường gặp, đổi cách xưng hô, đổi bố cục). Viết lại sâu về ý cần có AI.'}
        </p>

        {error && (
          <div className="flex flex-col gap-2 rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-800 ring-1 ring-red-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
            <span>⚠️ {error}</span>
            {failed && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button className="btn-primary" disabled={!!busy} onClick={() => run(failed.action, { kind: failed.kind, source: failed.source, instruction: failed.instruction })}>🔁 Thử lại</button>
                {failed.action !== 'tuy-chinh' && (
                  <button className="btn-soft" disabled={!!busy} onClick={() => run(failed.action, { kind: failed.kind, source: failed.source, forceTemplate: true })}>📋 Biên tập theo quy tắc</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={resultRef} className="scroll-mt-20">
        <OutputPanel
          output={state.output}
          busy={busy && ['regen', 'shorten', 'rewrite'].includes(busy) ? busy : busy ? 'new' : null}
          usingAI={usingAI}
          onRewrite={(action, instruction) => run(action, { kind: 'rewrite', source: state.output?.text, instruction })}
          onTextChange={onTextChange}
          onClear={() => setState((s) => ({ ...s, output: null, historyId: null, variant: 0 }))}
          onRegenerate={() => run(state.lastAction || 'than-thien', { kind: 'regen' })}
          onShorten={() => run('rut-gon', { kind: 'shorten', source: state.output?.text })}
          emptyHint="Kết quả biên tập sẽ hiển thị ở đây."
        />
      </div>

      {state.output?.text && (
        <IllustrationPicker
          moduleId="bien-tap"
          data={{}}
          text={state.output.text}
          selected={state.illustrationId}
          onSelect={(id) => {
            setState((s) => ({ ...s, illustrationId: id }));
            if (state.historyId) onUpdateHistory(state.historyId, { illustrationId: id });
          }}
        />
      )}
    </div>
  );
}
