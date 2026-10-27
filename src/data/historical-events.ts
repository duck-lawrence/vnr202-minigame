import type { HistoricalEvent } from "@/types/game";

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "event-06-chuyen-huong",
    checkpoint: 6,
    type: "order",
    title: "Chuyển hướng chiến lược",
    prompt: "Sắp xếp các mốc sau theo đúng trình tự thời gian.",
    items: [
      { id: "notice-1939", text: "Trung ương ra thông báo về chuyển hướng chỉ đạo chiến lược" },
      { id: "conference-1939", text: "Hội nghị Trung ương tại Bà Điểm" },
      { id: "return-1941", text: "Nguyễn Ái Quốc trở về Tổ quốc" },
      { id: "conference-8", text: "Hội nghị Trung ương 8 do Nguyễn Ái Quốc chủ trì" },
    ],
    correctOrder: ["notice-1939", "conference-1939", "return-1941", "conference-8"],
    explanation:
      "Chuỗi sự kiện từ tháng 9/1939 đến tháng 5/1941 từng bước hoàn chỉnh chủ trương đặt giải phóng dân tộc lên hàng đầu.",
    sourcePage: "tr. 93, 95–98 (PDF tr. 2, 4–7)",
    points: 50,
  },
  {
    id: "event-12-xay-luc-luong",
    checkpoint: 12,
    type: "matching",
    title: "Xây dựng lực lượng",
    prompt: "Ghép mỗi sự kiện với dấu ấn lịch sử tương ứng.",
    leftItems: [
      { id: "tw8", text: "Hội nghị Trung ương 8" },
      { id: "bac-son", text: "Khởi nghĩa Bắc Sơn" },
      { id: "culture", text: "Đề cương văn hóa Việt Nam" },
      { id: "army", text: "Đội Việt Nam Tuyên truyền Giải phóng quân" },
    ],
    rightItems: [
      { id: "armed-task", text: "Chuẩn bị khởi nghĩa vũ trang là nhiệm vụ trung tâm" },
      { id: "guerilla", text: "Đội du kích Bắc Sơn được thành lập" },
      { id: "principles", text: "Dân tộc, khoa học và đại chúng" },
      { id: "cao-bang", text: "Ra đời ngày 22/12/1944 tại Cao Bằng" },
    ],
    correctPairs: {
      tw8: "armed-task",
      "bac-son": "guerilla",
      culture: "principles",
      army: "cao-bang",
    },
    explanation:
      "Đường lối, lực lượng chính trị, văn hóa và lực lượng vũ trang được chuẩn bị đồng bộ cho khởi nghĩa.",
    sourcePage: "tr. 97–104 (PDF tr. 6–13)",
    points: 50,
  },
  {
    id: "event-18-nguyen-tac",
    checkpoint: 18,
    type: "multi-select",
    title: "Chớp đúng thời cơ",
    prompt: "Chọn đúng ba nguyên tắc chỉ đạo Tổng khởi nghĩa được Hội nghị toàn quốc của Đảng xác định.",
    options: [
      { id: "focus", text: "Tập trung" },
      { id: "united", text: "Thống nhất" },
      { id: "timely", text: "Kịp thời" },
      { id: "gradual", text: "Tuần tự" },
      { id: "scattered", text: "Phân tán" },
      { id: "defensive", text: "Phòng thủ" },
    ],
    correctOptionIds: ["focus", "united", "timely"],
    explanation:
      "Hội nghị toàn quốc của Đảng ngày 14–15/8/1945 xác định ba nguyên tắc chỉ đạo khởi nghĩa là tập trung, thống nhất và kịp thời.",
    sourcePage: "tr. 112 (PDF tr. 21)",
    points: 50,
  },
];

export const HISTORICAL_EVENT_BY_ID = Object.fromEntries(
  HISTORICAL_EVENTS.map((event) => [event.id, event]),
);

export const HISTORICAL_EVENT_BY_CHECKPOINT = Object.fromEntries(
  HISTORICAL_EVENTS.map((event) => [event.checkpoint, event]),
);
