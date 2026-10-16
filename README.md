# 🌼 Vườn Ươm STEAM

Công cụ soạn giáo án STEAM mầm non cho Nhà trẻ (24–36 tháng), Mẫu giáo bé (3–4 tuổi), Mẫu giáo nhỡ (4–5 tuổi) và Mẫu giáo lớn (5–6 tuổi), theo nguyên tắc **"Công phá STEAM cùng Thầy Phúc"** và quy trình **5E** / **EDP**.

**Không cần API key, không gọi AI, không cần máy chủ.** App chạy hoàn toàn trên trình duyệt: tự lắp giáo án từ khung chuẩn và mẫu câu viết sẵn theo độ tuổi, giáo viên sửa trực tiếp trên trang rồi tải file Word.

Tạo bởi **Trần Quỳ** – Giáo viên mầm non STEAM.

---

## ✨ Cách dùng

1. Chọn **giáo án mẫu** để xem ngay, hoặc nhập: độ tuổi, lĩnh vực, chủ đề, đề tài.
2. App tự chọn quy trình theo lĩnh vực (tạo hình, chế tạo, nấu ăn → **EDP**; còn lại → **5E**), hoặc giáo viên tự chọn.
3. Nhập phần riêng của bài:
   - **EDP:** sản phẩm trẻ làm, sản phẩm có dùng được thật không, tình huống có vấn đề, tiêu chí sản phẩm.
   - **5E:** đối tượng khám phá, đặc điểm cần khám phá, cách trẻ khám phá.
   - Chung: nguyên vật liệu, dụng cụ trẻ tự dùng (thành tố T), bài hát mở đầu, ý nghĩa giáo dục, phối hợp phụ huynh.
4. Bấm **Lập giáo án**. Giáo án có đủ 3 phần:
   - **I. Mục đích – Yêu cầu:** Kiến thức theo 5 dòng S-T-E-A-M → Kỹ năng 4C's + kỹ năng khác → Thái độ.
   - **II. Chuẩn bị:** của Cô, của Trẻ, phối hợp phụ huynh (khi cần).
   - **III. Cách tiến hành:** bảng 2 cột Hoạt động của Cô | Hoạt động của Trẻ, có lời thoại.
5. **Bấm vào chữ bất kỳ để sửa.** Chỗ tô vàng có dấu `«…»` là nội dung riêng của bài cần giáo viên điền; nút "Tới chỗ tiếp theo →" đưa đến từng chỗ. Có thể thêm/xoá dòng và lượt hỏi – đáp.
6. Bấm **Tải file Word (.docx)** (A4, Times New Roman 13, phần III là một bảng, mỗi bước một hàng).

Giáo án đã soạn và các chỉnh sửa được tự lưu trong trình duyệt của máy đang dùng (20 giáo án gần nhất).

Nếu sản phẩm EDP không dùng được thật (chỉ tô, xé, nặn theo mẫu), app cảnh báo và gợi ý cải biến theo nguyên tắc STEAM.

## 🧱 Cấu trúc dự án

```
src/
  main.js        # Form, hiển thị và sửa trực tiếp giáo án, lịch sử
  generator.js   # Bộ lắp giáo án 5E / EDP theo độ tuổi (khung Thầy Phúc + mẫu câu)
  presets.js     # Giáo án mẫu
  planModel.js   # Độ tuổi, lĩnh vực, nhãn mục, xuất văn bản thuần
  exportDocx.js  # Xuất file Word (.docx)
  flower.js, style.css
index.html
```

## 🚀 Chạy ở máy

```bash
npm install
npm run dev      # mở http://localhost:5173
```

## ☁️ Đưa lên mạng

Đây là trang tĩnh, đăng ở đâu cũng được (Vercel, Netlify, GitHub Pages...).

Với Vercel: **Add New Project** → chọn repo → giữ nguyên Build Command `npm run build`, Output Directory `dist` → **Deploy**. Không cần khai báo biến môi trường nào.

## ✏️ Tuỳ chỉnh

- **Mẫu câu, lời thoại, thời lượng theo độ tuổi:** `src/generator.js`.
- **Thêm giáo án mẫu:** thêm một mục vào `src/presets.js`.
- **Đổi màu / phông chữ:** khối `:root` trong `src/style.css`.
- **Tên người tạo:** `index.html` (header, footer).

## 📄 Giấy phép

Dự án nội bộ phục vụ giảng dạy mầm non. Vui lòng không phát hành lại nội dung mà không ghi rõ nguồn.
