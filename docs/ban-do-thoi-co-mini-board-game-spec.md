# ĐẶC TẢ MINI BOARD GAME LỊCH SỬ — BẢN ĐỒ THỜI CƠ

## 1. Vai trò và mục tiêu

Bạn là AI coding agent chịu trách nhiệm khảo sát codebase hiện có, đọc tài liệu lịch sử được cung cấp và triển khai một MVP web game dùng trong buổi thuyết trình trên lớp.

Tên làm việc: **Bản đồ thời cơ**.

Mục tiêu:
- Tạo một mini board game ôn tập lịch sử theo hình thức chiếm địa bàn.
- Hỗ trợ 5–6 nhóm chơi.
- Một quản trò điều khiển toàn bộ trò chơi trên máy tính kết nối máy chiếu.
- Một trận kéo dài khoảng 10–15 phút.
- Toàn bộ giao diện và nội dung hiển thị cho người chơi phải bằng **tiếng Việt**.
- Giữ MVP nhỏ, dễ dùng, ít lỗi trong lúc thuyết trình; không xây hệ thống phức tạp khi chưa có nhu cầu.

## 2. Bắt buộc đọc tài liệu trước khi tạo câu hỏi

1. Kiểm tra thư mục `/docs` trong dự án để tìm file PDF giáo trình được người dùng cung cấp. Tên file có thể khác nhau; hãy tìm các file PDF liên quan đến lịch sử Đảng/phong trào giải phóng dân tộc 1930–1945/Cách mạng Tháng Tám.
2. Đọc và trích xuất nội dung PDF trước khi tạo ngân hàng câu hỏi. Nếu công cụ hiện có không đọc PDF trực tiếp được, hãy dùng công cụ hoặc thư viện sẵn có trong môi trường dự án để trích xuất văn bản. Không tự bịa số trang hoặc nội dung.
3. Chủ đề dự kiến: phong trào giải phóng dân tộc 1939–1945, chủ trương chiến lược, cao trào kháng Nhật cứu nước, các hoạt động chuẩn bị tổng khởi nghĩa và Cách mạng Tháng Tám năm 1945. Chỉ sử dụng chủ đề nào được tài liệu hỗ trợ.
4. Ưu tiên cách diễn đạt, thuật ngữ và mốc thời gian theo giáo trình. Nếu giáo trình không đủ căn cứ cho một chi tiết, không tự trình bày suy đoán thành sự thật.
5. Mỗi câu hỏi phải có đáp án đúng, lời giải ngắn và nguồn trang nếu xác minh được. Lưu ý số trang in trên tài liệu có thể khác số trang của PDF.
6. Trước khi hoàn tất, rà soát tất cả câu hỏi để bảo đảm chỉ có một đáp án đúng rõ ràng, các lựa chọn nhiễu hợp lý nhưng không gây nhập nhằng, và lời giải phù hợp tài liệu.
7. Không cần dùng web hoặc nguồn ngoài trừ khi người dùng yêu cầu. Nếu có sử dụng nguồn ngoài, phải phân biệt rõ với thông tin lấy từ giáo trình và ghi nguồn.

Nếu không tìm thấy PDF hoặc không thể đọc được, hãy báo rõ trong kết quả công việc và tạo khung dữ liệu/luật chơi trước; không tự tạo câu hỏi lịch sử rồi khẳng định chúng lấy từ giáo trình.

## 3. Trải nghiệm trò chơi

### 3.1. Bàn chơi

- Tạo một bàn chơi trực quan gồm **12 địa bàn**, chia thành **3 khu vực chủ đề**, mỗi khu vực 4 địa bàn.
- Mỗi địa bàn gắn với một câu hỏi.
- Đây là cấu trúc game hóa để chơi trên lớp, không phải bản đồ lịch sử chính xác. Không thể hiện các địa bàn giả lập như dữ kiện địa lý hoặc sự kiện lịch sử thật.
- Địa bàn có tối thiểu các trạng thái:
  - Chưa bị chiếm.
  - Đã bị một nhóm chiếm.
- Dùng màu nhóm để phân biệt chủ sở hữu địa bàn. Kèm tên/nhãn hoặc biểu tượng chữ để vẫn phân biệt được khi máy chiếu hiển thị màu không tốt.
- Có thể dùng tên địa bàn theo các chủ đề lịch sử trong giáo trình. Không gán sự kiện cho địa điểm cụ thể nếu tài liệu không hỗ trợ.

### 3.2. Nhóm chơi

- Hỗ trợ 5 hoặc 6 nhóm.
- Cho phép sửa tên nhóm trước khi bắt đầu.
- Mỗi nhóm có màu riêng, điểm số và số địa bàn đã chiếm.
- Không yêu cầu người chơi đăng nhập, không cần điện thoại cá nhân.
- Quản trò là người xác nhận câu trả lời và điều khiển lượt.

### 3.3. Luồng lượt chơi mặc định

1. Trận bắt đầu từ màn hình thiết lập.
2. Quản trò nhập/chỉnh tên nhóm rồi nhấn **Bắt đầu**.
3. Trên bản đồ, quản trò chọn một địa bàn chưa bị chiếm.
4. Ứng dụng hiển thị câu hỏi trắc nghiệm với 4 lựa chọn A/B/C/D.
5. Nhóm đến lượt có tối đa 15 giây để thảo luận và trả lời miệng.
6. Quản trò bấm một trong các nút: **Trả lời đúng**, **Trả lời sai**, hoặc **Hết giờ**.
7. Nếu trả lời đúng:
   - Nhóm đang lượt được +100 điểm.
   - Nhóm đó chiếm địa bàn.
   - Hiển thị đáp án đúng và giải thích ngắn.
8. Nếu trả lời sai/hết giờ:
   - Nhóm không bị trừ điểm.
   - Quản trò có thể mở cơ hội cướp quyền.
9. Cướp quyền:
   - Quản trò chọn nhóm cướp quyền được trả lời trước.
   - Mỗi câu có tối đa 2 lượt cướp quyền.
   - Mỗi lượt cướp có tối đa 5 giây để nhóm phản hồi miệng.
   - Quản trò bấm đúng/sai.
   - Nhóm cướp đúng được +60 điểm và chiếm địa bàn.
   - Nhóm cướp sai không bị trừ điểm; có thể cho nhóm khác cướp nếu chưa đạt giới hạn.
10. Nếu không có nhóm chiếm được địa bàn, địa bàn giữ trạng thái chưa bị chiếm.
11. Sau khi câu hỏi kết thúc, quản trò bấm **Câu tiếp theo**. Chuyển nhóm theo vòng cố định, kể cả khi nhóm hiện tại trả lời sai. Không loại nhóm khỏi trò chơi.
12. Không cho phép chiếm lại địa bàn đã bị chiếm; địa bàn đã chiếm không xuất hiện trong lựa chọn câu tiếp theo.
13. Trận kết thúc khi đã dùng hết câu hỏi khả dụng, hết thời gian, hoặc quản trò bấm **Kết thúc trận**.

### 3.4. Điểm số mặc định

- Trả lời đúng câu chính: **+100 điểm** và chiếm địa bàn.
- Cướp quyền trả lời đúng: **+60 điểm** và chiếm địa bàn.
- Sai/hết giờ: **0 điểm**.
- Chiếm đủ 4 địa bàn trong cùng một khu vực: **+50 điểm thưởng** cho mỗi khu vực hoàn thành. Mỗi nhóm chỉ nhận thưởng một lần cho mỗi khu vực.
- Điểm thưởng khu vực được cộng ngay khi nhóm chiếm địa bàn thứ tư của khu vực đó.
- Điểm và quyền sở hữu địa bàn là hai dữ liệu riêng.
- Không dùng điểm âm.

### 3.5. Xếp hạng

Sắp xếp theo:
1. Tổng điểm cao nhất.
2. Nếu bằng điểm, nhóm chiếm nhiều địa bàn hơn.
3. Nếu vẫn bằng nhau, nhóm có nhiều địa bàn hơn trong khu vực thứ ba.
4. Nếu vẫn hòa, hiển thị đồng hạng hoặc cho quản trò dùng câu hỏi phụ; không cần xây cơ chế tie-break tự động phức tạp.

### 3.6. Luật bổ sung — agent được quyền đề xuất có kiểm soát

Bạn **được phép đề xuất hoặc thêm một số luật nhỏ** để tránh game nhàm chán, nhưng phải đáp ứng tất cả điều kiện sau:
- Không làm tăng đáng kể độ phức tạp của code hoặc thao tác của quản trò.
- Không cần backend, đăng nhập, nhiều thiết bị, realtime, database hoặc thư viện game chuyên dụng.
- Không làm trận đấu vượt quá thời lượng mục tiêu 10–15 phút.
- Không khiến nhóm dẫn đầu bị nhắm mục tiêu liên tục hoặc khiến nhóm yếu không còn động lực chơi.
- Không biến game thành trò chơi may rủi; trọng tâm vẫn là kiến thức lịch sử.
- Ưu tiên các biến thể dễ triển khai như một câu “địa bàn trọng điểm” được thưởng thêm, một câu hỏi phụ cuối trận, hoặc thay đổi nhỏ về lượt/điểm.
- Tối đa thêm **1–2 cơ chế phụ**. Không thêm hàng loạt thẻ, tài nguyên, vật phẩm, nâng cấp, hệ thống chiến đấu hoặc cây công nghệ.
- Trước khi triển khai luật mới, ghi ngắn gọn luật đề xuất, lý do, ảnh hưởng đến thời lượng và độ phức tạp. Giữ luật mặc định ở trên nếu lợi ích không rõ ràng.
- Luật phải được giải thích rõ bằng tiếng Việt trên giao diện hoặc trong hướng dẫn quản trò.

## 4. Yêu cầu giao diện

### 4.1. Màn hình thiết lập

- Tên game và hướng dẫn ngắn bằng tiếng Việt.
- Cho phép chọn 5 hoặc 6 nhóm.
- Cho phép chỉnh tên nhóm.
- Màu nhóm được gán sẵn, dễ phân biệt.
- Nút **Bắt đầu**.
- Nếu bộ câu hỏi không đủ để chơi, hiển thị cảnh báo rõ ràng.

### 4.2. Màn hình chơi

Ưu tiên một màn hình quản trò duy nhất, phù hợp máy tính và máy chiếu. Có thể chia thành:
- Khu vực bản đồ 12 địa bàn.
- Bảng điểm các nhóm.
- Nhóm hiện tại.
- Số câu đã chơi/số câu còn lại.
- Nút **Chọn địa bàn** hoặc thao tác nhấn trực tiếp vào địa bàn chưa bị chiếm.
- Khu vực câu hỏi và các lựa chọn.
- Đồng hồ 15 giây cho câu chính và 5 giây cho lượt cướp quyền; có thể để quản trò bắt đầu/chốt thủ công để tránh lỗi timing.
- Các nút điều khiển lớn, nhãn dễ hiểu và tránh thao tác nhầm.
- Đáp án đúng và lời giải sau khi chốt câu.
- Điều khiển cướp quyền.
- Nút **Câu tiếp theo**, **Hoàn tác**, và **Kết thúc trận**.
- Xác nhận trước khi kết thúc trận hoặc chơi lại nếu thao tác có thể làm mất tiến trình.

### 4.3. Màn hình kết thúc

- Hiển thị nhóm chiến thắng, bảng xếp hạng, tổng điểm và số địa bàn.
- Có thể hiển thị số địa bàn theo từng khu vực.
- Có nút **Chơi lại** và trở về màn hình thiết lập.

### 4.4. Thiết kế và khả năng sử dụng

- Toàn bộ nội dung game hiển thị bằng **tiếng Việt**.
- Giao diện hiện đại, có cảm giác board game/chiến lược, nhưng không hy sinh độ rõ ràng.
- Ưu tiên chữ lớn, tương phản cao, dễ đọc từ máy chiếu.
- Responsive tối thiểu cho laptop và màn hình máy chiếu; không cần tối ưu cho điện thoại người chơi.
- Không dùng hiệu ứng chuyển động dài hoặc âm thanh bắt buộc.
- Hiệu ứng chiếm địa bàn có thể ngắn, dễ nhận biết và không cản thao tác quản trò.
- Không để thông tin đáp án đúng lộ ra trước khi quản trò chốt kết quả.
- Không sử dụng biểu tượng/emoji trong code comment. Comment nếu cần thì viết ngắn gọn, có ích và không đánh số.

## 5. Cấu trúc dữ liệu gợi ý

Điều chỉnh cho phù hợp codebase, nhưng tránh overengineering.

### Question

- `id`: mã duy nhất.
- `territoryId`: địa bàn liên kết.
- `topic`: chủ đề.
- `prompt`: nội dung câu hỏi.
- `options`: đúng 4 lựa chọn A/B/C/D.
- `correctOptionId`: đáp án đúng.
- `explanation`: giải thích ngắn.
- `sourcePage`: trang nguồn nếu xác minh được.

### Team

- `id`
- `name`
- `color`
- `score`
- Danh sách địa bàn có thể được suy ra từ dữ liệu địa bàn, không cần lưu trùng nếu không cần.

### Territory

- `id`
- `name`
- `regionId`
- `questionId`
- `ownerTeamId` — null khi chưa bị chiếm.

### Region

- `id`
- `name`
- `description` — tùy chọn.

### GameState

- `teams`
- `territories`
- `currentTeamIndex`
- `currentQuestionId`
- `currentTerritoryId`
- `phase`
- `stealTeamId`
- `stealAttempts`
- `usedQuestionIds`
- Trạng thái thưởng khu vực đã nhận để tránh cộng điểm thưởng nhiều lần.

Có thể dùng `useReducer` để quản lý chuyển trạng thái vì các hành động có quan hệ với nhau. Không cần Redux, Zustand, server actions, API routes hay database nếu không có lý do cụ thể.

## 6. Kỹ thuật và cấu trúc dự án

- Sử dụng framework, package manager, quy ước và phiên bản dependency hiện có của dự án.
- Nếu dự án chưa có code, dùng Next.js App Router + TypeScript.
- Ưu tiên CSS hiện có hoặc Tailwind nếu đã được cấu hình. Không cài thư viện UI/game lớn chỉ để tạo vài thành phần.
- Dữ liệu câu hỏi và bản đồ để trong file tĩnh, ví dụ `src/data/questions.ts`, `src/data/territories.ts`, `src/data/regions.ts`.
- Có thể tổ chức components và logic như sau, nhưng không bắt buộc nếu cấu trúc dự án đang có quy ước khác:

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    setup-panel.tsx
    game-board.tsx
    territory-card.tsx
    question-panel.tsx
    answer-result.tsx
    scoreboard.tsx
    final-results.tsx
  data/
    questions.ts
    territories.ts
    regions.ts
  lib/
    game-rules.ts
    scoring.ts
  types/
    game.ts
```

- Giữ logic tính điểm và luật chơi tách khỏi JSX để dễ kiểm thử.
- Chặn các hành động không hợp lệ: chọn địa bàn đã chiếm, cộng điểm hai lần, chiếm địa bàn hai lần, nhận thưởng khu vực lặp lại, vượt quá số lượt cướp.
- Có thể dùng `localStorage` để khôi phục trận nếu trang refresh, nhưng chỉ thêm nếu triển khai đơn giản và an toàn; phải có nút bắt đầu trận mới/xóa trận cũ rõ ràng. Không lưu dữ liệu nhạy cảm.
- Không cần triển khai backend hoặc xác thực.
- Không cần tự động tạo file PDF hay xuất báo cáo.

## 7. Kiểm thử và tiêu chí nghiệm thu

Trước khi hoàn thành:
- Chạy lint, typecheck và build theo các script có sẵn của dự án.
- Sửa lỗi do phần triển khai gây ra.
- Kiểm tra game hoạt động với cả 5 và 6 nhóm.
- Kiểm tra luồng trả lời đúng, trả lời sai, hết giờ, cướp quyền đúng/sai, hết lượt cướp.
- Kiểm tra điểm thưởng khu vực chỉ cộng một lần cho mỗi nhóm/khu vực.
- Kiểm tra địa bàn đã chiếm không thể bị chiếm lại.
- Kiểm tra thứ tự lượt vẫn đúng sau khi câu trả lời chính sai.
- Kiểm tra hoàn tác không làm sai điểm hoặc trạng thái địa bàn.
- Kiểm tra kết thúc trận và chơi lại.
- Kiểm tra không có câu hỏi thiếu đáp án/lời giải hoặc có ID trùng.
- Kiểm tra giao diện ở kích thước laptop và máy chiếu.
- Không tuyên bố test/build thành công nếu chưa chạy thực tế.

## 8. Thứ tự thực hiện

1. Khảo sát codebase, xem `package.json`, cấu trúc thư mục và quy ước dự án.
2. Đọc PDF trong `/docs`, trích xuất nội dung liên quan và xây bộ câu hỏi có nguồn.
3. Viết một kế hoạch ngắn về kiến trúc, luật mặc định và tối đa 1–2 luật phụ đề xuất.
4. Triển khai types, dữ liệu tĩnh và hàm luật/tính điểm.
5. Triển khai giao diện thiết lập, chơi và kết thúc.
6. Thêm xử lý lỗi thao tác, hoàn tác và trạng thái bất hợp lệ.
7. Chạy kiểm thử, lint, typecheck, build.
8. Tổng kết những gì đã làm, file quan trọng, cách chạy game, kết quả kiểm thử, luật phụ đã thêm (nếu có), và các giới hạn còn lại.

## 9. Ranh giới phạm vi

Không tự mở rộng thành:
- Multiplayer online hoặc phòng chơi nhiều thiết bị.
- Đăng nhập, tài khoản, phân quyền.
- Backend, database, WebSocket hoặc hệ thống quản trị nội dung.
- Hệ thống tài nguyên phức tạp, nhiều loại thẻ, vật phẩm, nâng cấp.
- Mô phỏng chiến tranh hoặc địa lý lịch sử không có căn cứ trong giáo trình.
- Cơ chế thưởng/phạt làm lu mờ việc ôn tập kiến thức.

Nếu có ý tưởng mới, hãy ưu tiên trải nghiệm đơn giản, dễ điều khiển, hữu ích trong buổi thuyết trình và có thể hoàn thành nhanh.
