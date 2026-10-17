// Lưu theo tài khoản Claude khi ứng dụng mở trên claude.ai (khả năng "db" + "user").
// Mỗi người dùng có vùng dữ liệu riêng data/users/<id>/ — người khác (kể cả chủ
// trang) không đọc được. Ngoài claude.ai, hoặc khi không có quyền ghi, ứng dụng
// dùng localStorage như cũ.

let ctx = null; // { db, base }

export async function initCloud() {
  if (typeof window === 'undefined' || !window.claude?.use) return null;
  try {
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) return null;
    const uid = await user.id();
    if (!uid) return null;
    ctx = { db, base: `data/users/${uid}` };
    return ctx;
  } catch {
    return null;
  }
}

export function cloudActive() {
  return Boolean(ctx);
}

export function disableCloud() {
  ctx = null;
}

const historyCol = () => ctx.db.doc(`${ctx.base}/profile`).collection('history');

export async function loadCloud() {
  const [s, p, h] = await Promise.all([
    ctx.db.doc(`${ctx.base}/settings`).get(),
    ctx.db.doc(`${ctx.base}/prefs`).get(),
    historyCol().orderBy('createdAt', 'desc').limit(300).get()
  ]);
  return {
    settings: s.exists ? s.data() : null,
    prefs: p.exists ? p.data() : null,
    history: h.docs.map((d) => ({ ...d.data(), id: d.id }))
  };
}

// Mọi hàm ghi trả về Promise; lỗi để App quyết định chuyển về lưu trên máy.
export const cloudSaveSettings = (s) => ctx.db.doc(`${ctx.base}/settings`).set({ ...s });
export const cloudSavePrefs = (p) => ctx.db.doc(`${ctx.base}/prefs`).set({ useAI: Boolean(p.useAI) }); // không lưu mã truy cập
export const cloudClearSettings = () => ctx.db.doc(`${ctx.base}/settings`).delete();

export function cloudPutHistory(item) {
  const { id, ...rest } = item;
  return historyCol().doc(id).set(JSON.parse(JSON.stringify(rest)));
}
export const cloudPatchHistory = (id, patch) => historyCol().doc(id).update(JSON.parse(JSON.stringify(patch)));
export const cloudDeleteHistory = (id) => historyCol().doc(id).delete();

export async function cloudDeleteAll(ids) {
  for (const id of ids) await cloudDeleteHistory(id);
}
