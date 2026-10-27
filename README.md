# Bản đồ thời cơ

Mini board game ôn tập lịch sử Việt Nam 1939–1945, thiết kế cho một quản trò điều khiển trên laptop/máy chiếu và 2–6 nhóm chơi.

## Chạy game

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Bản build:

```bash
npm run build
npm run start
```

## Luật chơi đang dùng

- 18 địa bàn, chia 3 khu vực × 6 địa bàn; mỗi địa bàn gắn một câu hỏi.
- Quản trò chọn số nhóm từ 2 đến 6 trước khi bắt đầu; tên nhóm cố định theo số thứ tự.
- Đội nói A/B/C/D, quản trò chọn phương án và chốt; ứng dụng tự kiểm tra đáp án.
- Trả lời chính đúng: +100 điểm và chiếm địa bàn. Trả lời sai/hết giờ: 0 điểm và mở cướp quyền.
- Cướp đúng: +60 ở lượt đầu, +40 ở lượt hai và chiếm địa bàn. Đáp án sai đã chọn bị khóa.
- Sở hữu ít nhất một địa bàn trong cả ba khu vực: +50 điểm Hành trình lịch sử, một lần mỗi đội.
- Mỗi đội có một lần Chớp thời cơ trước khi chọn địa bàn, nhận ngẫu nhiên Trinh sát, Tiếp viện (+10 giây) hoặc Quyết đoán.
- Sau câu 6, 12 và 18 có một Biến cố lịch sử 45 giây mở cho tất cả đội; đội đúng đầu tiên nhận +50 điểm. Đồng hồ chỉ để tham khảo, host chủ động chốt hoặc bỏ qua.
- Địa bàn đã chiếm hoặc đã hỏi không chọn lại. Địa bàn hỏi sai mà không ai cướp được sẽ khóa ở trạng thái “Đã hỏi”.
- Lượt chuyển cố định sau mỗi câu, kể cả khi nhóm hiện tại trả lời sai.
- Xếp hạng: điểm → số địa bàn → số địa bàn ở khu vực thứ ba; nếu vẫn bằng thì đồng hạng.
- Có hoàn tác nhiều bước và tự khôi phục trận sau khi refresh.

Thời lượng không giới hạn chặt; một trận đủ 18 câu và 3 Biến cố thường dài khoảng 18–25 phút. Quản trò có thể kết thúc sớm bằng nút **Kết thúc trận**.

Trang `/huong-dan` là một slide 16:9 để quản trò giới thiệu luật trước khi bắt đầu.

## Ảnh minh họa

22 ảnh nằm trong `public/images`:

- 1 hero
- 3 nền khu vực
- 18 địa bàn

Ảnh được sinh sẵn theo phong cách gouache nhẹ, không gọi Gemini lúc chơi. Game vẫn chạy được nếu thiếu ảnh nhờ nền màu dự phòng.

### Sinh lại ảnh

Điền key vào `.env`:

```env
GEMINI_API_KEY=...
```

Sau đó:

```bash
npm run images:generate -- --dry-run
npm run images:generate -- --only=hero --force
npm run images:generate
```

Script dùng model `gemini-nano-banana-2.1` (có fallback `gemini-3.1-flash-lite-image`), xuất WebP 1K, bỏ qua ảnh đã có và giới hạn tổng request để tránh vượt quota. `.env` đã nằm trong `.gitignore`; key không được dùng trong mã client.

Nếu cần đổi model:

```env
GEMINI_IMAGE_MODEL=gemini-3.1-flash-lite-image
```

Prompt nằm trong `scripts/image-manifest.mjs`; không còn logo nhóm AI. Ảnh chỉ mang tính minh họa, không phải bản đồ hay tư liệu lịch sử.

## Đáp án nhanh cho quản trò

| Câu | Địa bàn | Đáp án | Nguồn |
|---:|---|---|---|
| 1 | Bối cảnh 1939 | B | tr. 92 (PDF tr. 1) |
| 2 | Bà Điểm 1939 | B | tr. 93–94 (PDF tr. 2–3) |
| 3 | Đình Bảng 1940 | B | tr. 94 (PDF tr. 3) |
| 4 | Cao Bằng 1941 | A | tr. 95 (PDF tr. 4) |
| 5 | Hội nghị Tám | B | tr. 95–97 (PDF tr. 4–6) |
| 6 | Tuyên ngôn Việt Minh | A | tr. 100 (PDF tr. 9) |
| 7 | Bắc Sơn | A | tr. 98–99 (PDF tr. 7–8) |
| 8 | Nam Kỳ | A | tr. 99 (PDF tr. 8) |
| 9 | Đô Lương | A | tr. 99 (PDF tr. 8) |
| 10 | Côn Đảo 1942 | A | tr. 100 (PDF tr. 9) |
| 11 | Đề cương Văn hóa | A | tr. 101 (PDF tr. 10) |
| 12 | Giải phóng quân | A | tr. 104 (PDF tr. 13) |
| 13 | Nhật đảo chính | A | tr. 105–106 (PDF tr. 14–15) |
| 14 | Chỉ thị tháng Ba | A | tr. 106 (PDF tr. 15) |
| 15 | Hội nghị Quân sự | A | tr. 107 (PDF tr. 16) |
| 16 | Khu giải phóng | A | tr. 107 (PDF tr. 16) |
| 17 | Quân lệnh số 1 | A | tr. 111–112 (PDF tr. 20–21) |
| 18 | Mùa thu độc lập | A | tr. 114–118 (PDF tr. 23–27) |

Lưu ý theo đúng giáo trình: Hội nghị quân sự cách mạng Bắc Kỳ ghi ngày **15/5/1945**; tài liệu chỉ ghi Việt Minh thành lập **tháng 5/1941**, không ghi ngày 19/5/1941.

## Kiểm thử

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

E2E dùng Playwright với kênh Chromium. Nếu máy chưa có trình duyệt:

```bash
npx playwright install chromium
```

## Cấu trúc chính

```text
src/app/                 trang và giao diện gốc
src/components/          màn hình thiết lập, bàn chơi, câu hỏi, kết quả
src/data/                18 câu hỏi, 18 địa bàn, 3 khu vực, màu nhóm
src/lib/                 luật chơi, tính điểm, xếp hạng, lưu trữ
scripts/                 trích xuất PDF và sinh ảnh Gemini
public/images/           asset ảnh tĩnh
tests/                   unit test luật chơi
e2e/                     smoke test luồng chơi
```

Không có backend, database, đăng nhập hay multiplayer. Trạng thái trận lưu trong `localStorage` của trình duyệt.
