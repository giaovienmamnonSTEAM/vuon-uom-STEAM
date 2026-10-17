// Dựng biểu mẫu tự động từ mô tả trong lib/catalog.js.
export default function FormFields({ fields, data, onChange, idPrefix }) {
  const set = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((f) => {
        const id = `${idPrefix}-${f.name}`;
        const wide = f.type === 'textarea' || f.type === 'chips';
        const value = data[f.name] ?? '';
        return (
          <div key={f.name} className={wide ? 'md:col-span-2' : ''}>
            {f.type === 'chips' ? (
              <fieldset>
                <legend className="label">
                  {f.label} {f.required && <span className="text-red-500" aria-hidden="true">*</span>}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {f.options.map((o) => {
                    const active = value === o.value;
                    return (
                      <button
                        type="button"
                        key={o.value}
                        aria-pressed={active}
                        onClick={() => set(f.name, o.value)}
                        className={`min-h-[44px] rounded-xl px-4 py-2 text-[15px] font-medium ring-1 transition ${
                          active ? 'bg-sky-500 text-white ring-sky-500 shadow-sm' : 'bg-white text-slate-700 ring-slate-200 hover:bg-sky-50'
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <>
                <label htmlFor={id} className="label">
                  {f.label} {f.required && <span className="text-red-500" aria-hidden="true">*</span>}
                </label>
                {f.type === 'select' ? (
                  <select id={id} className="input" value={value} onChange={(e) => set(f.name, e.target.value)}>
                    {!f.required && <option value="">— Chọn —</option>}
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea id={id} className="input" rows={f.rows || 3} value={value} placeholder={f.placeholder} maxLength={3000} onChange={(e) => set(f.name, e.target.value)} />
                ) : (
                  <>
                    <input
                      id={id}
                      type="text"
                      className="input"
                      value={value}
                      placeholder={f.placeholder}
                      maxLength={300}
                      list={f.suggestions ? `${id}-list` : undefined}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                    {f.suggestions && (
                      <datalist id={`${id}-list`}>
                        {f.suggestions.map((s) => <option key={s} value={s} />)}
                      </datalist>
                    )}
                  </>
                )}
              </>
            )}
            {f.hint && <p className="mt-1 text-sm text-slate-500">{f.hint}</p>}
          </div>
        );
      })}
    </div>
  );
}
