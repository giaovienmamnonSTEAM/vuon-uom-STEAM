# 🌼 Vườn Ươm STEAM

Công cụ soạn giáo án STEAM mầm non cho Nhà trẻ (24–36 tháng), Mẫu giáo bé (3–4 tuổi), Mẫu giáo nhỡ (4–5 tuổi) và Mẫu giáo lớn (5–6 tuổi) — theo đúng quy trình **5E**, **EDP (Engineering Design Process)** và **Dự án STEAM**, trình bày theo khung 5 thành tố **S-T-E-A-M**.

Tạo bởi **Trần Quỳ** – Giáo viên mầm non STEAM.

---

## ✨ Tính năng

- **4 độ tuổi:** Nhà trẻ 24–36 tháng, Mẫu giáo bé 3–4 tuổi, nhỡ 4–5 tuổi, lớn 5–6 tuổi. Lời thoại, thời lượng và độ khó được điều chỉnh theo từng độ tuổi.
- **Nguyên tắc cốt lõi (Công phá STEAM cùng Thầy Phúc):** phân tích bản chất hoạt động; dùng 5E cho hoạt động tìm tòi, khám phá; chỉ dùng EDP khi sản phẩm có tính ứng dụng thật; phân biệt STEAM toàn phần / một phần; không gán ép STEAM.
- **I. Mục đích – Yêu cầu:** Kiến thức theo 5 dòng S-T-E-A-M (ghi "Không áp dụng." nếu thành tố không thực chất) → Kỹ năng 4C's gắn hành vi + kỹ năng khác → Thái độ.
- **II. Chuẩn bị:** Cô (tâm thế – tâm lý – sức khỏe, chuyên môn, đồ dùng, môi trường, an toàn), Trẻ, Phụ huynh (khi cần).
- **III. Cách tiến hành:** bảng 2 cột **Hoạt động của Cô | Hoạt động của Trẻ**, lời thoại trực tiếp, câu hỏi mở, nhiều câu trả lời của trẻ.
- **Tải file Word (.docx):** A4, Times New Roman 13; phần III là một bảng liên tục, mỗi bước một hàng.
- **Chuyển giáo án truyền thống sang STEAM:** dán giáo án cũ, ứng dụng đánh giá có phù hợp không và tái thiết kế.
- **Tài nguyên hỗ trợ (tuỳ chọn):** bảng ghi chép / bảng thiết kế, trò chơi, học liệu, slide, prompt AI, phiếu đánh giá.
- **Lịch sử:** 15 giáo án gần nhất được lưu trong trình duyệt của máy đang dùng.

## 🧱 Cấu trúc dự án

```
api/
  generate.js      # Serverless Function: ghép prompt ở server, gọi Claude API (SDK @anthropic-ai/sdk) dạng stream
  _prompts.js      # Prompt hệ thống (nguyên tắc + khung giáo án) — không phải route
src/
  main.js          # Form, hiển thị giáo án, lịch sử
  api.js           # Gọi /api/generate và đọc luồng SSE
  planModel.js     # Độ tuổi, lĩnh vực, nhãn mục, xuất văn bản thuần
  exportDocx.js    # Xuất file Word (.docx)
  flower.js, style.css
```

## ⚠️ Quan trọng: về API key

Ứng dụng gọi **Claude API** của Anthropic (model mặc định `claude-opus-5`) để soạn nội dung giáo án. Vì lý do bảo mật,
**API key không bao giờ được đặt ở phía trình duyệt** — nếu làm vậy bất kỳ ai
mở DevTools cũng lấy được key của bạn.

Vì vậy dự án này gọi qua route server-side `api/generate.js` (Vercel Serverless
Function), route này đọc key từ biến môi trường `ANTHROPIC_API_KEY` trên server.
Bạn cần tự cấp một API key Anthropic và khai báo biến môi trường này khi deploy
(xem bước 3 bên dưới) — ứng dụng sẽ không tạo được giáo án nếu thiếu key.

Lấy API key tại: https://console.anthropic.com/settings/keys (cần nạp tín dụng trong mục Billing; mỗi giáo án chi tiết tốn khoảng vài nghìn đồng tiền API).

---

## 🚀 Chạy thử ở máy local

```bash
npm install
cp .env.example .env    # rồi điền ANTHROPIC_API_KEY thật vào .env
npm run dev             # mở http://localhost:5173 — route /api/generate chạy luôn
```

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
   | `ANTHROPIC_API_KEY` | API key Anthropic của bạn |

4. Bấm **Deploy**. Sau khi build xong, Vercel sẽ cấp cho bạn một domain dạng
   `https://ten-du-an.vercel.app` — mở lên là dùng được ngay.

Mỗi lần bạn `git push` lên nhánh `main`, Vercel sẽ tự động build & deploy lại.

---

## ✏️ Tuỳ chỉnh

- **Đổi màu / phông chữ:** sửa biến CSS trong `src/style.css` (khối `:root`).
- **Đổi nội dung / quy tắc soạn giáo án:** sửa `api/_prompts.js`.
- **Đổi model AI:** đặt biến môi trường `CLAUDE_MODEL` (mặc định `claude-opus-5`).
- **Khi model từ chối nội dung:** app bật `fallbacks: "default"`, API tự chạy lại yêu cầu trên model dự phòng phù hợp.
- **Thời gian chờ:** `vercel.json` cho phép hàm chạy tối đa 300 giây, đủ cho giáo án chi tiết.
- **Tên người tạo / thương hiệu:** sửa trực tiếp trong `index.html` (header, footer).

---

## 📄 Giấy phép

Dự án nội bộ phục vụ giảng dạy mầm non. Vui lòng không phát hành lại nội dung
mà không ghi rõ nguồn.
