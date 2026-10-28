import { expect, test, type Page } from "@playwright/test";
import { QUESTIONS } from "../src/data/questions";

async function openFresh(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Bản đồ thời cơ" })).toBeVisible();
}

async function startGame(page: Page) {
  await fillTeamNames(page, ["Nhóm 1", "Nhóm 2"]);
  await page.getByRole("button", { name: "Bắt đầu" }).click();
  await expect(page.getByText(/Lượt của Nhóm 1/)).toBeVisible();
}

async function fillTeamNames(page: Page, names: string[]) {
  while (await page.getByRole("textbox").count() > names.length) {
    await page.getByRole("button", { name: /^Xóa nhóm/ }).last().click();
  }
  while (await page.getByRole("textbox").count() < names.length) {
    await page.getByRole("button", { name: "Thêm nhóm" }).click();
  }
  for (let index = 0; index < names.length; index += 1) {
    await page.getByLabel(`Tên nhóm ${index + 1}`).fill(names[index]);
  }
}

test("điền sẵn danh sách nhóm dự kiến", async ({ page }) => {
  await openFresh(page);

  const names = ["N01", "N02", "N04", "N05", "N06", "N07"];
  await expect(page.getByRole("textbox")).toHaveCount(names.length);
  for (let index = 0; index < names.length; index += 1) {
    await expect(page.getByLabel(`Tên nhóm ${index + 1}`)).toHaveValue(names[index]);
  }
});

async function submitOption(page: Page, optionId: string) {
  await page.getByRole("button", { name: /Bắt đầu|Chạy lại/ }).last().click();
  await page.getByRole("button", { name: new RegExp(`^${optionId} `) }).click();
  await page.getByRole("button", { name: `Chốt đáp án ${optionId}` }).click();
}

async function completeEvent(page: Page, checkpoint: 6 | 12 | 18) {
  await page.getByRole("button", { name: "Bắt đầu 45 giây" }).click();
  await page.locator("aside").getByRole("button", { name: /^Nhóm 1$/ }).click();
  if (checkpoint === 6) {
    for (const label of [
      "Trung ương ra thông báo về chuyển hướng chỉ đạo chiến lược",
      "Hội nghị Trung ương tại Bà Điểm",
      "Nguyễn Ái Quốc trở về Tổ quốc",
      "Hội nghị Trung ương 8 do Nguyễn Ái Quốc chủ trì",
    ]) {
      await page.getByRole("button", { name: label }).click();
    }
  } else if (checkpoint === 12) {
    const pairs = [
      ["armed-task", "tw8"],
      ["guerilla", "bac-son"],
      ["principles", "culture"],
      ["cao-bang", "army"],
    ];
    for (const [rightId, leftId] of pairs) {
      await page.getByTestId(`matching-choice-${rightId}`).click();
      await page.getByTestId(`matching-target-${leftId}`).click();
    }
  } else {
    for (const label of ["Tập trung", "Thống nhất", "Kịp thời"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
  }
  await page.getByRole("button", { name: "Chốt câu trả lời" }).click();
  await page.getByRole("button", { name: checkpoint === 18 ? "Xem tổng kết" : "Trở lại bản đồ" }).click();
}

test("chơi lượt chính sai, cướp quyền đúng và chuyển lượt", async ({ page }) => {
  await openFresh(page);
  await startGame(page);

  await expect(page.locator('button[aria-label*="còn trống"]')).toHaveCount(18);
  await page.locator('button[aria-label*="còn trống"]').first().click();
  await expect(page.getByRole("button", { name: "Bắt đầu" })).toBeVisible();

  await submitOption(page, "A");
  await expect(page.getByText("Đáp án đúng:")).toHaveCount(0);
  await page.getByRole("button", { name: /^Nhóm 2/ }).click();
  await expect(page.getByText(/5\s*giây/)).toBeVisible();

  await submitOption(page, "B");
  await expect(page.getByText("Đáp án đúng:")).toBeVisible();
  await expect(page.getByTestId("team-score-team-2")).toHaveText("60");

  await page.getByRole("button", { name: "Câu tiếp theo" }).click();
  await expect(page.getByText(/Lượt của Nhóm 2/)).toBeVisible();
});

test("hoàn tác trả lại điểm và câu hỏi", async ({ page }) => {
  await openFresh(page);
  await startGame(page);
  await page.locator('button[aria-label*="còn trống"]').first().click();
  await submitOption(page, "B");
  await expect(page.getByTestId("team-score-team-1")).toHaveText("100");

  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect(page.getByTestId("team-score-team-1")).toHaveText("0");
  await expect(page.getByRole("button", { name: "Bắt đầu" })).toBeVisible();
});

test("5 nhóm vẫn có đủ bàn chơi và bảng điểm", async ({ page }) => {
  await openFresh(page);
  await fillTeamNames(page, ["Nhóm 1", "Nhóm 2", "Nhóm 3", "Nhóm 4", "Nhóm 5"]);
  await page.getByRole("button", { name: "Bắt đầu" }).click();
  await expect(page.locator('button[aria-label*="còn trống"]')).toHaveCount(18);
  await expect(page.getByTestId(/team-score-/)).toHaveCount(5);
});

test("2 nhóm chỉ có một lượt cướp và tự công bố đáp án", async ({ page }) => {
  await openFresh(page);
  await fillTeamNames(page, ["Nhóm 1", "Nhóm 2"]);
  await page.getByRole("button", { name: "Bắt đầu" }).click();
  await page.locator('button[aria-label*="còn trống"]').first().click();
  await submitOption(page, "A");
  await expect(page.getByRole("button", { name: /^Nhóm 1/ })).toHaveCount(0);
  await page.getByRole("button", { name: /^Nhóm 2/ }).click();
  await submitOption(page, "C");

  await expect(page.getByText("Đáp án đúng:")).toBeVisible();
  await expect(page.getByRole("button", { name: /Cướp lượt 2/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Câu tiếp theo" }).click();
  await expect(page.getByText(/Lượt của Nhóm 2/)).toBeVisible();
});

test("refresh giữa trận hiện lựa chọn tiếp tục", async ({ page }) => {
  await openFresh(page);
  await startGame(page);
  await page.locator('button[aria-label*="còn trống"]').first().click();
  await submitOption(page, "B");
  await expect(page.getByText("Đáp án đúng:")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Trận đang dở")).toBeVisible();
  await page.getByRole("button", { name: "Tiếp tục" }).click();
  await expect(page.getByText("Đáp án đúng:")).toBeVisible();
});

test("kết thúc trận có xác nhận và chơi lại về thiết lập", async ({ page }) => {
  await openFresh(page);
  await startGame(page);
  await page.getByRole("button", { name: "Kết thúc trận" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Kết thúc trận" }).click();
  await expect(page.getByText(/Đồng hạng|thắng/)).toBeVisible();
  await page.getByRole("button", { name: "Chơi lại" }).click();
  await expect(page.getByRole("heading", { name: "Đặt tên nhóm" })).toBeVisible();
});

test("tên nhóm tự nhập được dùng xuyên suốt trận đấu", async ({ page }) => {
  await openFresh(page);
  await fillTeamNames(page, ["Sao Vàng", "Độc Lập"]);
  await page.getByRole("button", { name: "Bắt đầu" }).click();

  await expect(page.getByText(/Lượt của Sao Vàng/)).toBeVisible();
  await expect(page.getByRole("paragraph").filter({ hasText: /^Sao Vàng$/ })).toBeVisible();
  await expect(page.getByRole("paragraph").filter({ hasText: /^Độc Lập$/ })).toBeVisible();
});

test("màn hướng dẫn trình bày đủ cơ chế chính", async ({ page }) => {
  await openFresh(page);
  await page.getByRole("link", { name: "Xem hướng dẫn cách chơi" }).click();
  await expect(page.getByRole("heading", { name: "Làm chủ thời cơ" })).toBeVisible();
  await expect(page.getByText("Chớp thời cơ", { exact: true })).toBeVisible();
  await expect(page.getByText("Biến cố lịch sử", { exact: true })).toBeVisible();
});

test("chơi hết 18 câu sẽ mở màn hình tổng kết", async ({ page }) => {
  await openFresh(page);
  await startGame(page);

  for (let index = 0; index < 18; index += 1) {
    await page.locator('button[aria-label*="còn trống"]').first().click();
    await submitOption(page, QUESTIONS[index].correctOptionId);
    const checkpoint = index + 1;
    if ([6, 12, 18].includes(checkpoint)) {
      await page.getByRole("button", { name: "Đến Biến cố lịch sử" }).click();
      await completeEvent(page, checkpoint as 6 | 12 | 18);
    } else {
      await page.getByRole("button", { name: "Câu tiếp theo" }).click();
    }
  }

  await expect(page.getByText(/18\/18 câu/)).toBeVisible();
  await expect(page.getByText(/Đồng hạng|thắng/)).toBeVisible();
});
