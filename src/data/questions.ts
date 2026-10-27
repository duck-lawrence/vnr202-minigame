import type { Question } from "@/types/game";

const RAW_QUESTIONS: Question[] = [
  {
    id: "q01",
    territoryId: "boi-canh-1939",
    topic: "Bối cảnh lịch sử",
    prompt:
      "Tháng 9/1940, quân phiệt Nhật tiến vào Đông Dương đã đẩy nhân dân ta vào tình cảnh nào?",
    options: [
      { id: "A", text: "Chỉ chịu ách thống trị của phát xít Nhật" },
      { id: "B", text: "Chịu cảnh “một cổ hai tròng” Pháp – Nhật" },
      { id: "C", text: "Được hưởng quyền tự trị hoàn toàn" },
      { id: "D", text: "Thoát khỏi ách thống trị của thực dân Pháp" },
    ],
    correctOptionId: "B",
    explanation:
      "Quân phiệt Nhật vào Đông Dương, thực dân Pháp đầu hàng và câu kết với Nhật. Nhân dân ta chịu cảnh “một cổ hai tròng” Pháp – Nhật.",
    sourcePage: "tr. 92 (PDF tr. 1)",
  },
  {
    id: "q02",
    territoryId: "ba-diem-1939",
    topic: "Chủ trương chiến lược",
    prompt:
      "Hội nghị Ban Chấp hành Trung ương Đảng tháng 11/1939 tại Bà Điểm (Hóc Môn, Gia Định) đặt nhiệm vụ nào lên hàng đầu?",
    options: [
      { id: "A", text: "Cải cách ruộng đất" },
      { id: "B", text: "Giải phóng dân tộc" },
      { id: "C", text: "Phát triển kinh tế tư bản" },
      { id: "D", text: "Xây dựng chính quyền tự trị" },
    ],
    correctOptionId: "B",
    explanation:
      "Hội nghị chủ trương đặt nhiệm vụ giải phóng dân tộc lên hàng đầu, tạm gác khẩu hiệu cách mạng ruộng đất và thành lập Mặt trận dân tộc thống nhất phản đế Đông Dương.",
    sourcePage: "tr. 93–94 (PDF tr. 2–3)",
  },
  {
    id: "q03",
    territoryId: "dinh-bang-1940",
    topic: "Chủ trương chiến lược",
    prompt:
      "Hội nghị cán bộ Trung ương tháng 11/1940 họp tại địa điểm nào?",
    options: [
      { id: "A", text: "Bà Điểm (Hóc Môn, Gia Định)" },
      { id: "B", text: "Đình Bảng (Từ Sơn, Bắc Ninh)" },
      { id: "C", text: "Võng La (Đông Anh, Phúc Yên)" },
      { id: "D", text: "Tân Trào (Tuyên Quang)" },
    ],
    correctOptionId: "B",
    explanation:
      "Tài liệu ghi Hội nghị cán bộ Trung ương tháng 11/1940 họp tại làng Đình Bảng (Từ Sơn, Bắc Ninh), cử Ban Chấp hành Trung ương mới.",
    sourcePage: "tr. 94 (PDF tr. 3)",
  },
  {
    id: "q04",
    territoryId: "cao-bang-1941",
    topic: "Lãnh đạo cách mạng",
    prompt:
      "Ngày 28/1/1941, lãnh tụ Nguyễn Ái Quốc về nước và dừng chân ở đâu?",
    options: [
      { id: "A", text: "Cao Bằng" },
      { id: "B", text: "Lạng Sơn" },
      { id: "C", text: "Tuyên Quang" },
      { id: "D", text: "Nghệ An" },
    ],
    correctOptionId: "A",
    explanation:
      "Sau 30 năm hoạt động ở nước ngoài, Nguyễn Ái Quốc về nước, dừng chân ở Cao Bằng để trực tiếp lãnh đạo cách mạng Việt Nam.",
    sourcePage: "tr. 95 (PDF tr. 4)",
  },
  {
    id: "q05",
    territoryId: "hoi-nghi-tam",
    topic: "Hội nghị Trung ương 8",
    prompt:
      "Hội nghị lần thứ tám Ban Chấp hành Trung ương Đảng (tháng 5/1941) quyết định thành lập tổ chức nào?",
    options: [
      { id: "A", text: "Mặt trận Liên Việt" },
      { id: "B", text: "Mặt trận Việt Minh" },
      {
        id: "C",
        text: "Mặt trận Dân tộc thống nhất phản đế Đông Dương",
      },
      { id: "D", text: "Hội Liên hiệp Quốc dân Việt Nam" },
    ],
    correctOptionId: "B",
    explanation:
      "Hội nghị TW8 tại Cao Bằng do Nguyễn Ái Quốc chủ trì đã thành lập Mặt trận Việt Minh, bầu Trường Chinh làm Tổng Bí thư và xác định chuẩn bị khởi nghĩa vũ trang là nhiệm vụ trung tâm.",
    sourcePage: "tr. 95–97 (PDF tr. 4–6)",
  },
  {
    id: "q06",
    territoryId: "tuyen-ngon-viet-minh",
    topic: "Việt Minh",
    prompt: "Ngày 25/10/1941, Việt Minh công bố văn kiện nào?",
    options: [
      { id: "A", text: "Tuyên ngôn của Việt Minh" },
      { id: "B", text: "Chỉ thị Nhật – Pháp bắn nhau" },
      { id: "C", text: "Quân lệnh số 1" },
      { id: "D", text: "Đề cương văn hóa Việt Nam" },
    ],
    correctOptionId: "A",
    explanation:
      "Ngày 25/10/1941, Việt Minh công bố Tuyên ngôn, nêu rõ Việt Nam Độc lập Đồng minh ra đời.",
    sourcePage: "tr. 100 (PDF tr. 9)",
  },
  {
    id: "q07",
    territoryId: "bac-son",
    topic: "Đấu tranh vũ trang",
    prompt: "Cuộc khởi nghĩa Bắc Sơn nổ ra ngày nào?",
    options: [
      { id: "A", text: "27/9/1940" },
      { id: "B", text: "23/11/1940" },
      { id: "C", text: "13/1/1941" },
      { id: "D", text: "28/1/1941" },
    ],
    correctOptionId: "A",
    explanation:
      "Khởi nghĩa Bắc Sơn nổ ra ngày 27/9/1940. Đội du kích Bắc Sơn được thành lập, mở đầu bước phát triển của đấu tranh vũ trang.",
    sourcePage: "tr. 98–99 (PDF tr. 7–8)",
  },
  {
    id: "q08",
    territoryId: "nam-ky",
    topic: "Đấu tranh vũ trang",
    prompt: "Khởi nghĩa Nam Kỳ nổ ra vào thời điểm nào?",
    options: [
      { id: "A", text: "Đêm 23/11/1940" },
      { id: "B", text: "Ngày 27/9/1940" },
      { id: "C", text: "Ngày 13/1/1941" },
      { id: "D", text: "Ngày 28/1/1941" },
    ],
    correctOptionId: "A",
    explanation:
      "Khởi nghĩa Nam Kỳ nổ ra đêm 23/11/1940. Do lệnh hoãn chưa đến nơi, cuộc khởi nghĩa vẫn bùng nổ và bị thực dân Pháp đàn áp khốc liệt.",
    sourcePage: "tr. 99 (PDF tr. 8)",
  },
  {
    id: "q09",
    territoryId: "do-luong",
    topic: "Đấu tranh vũ trang",
    prompt: "Binh biến Đô Lương (13/1/1941) do ai chỉ huy?",
    options: [
      { id: "A", text: "Đội Cung" },
      { id: "B", text: "Nguyễn Ái Quốc" },
      { id: "C", text: "Trường Chinh" },
      { id: "D", text: "Võ Nguyên Giáp" },
    ],
    correctOptionId: "A",
    explanation:
      "Binh biến Đô Lương (Nghệ An) ngày 13/1/1941 do Đội Cung chỉ huy, nhanh chóng bị địch đàn áp.",
    sourcePage: "tr. 99 (PDF tr. 8)",
  },
  {
    id: "q10",
    territoryId: "con-dao-1942",
    topic: "Người chiến sĩ cộng sản",
    prompt:
      "Đồng chí Lê Hồng Phong hy sinh ngày 6/9/1942 tại đâu?",
    options: [
      { id: "A", text: "Côn Đảo" },
      { id: "B", text: "Cao Bằng" },
      { id: "C", text: "Hóc Môn" },
      { id: "D", text: "Tân Trào" },
    ],
    correctOptionId: "A",
    explanation:
      "Sau khi nhiều đồng chí bị xử bắn ngày 26/8/1941, đồng chí Lê Hồng Phong hy sinh tại Côn Đảo ngày 6/9/1942.",
    sourcePage: "tr. 100 (PDF tr. 9)",
  },
  {
    id: "q11",
    territoryId: "de-cuong-van-hoa",
    topic: "Văn hóa cách mạng",
    prompt:
      "Đề cương văn hóa Việt Nam (1943) xác định xây dựng nền văn hóa mới theo những nguyên tắc nào?",
    options: [
      { id: "A", text: "Dân tộc, khoa học, đại chúng" },
      { id: "B", text: "Dân tộc, hiện đại, nhân văn" },
      { id: "C", text: "Khoa học, công nghệ, hội nhập" },
      { id: "D", text: "Đại chúng, tự do, cá nhân" },
    ],
    correctOptionId: "A",
    explanation:
      "Năm 1943, Đảng công bố Đề cương văn hóa Việt Nam, xác định nền văn hóa mới theo ba nguyên tắc: dân tộc, khoa học, đại chúng.",
    sourcePage: "tr. 101 (PDF tr. 10)",
  },
  {
    id: "q12",
    territoryId: "giai-phong-quan",
    topic: "Lực lượng vũ trang",
    prompt:
      "Đội Việt Nam Tuyên truyền Giải phóng quân ra đời ngày 22/12/1944 tại đâu?",
    options: [
      { id: "A", text: "Cao Bằng" },
      { id: "B", text: "Bắc Giang" },
      { id: "C", text: "Tuyên Quang" },
      { id: "D", text: "Thái Nguyên" },
    ],
    correctOptionId: "A",
    explanation:
      "Đội ra đời tại Cao Bằng theo chỉ thị của Hồ Chí Minh, đánh thắng Phai Khắt (25/12/1944) và Nà Ngần (26/12/1944).",
    sourcePage: "tr. 104 (PDF tr. 13)",
  },
  {
    id: "q13",
    territoryId: "nhat-dao-chinh",
    topic: "Cao trào kháng Nhật",
    prompt:
      "Ngày 9/3/1945, sau khi đảo chính Pháp, Nhật dựng lên chính phủ nào ở Đông Dương?",
    options: [
      { id: "A", text: "Chính phủ Bảo Đại – Trần Trọng Kim" },
      { id: "B", text: "Chính phủ Ngô Đình Diệm" },
      { id: "C", text: "Chính phủ Pháp – Nhật" },
      { id: "D", text: "Chính phủ lâm thời Việt Nam Dân chủ Cộng hòa" },
    ],
    correctOptionId: "A",
    explanation:
      "Nhật đảo chính Pháp ngày 9/3/1945, độc chiếm Đông Dương và dựng chính phủ Bảo Đại – Trần Trọng Kim.",
    sourcePage: "tr. 105–106 (PDF tr. 14–15)",
  },
  {
    id: "q14",
    territoryId: "chi-thi-thang-ba",
    topic: "Chỉ thị tháng 3",
    prompt:
      "Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta” (12/3/1945) xác định kẻ thù trước mắt là ai?",
    options: [
      { id: "A", text: "Phát xít Nhật" },
      { id: "B", text: "Thực dân Pháp" },
      { id: "C", text: "Chính phủ Bảo Đại" },
      { id: "D", text: "Quân Đồng minh" },
    ],
    correctOptionId: "A",
    explanation:
      "Chỉ thị xác định kẻ thù cụ thể trước mắt là phát xít Nhật, thay khẩu hiệu “Đánh đuổi phát xít Nhật – Pháp” bằng “Đánh đuổi phát xít Nhật” và phát động cao trào kháng Nhật cứu nước.",
    sourcePage: "tr. 106 (PDF tr. 15)",
  },
  {
    id: "q15",
    territoryId: "hoi-nghi-quan-su",
    topic: "Chuẩn bị tổng khởi nghĩa",
    prompt:
      "Hội nghị quân sự cách mạng Bắc Kỳ họp ngày 15/5/1945 tại Hiệp Hòa (Bắc Giang) quyết định gì?",
    options: [
      {
        id: "A",
        text: "Thống nhất các lực lượng vũ trang thành Việt Nam Giải phóng quân",
      },
      { id: "B", text: "Thành lập Mặt trận Việt Minh" },
      { id: "C", text: "Phát động Tổng khởi nghĩa trong cả nước" },
      { id: "D", text: "Ký hiệp định với quân Đồng minh" },
    ],
    correctOptionId: "A",
    explanation:
      "Hội nghị quyết định thống nhất các lực lượng vũ trang thành Việt Nam Giải phóng quân.",
    sourcePage: "tr. 107 (PDF tr. 16)",
  },
  {
    id: "q16",
    territoryId: "khu-giai-phong",
    topic: "Khu giải phóng",
    prompt:
      "Khu giải phóng chính thức được thành lập ngày 4/6/1945 gồm những tỉnh nào?",
    options: [
      {
        id: "A",
        text: "Cao Bằng, Bắc Kạn, Lạng Sơn, Tuyên Quang, Thái Nguyên, Hà Giang",
      },
      {
        id: "B",
        text: "Hà Nội, Hải Phòng, Nam Định, Thái Bình, Ninh Bình, Thanh Hóa",
      },
      {
        id: "C",
        text: "Quảng Nam, Quảng Ngãi, Bình Định, Phú Yên, Khánh Hòa, Ninh Thuận",
      },
      {
        id: "D",
        text: "Gia Định, Biên Hòa, Thủ Dầu Một, Mỹ Tho, Vĩnh Long, Cần Thơ",
      },
    ],
    correctOptionId: "A",
    explanation:
      "Khu giải phóng gồm hầu hết Cao Bằng, Bắc Kạn, Lạng Sơn, Tuyên Quang, Thái Nguyên, Hà Giang và một số vùng lân cận; Tân Trào là trung tâm.",
    sourcePage: "tr. 107 (PDF tr. 16)",
  },
  {
    id: "q17",
    territoryId: "quan-lenh-so-1",
    topic: "Tổng khởi nghĩa",
    prompt:
      "Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1 vào thời điểm nào?",
    options: [
      { id: "A", text: "23 giờ ngày 13/8/1945" },
      { id: "B", text: "Sáng ngày 14/8/1945" },
      { id: "C", text: "Ngày 16/8/1945" },
      { id: "D", text: "Ngày 2/9/1945" },
    ],
    correctOptionId: "A",
    explanation:
      "Quân lệnh số 1 phát đi lệnh Tổng khởi nghĩa. Hội nghị toàn quốc của Đảng họp ngày 14–15/8, Đại hội quốc dân họp ngày 16/8/1945 tại Tân Trào.",
    sourcePage: "tr. 111–112 (PDF tr. 20–21)",
  },
  {
    id: "q18",
    territoryId: "mua-thu-doc-lap",
    topic: "Cách mạng Tháng Tám",
    prompt:
      "Thắng lợi khởi nghĩa giành chính quyền ở Hà Nội, Huế, Sài Gòn diễn ra lần lượt vào những ngày nào?",
    options: [
      { id: "A", text: "19/8, 23/8 và 25/8/1945" },
      { id: "B", text: "23/8, 19/8 và 25/8/1945" },
      { id: "C", text: "25/8, 23/8 và 19/8/1945" },
      { id: "D", text: "19/8, 25/8 và 23/8/1945" },
    ],
    correctOptionId: "A",
    explanation:
      "Hà Nội giành chính quyền ngày 19/8, Huế ngày 23/8, Sài Gòn ngày 25/8/1945. Bảo Đại thoái vị ngày 30/8; ngày 2/9, Hồ Chí Minh đọc Tuyên ngôn Độc lập.",
    sourcePage: "tr. 114–118 (PDF tr. 23–27)",
  },
];

const BALANCED_CORRECT_IDS = [
  "B", "C", "D", "A", "A", "B", "C", "D", "A",
  "B", "C", "D", "A", "B", "C", "D", "A", "B",
] as const;

export const QUESTIONS: Question[] = RAW_QUESTIONS.map((question, index) => {
  const targetId = BALANCED_CORRECT_IDS[index];
  const correct = question.options.find(
    (option) => option.id === question.correctOptionId,
  );
  const distractors = question.options.filter(
    (option) => option.id !== question.correctOptionId,
  );

  if (!correct || !targetId) {
    return question;
  }

  let distractorIndex = 0;
  const ids = ["A", "B", "C", "D"] as const;
  return {
    ...question,
    options: ids.map((id) => ({
      id,
      text:
        id === targetId
          ? correct.text
          : distractors[distractorIndex++]?.text ?? "",
    })),
    correctOptionId: targetId,
  };
});

export const QUESTION_BY_ID = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
);

export const QUESTION_BY_TERRITORY_ID = Object.fromEntries(
  QUESTIONS.map((question) => [question.territoryId, question]),
);
