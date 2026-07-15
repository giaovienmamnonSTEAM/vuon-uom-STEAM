# 🌼 Vườn Ươm STEAM

Công cụ soạn giáo án STEAM mầm non cho Nhà trẻ (24–36 tháng), Mẫu giáo bé (3–4 tuổi), Mẫu giáo nhỡ (4–5 tuổi) và Mẫu giáo lớn (5–6 tuổi) — theo đúng quy trình **5E**, **EDP (Engineering Design Process)** và **Dự án STEAM**, trình bày theo khung 5 thành tố **S-T-E-A-M**.

Tạo bởi **Trần Quỳ** – Giáo viên mầm non STEAM.

---

## 🧱 Cấu trúc dự án

```
steam-lesson-planner/
├── api/
│   └── generate.js       # Vercel Serverless Function — proxy gọi Google Gemini API (giữ API key ở server)
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js            # Logic chính: form, render kết quả, xuất file
│   ├── api.js              # Hàm gọi tới /api/generate
│   ├── systemPrompt.js     # Prompt hệ thống mô tả quy trình soạn giáo án STEAM
│   ├── flower.js           # SVG logo hoa 5 cánh S-T-E-A-M
│   └── style.css           # Toàn bộ giao diện
├── index.html               # Trang gốc Vite
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

## ⚠️ Quan trọng: về API key

Ứng dụng gọi Google Gemini 2.5 Flash để soạn nội dung giáo án. Vì lý do bảo mật,
**API key không bao giờ được đặt ở phía trình duyệt** — nếu làm vậy bất kỳ ai
mở DevTools cũng lấy được key của bạn.

Vì vậy dự án này gọi qua route server-side `api/generate.js` (Vercel Serverless
Function), route này đọc key từ biến môi trường `GEMINI_API_KEY` trên server.
Bạn cần tự cấp một API key Google Gemini và khai báo biến môi trường này khi deploy
(xem bước 3 bên dưới) — ứng dụng sẽ không tạo được giáo án nếu thiếu key.

Lấy API key tại: https://aistudio.google.com/app/apikey

---

## 🚀 Chạy thử ở máy local

### Cách 1 — dùng Vercel CLI (khuyên dùng, chạy được cả `/api`)

```bash
npm install
npm install -g vercel   # nếu chưa có
cp .env.example .env    # rồi điền GEMINI_API_KEY thật vào .env
vercel dev
```

### Cách 2 — dùng `vite dev` (chỉ xem giao diện, KHÔNG gọi được API)

```bash
npm install
npm run dev
```

Với cách 2, nút "Soạn giáo án ngay" sẽ báo lỗi vì `/api/generate` chỉ chạy
trên môi trường Vercel (hoặc `vercel dev`). Dùng cách này nếu bạn chỉ muốn
chỉnh sửa giao diện.

---

## 📦 Đưa lên GitHub

```bash
git init
git add .
git commit -m "Khởi tạo Vườn Ươm STEAM"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
git push -u origin main
```

---

## ☁️ Deploy lên Vercel

1. Vào https://vercel.com → **Add New Project** → chọn repo GitHub vừa đẩy lên.
2. Vercel sẽ tự nhận diện đây là dự án **Vite** (nhờ `vercel.json`), giữ nguyên
   Build Command `npm run build` và Output Directory `dist`.
3. Trước khi bấm Deploy (hoặc sau đó vào **Settings → Environment Variables**),
   thêm biến môi trường:

   | Name | Value |
   |---|---|
   | `GEMINI_API_KEY` | API key Google Gemini của bạn |

4. Bấm **Deploy**. Sau khi build xong, Vercel sẽ cấp cho bạn một domain dạng
   `https://ten-du-an.vercel.app` — mở lên là dùng được ngay.

Mỗi lần bạn `git push` lên nhánh `main`, Vercel sẽ tự động build & deploy lại.

---

## ✏️ Tuỳ chỉnh

- **Đổi màu / phông chữ:** sửa biến CSS trong `src/style.css` (khối `:root`).
- **Đổi nội dung / quy tắc soạn giáo án:** sửa `src/systemPrompt.js`.
- **Đổi model AI:** sửa dòng `const GEMINI_MODEL = 'gemini-2.5-flash'` trong `api/generate.js`.
- **Tên người tạo / thương hiệu:** sửa trực tiếp trong `index.html` (header, footer).

---

## 📄 Giấy phép

Dự án nội bộ phục vụ giảng dạy mầm non. Vui lòng không phát hành lại nội dung
mà không ghi rõ nguồn.
