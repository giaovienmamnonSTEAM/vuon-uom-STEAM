// Thông báo nhỏ (toast) và hộp thoại xác nhận dùng chung toàn ứng dụng.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);

  const toast = useCallback((message, type = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3200);
  }, []);

  const confirm = useCallback((opts) => {
    setDialog({ title: 'Xác nhận', confirmText: 'Đồng ý', cancelText: 'Hủy', danger: true, ...opts });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (val) => {
    setDialog(null);
    resolver.current?.(val);
    resolver.current = null;
  };

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 print:hidden" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto max-w-md rounded-xl px-4 py-3 text-[15px] font-medium shadow-lg ring-1 ${
              t.type === 'error' ? 'bg-red-50 text-red-800 ring-red-200' : t.type === 'info' ? 'bg-vang text-amber-900 ring-amber-200' : 'bg-white text-slate-800 ring-sky-200'
            }`}
          >
            {t.type === 'error' ? '⚠️ ' : t.type === 'info' ? 'ℹ️ ' : '✅ '}
            {t.message}
          </div>
        ))}
      </div>
      {dialog && <ConfirmDialog {...dialog} onClose={close} />}
    </UIContext.Provider>
  );
}

function ConfirmDialog({ title, message, confirmText, cancelText, danger, onClose }) {
  const okRef = useRef(null);
  useEffect(() => {
    okRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={() => onClose(false)}>
      <div className="card w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title" className="text-lg font-bold text-slate-800">{title}</h2>
        {message && <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{message}</p>}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button className="btn-ghost" onClick={() => onClose(false)}>{cancelText}</button>
          <button ref={okRef} className={danger ? 'btn bg-red-600 text-white hover:bg-red-700' : 'btn-primary'} onClick={() => onClose(true)}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useUI() {
  return useContext(UIContext);
}

export function Spinner({ className = '' }) {
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden="true" />;
}
