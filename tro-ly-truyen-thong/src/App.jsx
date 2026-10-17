import { useCallback, useEffect, useMemo, useState } from 'react';
import { MODULES, getModule, initialFormData } from './lib/catalog.js';
import { checkAIStatus } from './lib/aiClient.js';
import * as store from './lib/storage.js';
import * as cloud from './lib/cloud.js';
import logoUrl from './assets/logo.svg';
import { useUI } from './components/UI.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage from './pages/ModulePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

const NAV = [
  { id: 'trang-chu', label: 'Trang chủ', icon: '🏠' },
  ...MODULES.map((m) => ({ id: m.id, label: m.short, icon: m.icon })),
  { id: 'bien-tap', label: 'Biên tập', icon: '🪄' },
  { id: 'lich-su', label: 'Lịch sử', icon: '🕘' },
  { id: 'thiet-lap', label: 'Thiết lập thông tin', icon: '⚙️' }
];
const ROUTES = new Set(NAV.map((n) => n.id));

function routeFromHash() {
  const r = window.location.hash.replace(/^#\/?/, '');
  return ROUTES.has(r) ? r : 'trang-chu';
}

export default function App() {
  const { toast } = useUI();
  const [route, setRoute] = useState(routeFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storageOK] = useState(store.storageAvailable);
  const [settings, setSettings] = useState(store.loadSettings);
  const [prefs, setPrefs] = useState(store.loadPrefs);
  const [history, setHistory] = useState(store.loadHistory);
  const [aiStatus, setAiStatus] = useState({ loading: true, connected: false });
  // 'local': localStorage trên máy này · 'cloud': theo tài khoản Claude · 'checking'
  const [storageMode, setStorageMode] = useState(() => (typeof window !== 'undefined' && window.claude?.use ? 'checking' : 'local'));
  const [moduleStates, setModuleStates] = useState(() =>
    Object.fromEntries(MODULES.map((m) => [m.id, { data: initialFormData(m, store.loadSettings()), output: null, variant: 0, historyId: null }]))
  );
  const [editorState, setEditorState] = useState({ input: '', output: null, lastAction: null, variant: 0, historyId: null });

  // ---- Điều hướng (hash) ----
  useEffect(() => {
    const onHash = () => {
      setRoute(routeFromHash());
      setMenuOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = useCallback((id) => {
    if (window.location.hash === `#${id}`) {
      setMenuOpen(false);
      return;
    }
    window.location.hash = id;
  }, []);

  // ---- Lưu theo tài khoản Claude (khi mở trên claude.ai) ----
  const cloudFail = useCallback(() => {
    if (!cloud.cloudActive()) return;
    cloud.disableCloud();
    setStorageMode('local');
    toast('Không lưu được vào tài khoản Claude (có thể bạn chỉ có quyền xem). Từ giờ dữ liệu được lưu trên máy này.', 'error');
  }, [toast]);
  const sync = useCallback((fn) => {
    if (!cloud.cloudActive()) return;
    Promise.resolve()
      .then(fn)
      .catch(cloudFail);
  }, [cloudFail]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ok = await cloud.initCloud();
      if (!alive) return;
      if (!ok) return setStorageMode('local');
      try {
        const remote = await cloud.loadCloud();
        if (!alive) return;
        const localSettings = store.loadSettings();
        const localHistory = store.loadHistory();
        if (remote.settings) {
          const s = { ...store.EMPTY_SETTINGS, ...remote.settings };
          setSettings(s);
          store.saveSettings(s);
        } else if (Object.values(localSettings).some(Boolean)) {
          await cloud.cloudSaveSettings(localSettings);
        }
        if (remote.prefs) setPrefs((p) => ({ ...p, useAI: remote.prefs.useAI !== false }));
        // Gộp lịch sử: bản trên tài khoản + bản chỉ có trên máy này (tải lên)
        const ids = new Set(remote.history.map((h) => h.id));
        const onlyLocal = localHistory.filter((h) => !ids.has(h.id));
        for (const h of onlyLocal) await cloud.cloudPutHistory(h);
        const merged = [...remote.history, ...onlyLocal].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 300);
        setHistory(merged);
        store.saveHistory(merged);
        setStorageMode('cloud');
      } catch {
        cloud.disableCloud();
        if (alive) setStorageMode('local');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- Kết nối AI ----
  const recheck = useCallback(async () => {
    setAiStatus((s) => ({ ...s, loading: true }));
    const st = await checkAIStatus();
    setAiStatus({ ...st, loading: false });
  }, []);
  useEffect(() => {
    recheck();
  }, [recheck]);

  const ai = useMemo(
    () => ({ enabled: prefs.useAI, connected: aiStatus.connected, accessCode: prefs.accessCode }),
    [prefs, aiStatus.connected]
  );

  // ---- Lịch sử ----
  const persistHistory = (list) => {
    store.saveHistory(list);
    return list;
  };
  const addHistory = useCallback((entry) => {
    const now = Date.now();
    const item = { id: store.newId(), createdAt: now, updatedAt: now, ...entry };
    setHistory((list) => persistHistory([item, ...list]));
    sync(() => cloud.cloudPutHistory(item));
    return item.id;
  }, [sync]);
  const updateHistory = useCallback((id, patch) => {
    const full = { ...patch, updatedAt: Date.now() };
    setHistory((list) => persistHistory(list.map((h) => (h.id === id ? { ...h, ...full } : h))));
    sync(() => cloud.cloudPatchHistory(id, full));
  }, [sync]);
  const deleteHistory = useCallback((id) => {
    setHistory((list) => persistHistory(list.filter((h) => h.id !== id)));
    sync(() => cloud.cloudDeleteHistory(id));
  }, [sync]);
  const deleteAllHistory = useCallback(() => {
    const ids = history.map((h) => h.id);
    setHistory(persistHistory([]));
    sync(() => cloud.cloudDeleteAll(ids));
  }, [sync, history]);

  function openHistory(h) {
    const output = { text: h.text, title: h.title, source: h.source, notes: [] };
    if (h.type === 'bien-tap') {
      setEditorState({ input: h.data?.input || '', output, lastAction: h.data?.action || null, variant: 0, historyId: h.id });
    } else {
      const mod = getModule(h.type);
      if (!mod) return toast('Không mở được nội dung này.', 'error');
      setModuleStates((all) => ({ ...all, [h.type]: { data: { ...initialFormData(mod, {}), ...(h.data || {}) }, output, variant: 0, historyId: h.id } }));
    }
    go(h.type);
    toast('Đã mở lại nội dung. Chỉnh sửa sẽ được lưu vào mục lịch sử này.', 'info');
  }

  // ---- Thông tin nhà trường ----
  function saveSettings(s) {
    setSettings(s);
    // Điền vào những ô còn trống của các biểu mẫu
    setModuleStates((all) => {
      const next = { ...all };
      for (const m of MODULES) {
        const data = { ...next[m.id].data };
        for (const f of m.fields) if (f.fromSettings && !data[f.name] && s[f.fromSettings]) data[f.name] = s[f.fromSettings];
        next[m.id] = { ...next[m.id], data };
      }
      return next;
    });
    sync(() => cloud.cloudSaveSettings(s));
    return store.saveSettings(s) || cloud.cloudActive();
  }
  function clearSettings() {
    setSettings({ ...store.EMPTY_SETTINGS });
    store.clearSettings();
    sync(() => cloud.cloudClearSettings());
  }
  function updatePrefs(p) {
    setPrefs(p);
    store.savePrefs(p);
    sync(() => cloud.cloudSavePrefs(p));
  }

  const setModuleState = (id) => (updater) =>
    setModuleStates((all) => ({ ...all, [id]: typeof updater === 'function' ? updater(all[id]) : updater }));

  const mod = getModule(route);
  const current = NAV.find((n) => n.id === route);

  let page;
  if (mod) {
    page = (
      <ModulePage
        key={mod.id}
        mod={mod}
        state={moduleStates[mod.id]}
        setState={setModuleState(mod.id)}
        settings={settings}
        ai={ai}
        onSaved={addHistory}
        onUpdateHistory={updateHistory}
      />
    );
  } else if (route === 'bien-tap') {
    page = <EditorPage state={editorState} setState={setEditorState} settings={settings} ai={ai} onSaved={addHistory} onUpdateHistory={updateHistory} />;
  } else if (route === 'lich-su') {
    page = <HistoryPage history={history} onOpen={openHistory} onDelete={deleteHistory} onDeleteAll={deleteAllHistory} onUpdate={updateHistory} storageOK={storageOK} storageMode={storageMode} />;
  } else if (route === 'thiet-lap') {
    page = <SettingsPage settings={settings} onSave={saveSettings} onClear={clearSettings} prefs={prefs} onPrefs={updatePrefs} aiStatus={aiStatus} onRecheck={recheck} storageOK={storageOK} storageMode={storageMode} />;
  } else {
    page = <HomePage go={go} aiStatus={aiStatus} prefs={prefs} settings={settings} historyCount={history.length} />;
  }

  const usingAI = aiStatus.connected && prefs.useAI;

  const navList = (
    <nav aria-label="Chức năng">
      <ul className="space-y-1">
        {NAV.map((n) => {
          const active = n.id === route;
          return (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium transition ${
                  active ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:bg-sky-100'
                }`}
              >
                <span className="w-6 text-center text-lg" aria-hidden="true">{n.icon}</span>
                {n.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Thanh trên cùng trên điện thoại */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-sky-100 bg-white/95 px-4 py-2 backdrop-blur lg:hidden print:hidden">
        <button className="btn-ghost px-3" onClick={() => setMenuOpen(true)} aria-label="Mở menu chức năng" aria-expanded={menuOpen}>
          ☰ <span className="text-sm">Menu</span>
        </button>
        <span className="truncate px-2 text-[15px] font-semibold text-slate-700">{current?.icon} {current?.label}</span>
        <span className={`h-3 w-3 shrink-0 rounded-full ${usingAI ? 'bg-green-500' : 'bg-amber-400'}`} title={usingAI ? 'Đã kết nối AI' : 'Soạn theo mẫu'} />
      </div>

      {/* Menu trượt trên điện thoại */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu chức năng">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-kem p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-sky-800">Chức năng</span>
              <button className="btn-ghost px-3" onClick={() => setMenuOpen(false)} aria-label="Đóng menu">✕</button>
            </div>
            {navList}
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 lg:py-6">
        {/* Thanh điều hướng bên trái trên máy tính */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col overflow-y-auto lg:flex print:hidden">
          <div className="mb-4 flex items-center gap-2 px-2">
            <img src={logoUrl} alt="" className="h-9 w-9" />
            <span className="text-sm font-bold leading-tight text-sky-800">Trợ lý Truyền thông<br />Mầm non</span>
          </div>
          {navList}
          <div className="mt-auto px-2 pt-4 text-xs text-slate-500">
            <span className={`mr-1 inline-block h-2.5 w-2.5 rounded-full ${usingAI ? 'bg-green-500' : 'bg-amber-400'}`} />
            {aiStatus.loading ? 'Đang kiểm tra AI…' : usingAI ? 'Đã kết nối AI' : 'Chưa dùng AI · soạn theo mẫu'}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-200 via-sky-100 to-vang/70 p-5 ring-1 ring-sky-200 sm:p-7 print:hidden">
            <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">TRỢ LÝ TRUYỀN THÔNG MẦM NON</h1>
            <p className="mt-2 text-[15px] text-sky-900/80 sm:text-base">Kết nối nhà trường – giáo viên – gia đình bằng những thông điệp yêu thương</p>
          </header>
          {page}
          <footer className="mt-10 border-t border-sky-100 pt-4 text-center text-xs text-slate-500 print:hidden">
            {storageMode === 'cloud'
              ? 'Dữ liệu được lưu trong vùng riêng của tài khoản Claude của bạn (người khác không xem được). Luôn đọc lại nội dung trước khi gửi phụ huynh.'
              : 'Dữ liệu được lưu trên trình duyệt của máy này, không đồng bộ giữa các thiết bị. Luôn đọc lại nội dung trước khi gửi phụ huynh.'}
          </footer>
        </main>
      </div>
    </div>
  );
}
