import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { REGIONS } from "@/data/regions";
import { TERRITORIES } from "@/data/territories";
import {
  JOURNEY_BONUS,
  REINFORCED_MAIN_SECONDS,
  applyCapture,
  createInitialState,
  getEligibleStealTeams,
  getTerritoryStatus,
  rankTeams,
} from "@/lib/game-rules";
import { gameReducer, initialStore } from "@/lib/reducer";
import { QUESTION_BY_ID } from "@/data/questions";
import { validateGameData, validateTeamNames } from "@/lib/validation";
import type { GameState, GameStore } from "@/types/game";

const NAMES_2 = ["Nhóm 1", "Nhóm 2"];
const NAMES_5 = ["Nhóm 1", "Nhóm 2", "Nhóm 3", "Nhóm 4", "Nhóm 5"];
const NAMES_6 = [
  "Nhóm 1",
  "Nhóm 2",
  "Nhóm 3",
  "Nhóm 4",
  "Nhóm 5",
  "Nhóm 6",
];

function start(names: string[]): GameStore {
  return gameReducer(initialStore, { type: "START_GAME", teamNames: names });
}

function select(store: GameStore, territoryId = TERRITORIES[0].id): GameStore {
  return gameReducer(store, { type: "SELECT_TERRITORY", territoryId });
}

function resolveMain(store: GameStore, outcome: "correct" | "wrong" | "timeout") {
  if (outcome === "timeout") return gameReducer(store, { type: "TIMEOUT_MAIN" });
  const question = QUESTION_BY_ID[store.present.currentQuestionId!];
  const optionId = outcome === "correct"
    ? question.correctOptionId
    : question.options.find((item) => item.id !== question.correctOptionId)!.id;
  return gameReducer(store, { type: "SUBMIT_MAIN_ANSWER", optionId });
}

function openSteal(store: GameStore): GameStore {
  return store;
}

function selectSteal(store: GameStore, teamId: string): GameStore {
  return gameReducer(store, { type: "SELECT_STEAL_TEAM", teamId });
}

function resolveSteal(
  store: GameStore,
  outcome: "correct" | "wrong",
): GameStore {
  const question = QUESTION_BY_ID[store.present.currentQuestionId!];
  const optionId = outcome === "correct"
    ? question.correctOptionId
    : question.options.find(
        (item) => item.id !== question.correctOptionId && !store.present.rejectedOptionIds.includes(item.id),
      )!.id;
  return gameReducer(store, { type: "SUBMIT_STEAL_ANSWER", optionId });
}

function endRound(store: GameStore): GameStore {
  return gameReducer(store, { type: "END_ROUND" });
}

describe("dữ liệu", () => {
  it("có 18 câu, 18 địa bàn, 3 khu vực và không lỗi", () => {
    expect(QUESTIONS).toHaveLength(18);
    expect(TERRITORIES).toHaveLength(18);
    expect(REGIONS).toHaveLength(3);
    const errors = validateGameData().filter((issue) => issue.level === "error");
    expect(errors).toEqual([]);
  });

  it("mỗi khu vực có đúng 6 địa bàn", () => {
    for (const region of REGIONS) {
      expect(
        TERRITORIES.filter((territory) => territory.regionId === region.id),
      ).toHaveLength(6);
    }
  });

  it("chặn số nhóm và tên nhóm không hợp lệ", () => {
    expect(validateTeamNames(["A"])).not.toEqual([]);
    expect(validateTeamNames(Array(7).fill("A"))).not.toEqual([]);
    expect(validateTeamNames(["", "B"])).not.toEqual([]);
    expect(validateTeamNames(["A", "a"])).not.toEqual([]);
    expect(validateTeamNames(["Nhóm 1", "Nhóm 2"])).toEqual([]);
  });
});

describe("khởi tạo trận", () => {
  for (const names of [NAMES_2, NAMES_5, NAMES_6]) {
    it(`tạo đúng số nhóm và 18 địa bàn với ${names.length} nhóm`, () => {
      const store = start(names);
      expect(store.present.phase).toBe("selecting");
      expect(store.present.teams).toHaveLength(names.length);
      expect(store.present.territories).toHaveLength(18);
      expect(store.present.currentTeamIndex).toBe(0);
      expect(store.present.teams.every((team) => team.score === 0)).toBe(true);
      expect(store.past).toHaveLength(0);
    });
  }

  it("không bắt đầu khi tên nhóm không hợp lệ", () => {
    const store = gameReducer(initialStore, {
      type: "START_GAME",
      teamNames: ["", "Nhóm 2"],
    });
    expect(store.present.phase).toBe("setup");
  });
});

describe("lượt chính", () => {
  it("trả lời đúng cộng 100, chiếm địa bàn và chuyển lượt", () => {
    let store = start(NAMES_5);
    const territory = TERRITORIES[0];
    store = select(store, territory.id);
    expect(store.present.phase).toBe("question");
    expect(store.present.currentQuestionId).toBe(territory.questionId);

    store = resolveMain(store, "correct");
    expect(store.present.teams[0].score).toBe(100);
    expect(
      store.present.territories.find((item) => item.id === territory.id)
        ?.ownerTeamId,
    ).toBe("team-1");
    expect(store.present.answerRevealed).toBe(true);

    store = endRound(store);
    expect(store.present.usedQuestionIds).toEqual([territory.questionId]);
    expect(store.present.currentTeamIndex).toBe(1);
    expect(store.present.phase).toBe("selecting");
  });

  it("trả lời sai không cộng điểm, ẩn đáp án và mở được cướp quyền", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = resolveMain(store, "wrong");

    expect(store.present.teams[0].score).toBe(0);
    expect(store.present.phase).toBe("steal-select");
    expect(store.present.answerRevealed).toBe(false);
    expect(store.present.mainOutcome).toBe("wrong");
    expect(getEligibleStealTeams(store.present)).toHaveLength(4);

    store = openSteal(store);
    expect(store.present.phase).toBe("steal-select");
    store = selectSteal(store, "team-2");
    expect(store.present.phase).toBe("steal-question");
    expect(store.present.stealAttempts).toBe(0);
    expect(store.present.answerRevealed).toBe(false);
  });

  it("hết giờ xử lý như trả lời sai", () => {
    let store = start(NAMES_2);
    store = select(store);
    store = resolveMain(store, "timeout");
    expect(store.present.lastResult?.points).toBe(0);
    expect(store.present.answerRevealed).toBe(false);
  });
});

describe("cướp quyền", () => {
  it("cướp đúng cộng 60, chiếm địa bàn và vẫn xoay lượt cố định", () => {
    let store = start(NAMES_5);
    const territory = TERRITORIES[1];
    store = select(store, territory.id);
    store = resolveMain(store, "wrong");
    store = openSteal(store);
    store = selectSteal(store, "team-3");
    store = resolveSteal(store, "correct");

    expect(store.present.teams[2].score).toBe(60);
    expect(
      store.present.territories.find((item) => item.id === territory.id)
        ?.ownerTeamId,
    ).toBe("team-3");
    expect(store.present.answerRevealed).toBe(true);
    expect(store.present.stealOutcome).toBe("correct");

    store = endRound(store);
    expect(store.present.currentTeamIndex).toBe(1);
    expect(store.present.usedQuestionIds).toContain(territory.questionId);
  });

  it("cướp sai không bị trừ điểm, mỗi đội một lần và tối đa 2 lượt", () => {
    let store = start(NAMES_6);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = openSteal(store);
    store = selectSteal(store, "team-2");
    store = resolveSteal(store, "wrong");

    expect(store.present.teams[1].score).toBe(0);
    expect(store.present.answerRevealed).toBe(false);
    expect(store.present.stealAttemptedTeamIds).toEqual(["team-2"]);
    expect(getEligibleStealTeams(store.present)).not.toContainEqual(
      expect.objectContaining({ id: "team-2" }),
    );

    store = openSteal(store);
    store = selectSteal(store, "team-3");
    store = resolveSteal(store, "wrong");
    expect(store.present.stealAttempts).toBe(2);
    expect(store.present.answerRevealed).toBe(true);
    expect(getEligibleStealTeams(store.present)).toHaveLength(0);

    const before = store;
    store = openSteal(store);
    expect(store).toBe(before);
  });

  it("không cho đội đang lượt cướp quyền", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = openSteal(store);
    const before = store;
    store = selectSteal(store, "team-1");
    expect(store).toBe(before);
  });

  it("bỏ qua cướp quyền sẽ công bố đáp án", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = resolveMain(store, "wrong");
    expect(store.present.answerRevealed).toBe(false);
    store = gameReducer(store, { type: "SKIP_STEAL" });
    expect(store.present.answerRevealed).toBe(true);
    expect(store.present.phase).toBe("steal-result");
  });

  it("đổi nhóm không tiêu lượt trả lời và nhóm cũ không được cướp lại", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = selectSteal(store, "team-2");
    store = gameReducer(store, { type: "SWITCH_STEAL_TEAM" });

    expect(store.present.phase).toBe("steal-select");
    expect(store.present.stealAttempts).toBe(0);
    expect(store.present.stealAttemptedTeamIds).toEqual(["team-2"]);
    expect(getEligibleStealTeams(store.present)).not.toContainEqual(
      expect.objectContaining({ id: "team-2" }),
    );

    store = selectSteal(store, "team-3");
    store = resolveSteal(store, "correct");
    expect(store.present.teams[2].score).toBe(60);
  });

  it("đổi nhóm sau lượt trả lời sai không làm giảm thêm điểm cướp", () => {
    let store = start(NAMES_6);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = selectSteal(store, "team-2");
    store = resolveSteal(store, "wrong");
    expect(store.present.stealAttempts).toBe(1);

    store = selectSteal(store, "team-3");
    store = gameReducer(store, { type: "SWITCH_STEAL_TEAM" });
    store = selectSteal(store, "team-4");
    store = resolveSteal(store, "correct");

    expect(store.present.stealAttempts).toBe(2);
    expect(store.present.teams[3].score).toBe(40);
  });

  it("đổi hết các nhóm mà không ai trả lời sẽ công bố đáp án", () => {
    let store = start(NAMES_2);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = selectSteal(store, "team-2");
    store = gameReducer(store, { type: "SWITCH_STEAL_TEAM" });

    expect(store.present.stealAttempts).toBe(0);
    expect(store.present.phase).toBe("steal-result");
    expect(store.present.answerRevealed).toBe(true);
  });

  it("bỏ qua được ngay cả khi một nhóm đang cướp", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = resolveMain(store, "wrong");
    store = selectSteal(store, "team-2");
    store = gameReducer(store, { type: "SKIP_STEAL" });
    expect(store.present.phase).toBe("steal-result");
    expect(store.present.answerRevealed).toBe(true);
  });
});

describe("khóa địa bàn và Hành trình lịch sử", () => {
  it("địa bàn đã hỏi không chọn lại được", () => {
    let store = start(NAMES_5);
    const territory = TERRITORIES[0];
    store = select(store, territory.id);
    store = resolveMain(store, "wrong");
    store = gameReducer(store, { type: "SKIP_STEAL" });
    store = endRound(store);

    expect(getTerritoryStatus(store.present, territory.id)).toBe("asked");
    const before = store;
    store = select(store, territory.id);
    expect(store).toBe(before);
  });

  it("chiếm địa bàn ở đủ ba khu vực thì cộng +50 một lần", () => {
    const base = createInitialState(NAMES_5);
    let state: GameState = base;
    const picks = REGIONS.map(
      (region) => TERRITORIES.find((territory) => territory.regionId === region.id)!,
    );
    state = applyCapture(state, "team-1", picks[0].id, 100).state;
    state = applyCapture(state, "team-1", picks[1].id, 100).state;
    const third = applyCapture(state, "team-1", picks[2].id, 100);
    expect(third.result.points).toBe(100 + JOURNEY_BONUS);
    expect(third.result.bonusPoints).toBe(JOURNEY_BONUS);
    expect(third.result.journeyBonus).toBe(true);
    expect(third.state.journeyBonusAwards).toEqual(["team-1"]);
  });

  it("không cộng thưởng Hành trình hai lần", () => {
    const base = createInitialState(NAMES_5);
    const picks = REGIONS.map((region) => TERRITORIES.filter((territory) => territory.regionId === region.id));
    let state = applyCapture(base, "team-1", picks[0][0].id, 100).state;
    state = applyCapture(state, "team-1", picks[1][0].id, 100).state;
    const first = applyCapture(state, "team-1", picks[2][0].id, 100);
    const second = applyCapture(first.state, "team-1", picks[2][1].id, 100);
    expect(second.result.bonusPoints).toBe(0);
    expect(second.state.journeyBonusAwards).toEqual(first.state.journeyBonusAwards);
  });
});

describe("xếp hạng", () => {
  it("xếp theo điểm, rồi địa bàn, rồi khu vực thứ ba", () => {
    const state = createInitialState(NAMES_5);
    const region3 = REGIONS.find((region) => region.order === 3)!;
    const region1 = REGIONS.find((region) => region.order === 1)!;
    const r3 = TERRITORIES.filter((territory) => territory.regionId === region3.id);
    const r1 = TERRITORIES.filter((territory) => territory.regionId === region1.id);

    state.teams[0].score = 100;
    state.teams[1].score = 100;
    state.teams[2].score = 100;
    state.territories = state.territories.map((territory) => {
      if (territory.id === r1[0].id) return { ...territory, ownerTeamId: "team-1" };
      if (territory.id === r3[0].id) return { ...territory, ownerTeamId: "team-2" };
      return territory;
    });

    const ranked = rankTeams(state);
    expect(ranked[0].id).toBe("team-2");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].id).toBe("team-1");
    expect(ranked[2].id).toBe("team-3");
  });

  it("đồng hạng khi mọi tiêu chí bằng nhau", () => {
    const state = createInitialState(NAMES_2);
    const ranked = rankTeams(state);
    expect(ranked.map((team) => team.rank)).toEqual([1, 1]);
  });
});

describe("hoàn tác và kết thúc", () => {
  it("hoàn tác khôi phục điểm, chủ quyền và lượt", () => {
    let store = start(NAMES_5);
    store = select(store, TERRITORIES[0].id);
    store = resolveMain(store, "correct");
    expect(store.present.teams[0].score).toBe(100);
    store = gameReducer(store, { type: "UNDO" });
    expect(store.present.teams[0].score).toBe(0);
    expect(store.present.territories[0].ownerTeamId).toBeNull();
    expect(store.present.phase).toBe("question");
  });

  it("kết thúc khi đã dùng đủ 18 câu", () => {
    let store = start(NAMES_5);
    const lastQuestion = QUESTIONS[17];
    const lastTerritory = TERRITORIES.find(
      (territory) => territory.questionId === lastQuestion.id,
    )!;
    const used = QUESTIONS.slice(0, 17).map((question) => question.id);
    store = {
      ...store,
      present: {
        ...store.present,
        phase: "main-result",
        currentTerritoryId: lastTerritory.id,
        currentQuestionId: lastQuestion.id,
        answerRevealed: true,
        usedQuestionIds: used,
      },
    };
    store = endRound(store);
    expect(store.present.phase).toBe("event-intro");
    expect(store.present.usedQuestionIds).toHaveLength(18);
  });

  it("kết thúc thủ công giữ nguyên điểm và địa bàn", () => {
    let store = start(NAMES_2);
    store = select(store);
    store = resolveMain(store, "correct");
    store = gameReducer(store, { type: "END_GAME" });
    expect(store.present.phase).toBe("finished");
    expect(store.present.teams[0].score).toBe(100);
  });

  it("reset quay về thiết lập và xóa lịch sử", () => {
    let store = start(NAMES_5);
    store = select(store);
    store = gameReducer(store, { type: "RESET_GAME" });
    expect(store.present.phase).toBe("setup");
    expect(store.present.teams).toHaveLength(0);
    expect(store.past).toHaveLength(0);
  });
});

describe("cơ chế phiên bản 2", () => {
  it("Tiếp viện cộng thêm 10 giây", () => {
    expect(REINFORCED_MAIN_SECONDS).toBe(25);
  });

  it("khóa lựa chọn sai và cướp lần hai chỉ nhận 40 điểm", () => {
    let store = start(NAMES_5);
    store = select(store, TERRITORIES[0].id);
    const question = QUESTION_BY_ID[store.present.currentQuestionId!];
    const wrong = question.options.filter((item) => item.id !== question.correctOptionId);
    store = gameReducer(store, { type: "SUBMIT_MAIN_ANSWER", optionId: wrong[0].id });
    expect(store.present.rejectedOptionIds).toContain(wrong[0].id);
    store = selectSteal(store, "team-2");
    store = gameReducer(store, { type: "SUBMIT_STEAL_ANSWER", optionId: wrong[1].id });
    store = selectSteal(store, "team-3");
    store = gameReducer(store, { type: "SUBMIT_STEAL_ANSWER", optionId: question.correctOptionId });
    expect(store.present.teams[2].score).toBe(40);
  });

  it("Chớp thời cơ chỉ dùng một lần trước khi chọn địa bàn", () => {
    let store = start(NAMES_2);
    store = gameReducer(store, { type: "ACTIVATE_OPPORTUNITY", effect: "reinforce" });
    expect(store.present.pendingOpportunity?.effect).toBe("reinforce");
    expect(store.present.teams[0].opportunityUsed).toBe(true);
    const afterFirst = store;
    store = gameReducer(store, { type: "ACTIVATE_OPPORTUNITY", effect: "decisive" });
    expect(store).toBe(afterFirst);
    store = select(store);
    expect(store.present.activeOpportunity?.effect).toBe("reinforce");
    const inQuestion = store;
    store = gameReducer(store, { type: "ACTIVATE_OPPORTUNITY", effect: "scout" });
    expect(store).toBe(inQuestion);
  });

  it("mở Biến cố sau câu 6 và đội trả lời đúng nhận 50 điểm", () => {
    let store = start(NAMES_2);
    store = {
      ...store,
      present: {
        ...store.present,
        phase: "main-result",
        currentTerritoryId: TERRITORIES[5].id,
        currentQuestionId: TERRITORIES[5].questionId,
        usedQuestionIds: QUESTIONS.slice(0, 5).map((question) => question.id),
        answerRevealed: true,
      },
    };
    store = endRound(store);
    expect(store.present.phase).toBe("event-intro");
    store = gameReducer(store, { type: "START_EVENT" });
    store = gameReducer(store, { type: "SELECT_EVENT_TEAM", teamId: "team-2" });
    store = gameReducer(store, {
      type: "SUBMIT_EVENT_ANSWER",
      answer: ["notice-1939", "conference-1939", "return-1941", "conference-8"],
    });
    expect(store.present.phase).toBe("event-result");
    expect(store.present.teams[1].score).toBe(50);
    store = gameReducer(store, { type: "END_EVENT" });
    expect(store.present.phase).toBe("selecting");
    expect(store.present.currentTeamIndex).toBe(1);
  });

  it("Biến cố câu 18 phải kết thúc trước khi hiện tổng kết", () => {
    let store = start(NAMES_2);
    store = {
      ...store,
      present: {
        ...store.present,
        phase: "main-result",
        currentTerritoryId: TERRITORIES[17].id,
        currentQuestionId: TERRITORIES[17].questionId,
        usedQuestionIds: QUESTIONS.slice(0, 17).map((question) => question.id),
        completedEventIds: ["event-06-chuyen-huong", "event-12-xay-luc-luong"],
        answerRevealed: true,
      },
    };
    store = endRound(store);
    expect(store.present.phase).toBe("event-intro");
    store = gameReducer(store, { type: "START_EVENT" });
    store = gameReducer(store, { type: "SKIP_EVENT" });
    store = gameReducer(store, { type: "END_EVENT" });
    expect(store.present.phase).toBe("finished");
  });
});
