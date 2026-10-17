# 💌 Trợ lý Truyền thông Mầm non

> Kết nối nhà trường – giáo viên – gia đình bằng những thông điệp yêu thương

Người tạo: **Trần Thị Quỳ – Trường MN Tam Giang**.

Ứng dụng web giúp giáo viên mầm non soạn nhanh thông báo, tin nhắn phụ huynh, thư mời, bản tin tuần, bài tuyên truyền và bài truyền thông của nhà trường. Giao diện tiếng Việt, dùng tốt trên máy tính, máy tính bảng và điện thoại.

## 🌐 Dùng ngay trên claude.ai (không cần Vercel)

Bản đã đăng: **https://claude.ai/artifact/EvE3bE1fZf8W5pwDZYUZqV** (mặc định chỉ chủ sở hữu mở được; muốn đồng nghiệp dùng thì bấm **Share** trên trang).

Khi mở trên claude.ai:
- **AI:** trang nhờ chính Claude của người đang dùng soạn nội dung — không cần API key. Lần đầu bấm soạn, Claude hỏi có cho phép trang dùng Claude không. Lượt dùng tính vào hạn mức tài khoản Claude của người đó.
- **Lưu trữ:** thông tin trường và lịch sử lưu trong vùng riêng của tài khoản Claude từng người (người khác, kể cả người chia sẻ trang, không xem được), mở máy khác cùng tài khoản vẫn thấy. Người chỉ có quyền *xem* (Viewer) thì không ghi được vùng này — ứng dụng tự chuyển về lưu trên trình duyệt. Muốn đồng nghiệp lưu được, chia sẻ ở mức **Contributor** trở lên.
- **Tải .txt:** đi qua hộp xác nhận lưu tệp của Claude.
- **In:** khung Artifact không mở được hộp thoại in, nên nút **In** lưu một tệp `…-ban-in.html` khổ A4 (Times New Roman); mở tệp đó trong trình duyệt là hộp thoại in tự hiện ra.

Cập nhật bản trên claude.ai sau khi sửa mã: `npm run build:artifact` (tạo `artifact/tro-ly-truyen-thong.html`), rồi đăng lại tệp này.

## ✨ Chức năng

| Chức năng | Nội dung |
|---|---|
| 📢 Soạn thông báo | 10 loại thông báo, 3 phong cách (ngắn gọn / thân thiện / trang trọng) |
| 💬 Tin nhắn phụ huynh | 7 loại tin nhắn, gợi ý thay từ ngữ dễ gây tổn thương (“hư”, “lười”…) |
| 💌 Tạo thư mời | Bố cục trang trọng có quốc hiệu, tiêu ngữ, dễ dán sang Word/Canva |
| 🗞️ Bản tin tuần | Chỉ gồm các mục giáo viên nhập, không tự thêm nhận xét sức khỏe/kết quả học tập |
| 🌱 Tuyên truyền | 10 chủ đề × 4 độ tuổi (24–36 tháng, 3–4, 4–5, 5–6 tuổi), 3 hình thức |
| 📰 Bài truyền thông | Facebook, website, Zalo, tổng kết sự kiện, lan tỏa gương tốt; 3 độ dài; hashtag |
| 🪄 Biên tập | Sửa chính tả, thân thiện hơn, rút gọn, trang trọng, rõ ràng, chuyển Zalo, thông báo chính thức, văn phong hành chính, 3 phiên bản |
| 🕘 Lịch sử | Tự lưu, phân loại, tìm kiếm (gõ có dấu hoặc không dấu), mở lại, sửa, sao chép, xóa |
| ⚙️ Thiết lập thông tin | Tên trường, đơn vị chủ quản, địa chỉ, SĐT, giáo viên, lớp, năm học — tự điền vào biểu mẫu |

Khung kết quả có: **Sao chép · Chỉnh sửa · Rút gọn · Phiên bản mới · Tải .txt · In · Xóa nội dung** (xóa luôn hỏi xác nhận).

## 🤖 Các chế độ soạn — luôn ghi rõ nguồn

1. **Soạn theo mẫu (không dùng AI)** — mặc định, chạy ngay trên trình duyệt, không cần mạng hay API key. Ghép câu chữ từ mẫu có sẵn và kho kiến thức tuyên truyền; phần biên tập chạy theo quy tắc (khoảng trắng, dấu câu, viết hoa, một số lỗi chính tả thường gặp, cách xưng hô, bố cục). Không viết lại sâu về ý như AI.
2. **Soạn bằng AI (Claude)** — trên claude.ai: dùng Claude của người dùng (xem trên). Trên máy chủ riêng: chỉ bật khi máy chủ có API key thật. Trình duyệt hỏi `/api/status`; nếu chưa cấu hình, ứng dụng hiển thị “AI chưa được kết nối” và dùng chế độ theo mẫu. Không bao giờ giả vờ AI đang chạy.

Mỗi kết quả và mỗi mục lịch sử đều có nhãn **“Soạn bằng AI”** hoặc **“Soạn theo mẫu”**.

### Bộ não AI (`api/_lib/prompts.js`)

Một tệp prompt dùng chung cho cả hai đường gọi AI (Claude trên claude.ai và hàm máy chủ):
- Vai trò: trợ lý truyền thông chuyên nghiệp của giáo viên mầm non Việt Nam; quy tắc về chính tả, giọng văn tự nhiên, không bịa dữ kiện, không chẩn đoán, tôn trọng phụ huynh và trẻ.
- Hướng dẫn riêng cho từng chức năng (thông báo, tin nhắn, thư mời, bản tin tuần, tuyên truyền, truyền thông, 11 kiểu biên tập).
- Dùng thông tin trong Thiết lập (trường, lớp, giáo viên…) khi phù hợp.
- Thiếu thông tin quan trọng → AI đặt `[CẦN BỔ SUNG: …]`; ứng dụng đếm và nhắc số chỗ cần điền.
- AI trả thêm phần ghi chú riêng cho giáo viên (thông tin thiếu, ý AI tự thêm cần kiểm tra); ứng dụng tách phần này ra, hiển thị dưới dạng “Ghi chú của AI”, không lẫn vào văn bản gửi phụ huynh.
- Rút gọn / Viết lại / yêu cầu riêng luôn gửi **văn bản hiện tại** (kể cả phần giáo viên đã sửa tay) kèm yêu cầu, không soạn lại từ đầu. Lỗi thì giữ nguyên văn bản cũ, có nút **Thử lại**.

### Bật AI khi tự đưa lên Vercel (không bắt buộc)

1. Trên Vercel: **Add New Project** → chọn repo → **Root Directory: `tro-ly-truyen-thong`** → Deploy.
2. **Settings → Environment Variables**:
   - `ANTHROPIC_API_KEY` (bắt buộc) — API key Claude.
   - `APP_ACCESS_CODE` (tùy chọn) — mã giáo viên phải nhập trong “Thiết lập thông tin” mới dùng được AI, tránh người lạ dùng tốn phí.
   - `CLAUDE_MODEL` (tùy chọn) — mặc định `claude-opus-5-5`.
3. Deploy lại.

API key chỉ nằm ở hàm máy chủ `api/generate.js`, không bao giờ có trong mã trình duyệt. Prompt được ghép ở máy chủ (`api/_lib/prompts.js`) và chỉ nhận các trường biểu mẫu đã biết, nên endpoint không dùng được để gọi AI tùy ý. Yêu cầu bật chế độ dự phòng phía máy chủ (`fallbacks: "default"`): nếu mô hình chính từ chối, Anthropic tự chuyển sang mô hình phù hợp.

## 💾 Lưu trữ — giới hạn cần biết

- Thông tin nhà trường và lịch sử (tối đa 300 mục) lưu bằng **localStorage của trình duyệt trên máy đang dùng**.
- **Không có cơ sở dữ liệu, không lưu trên máy chủ, không đồng bộ giữa các thiết bị.** Xóa dữ liệu trình duyệt hoặc dùng chế độ ẩn danh sẽ mất dữ liệu — hãy tải .txt nội dung quan trọng.
- Khi soạn bằng AI, thông tin biểu mẫu và thông tin trường được gửi tới máy chủ để AI soạn (không lưu lại).

## 🧱 Cấu trúc

```
api/
  generate.js        # Hàm máy chủ gọi Claude (giữ API key)
  status.js          # Báo đã cấu hình AI hay chưa
  _lib/prompts.js    # Prompt hệ thống + hướng dẫn cho từng loại nội dung
src/
  App.jsx            # Điều hướng (thanh bên trái / menu điện thoại), trạng thái chung
  pages/             # Trang chủ, trang soạn (dùng chung), Biên tập, Lịch sử, Thiết lập
  components/        # Biểu mẫu tự dựng, khung kết quả, hộp thoại xác nhận, thông báo nhỏ
  lib/
    catalog.js       # Danh mục chức năng, mô tả ô nhập, dữ liệu mẫu
    compose.js       # Điểm vào duy nhất: AI nếu đã kết nối, ngược lại soạn theo mẫu
    aiClient.js      # Gọi /api/* từ trình duyệt
    templates/       # Bộ soạn theo mẫu cho 6 loại nội dung + kho kiến thức tuyên truyền
    textTools.js     # Biên tập theo quy tắc, gợi ý từ ngữ nhẹ nhàng
    storage.js       # localStorage (bọc try/catch)
    exporters.js     # Sao chép, tải .txt (UTF-8 có BOM), in
tests/               # Kiểm thử bộ soạn và hàm máy chủ (node --test)
```

Đổi nhà cung cấp AI: chỉ sửa `api/generate.js`; giao diện và `compose.js` giữ nguyên.

## 🚀 Chạy ở máy

```bash
cd tro-ly-truyen-thong
npm install
npm run dev     # http://localhost:5174 — chế độ soạn theo mẫu (vite không chạy /api)
npm test        # kiểm thử
vercel dev      # nếu muốn chạy cả /api với biến môi trường (cần Vercel CLI)
```

## 🔒 An toàn nội dung

- Không có thông tin mặc định về trường, giáo viên; dữ liệu mẫu ghi rõ “(mẫu)” và là thông tin hư cấu.
- Không yêu cầu nhập thông tin nhạy cảm của trẻ; ô nhập có lời nhắc.
- Bộ soạn không tự bịa ngày giờ, số liệu, thành tích; thiếu thông tin quan trọng thì để `[chỗ trống]`.
- Nội dung sức khỏe không chẩn đoán, không nêu thuốc; luôn khuyến khích hỏi ý kiến cán bộ y tế.
