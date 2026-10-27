import { QUESTIONS } from "@/data/questions";
import { HISTORICAL_EVENTS } from "@/data/historical-events";
import { REGIONS } from "@/data/regions";
import { MAX_TEAMS, MIN_TEAMS } from "@/data/teams";
import { TERRITORIES } from "@/data/territories";
import type { GameState, Phase, Question } from "@/types/game";

const PHASES: Phase[] = [
  "setup",
  "selecting",
  "question",
  "main-result",
  "steal-select",
  "steal-question",
  "steal-result",
  "event-intro",
  "event-open",
  "event-answering",
  "event-result",
  "finished",
];

export interface DataIssue {
  level: "error" | "warning";
  message: string;
}

export function validateGameData(): DataIssue[] {
  const issues: DataIssue[] = [];
  const regionIds = new Set(REGIONS.map((region) => region.id));
  const territoryIds = new Set<string>();
  const questionIds = new Set<string>();

  if (REGIONS.length !== 3) {
    issues.push({
      level: "error",
      message: `Cần đúng 3 khu vực, hiện có ${REGIONS.length}.`,
    });
  }

  if (TERRITORIES.length !== 18) {
    issues.push({
      level: "error",
      message: `Cần đúng 18 địa bàn, hiện có ${TERRITORIES.length}.`,
    });
  }

  if (QUESTIONS.length !== 18) {
    issues.push({
      level: "error",
      message: `Cần đúng 18 câu hỏi, hiện có ${QUESTIONS.length}.`,
    });
  }

  for (const region of REGIONS) {
    const count = TERRITORIES.filter(
      (territory) => territory.regionId === region.id,
    ).length;
    if (count !== 6) {
      issues.push({
        level: "error",
        message: `Khu vực ${region.name} cần 6 địa bàn, hiện có ${count}.`,
      });
    }
  }

  for (const territory of TERRITORIES) {
    if (territoryIds.has(territory.id)) {
      issues.push({
        level: "error",
        message: `Trùng ID địa bàn: ${territory.id}.`,
      });
    }
    territoryIds.add(territory.id);

    if (!regionIds.has(territory.regionId)) {
      issues.push({
        level: "error",
        message: `Địa bàn ${territory.name} trỏ tới khu vực không tồn tại.`,
      });
    }

    const question = QUESTIONS.find(
      (item) => item.id === territory.questionId,
    );
    if (!question) {
      issues.push({
        level: "error",
        message: `Địa bàn ${territory.name} thiếu câu hỏi ${territory.questionId}.`,
      });
    } else if (question.territoryId !== territory.id) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} và địa bàn ${territory.id} không khớp.`,
      });
    }
  }

  for (const question of QUESTIONS) {
    if (questionIds.has(question.id)) {
      issues.push({
        level: "error",
        message: `Trùng ID câu hỏi: ${question.id}.`,
      });
    }
    questionIds.add(question.id);

    if (!territoryIds.has(question.territoryId)) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} trỏ tới địa bàn không tồn tại.`,
      });
    }

    if (question.options.length !== 4) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} phải có đúng 4 lựa chọn.`,
      });
    }

    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== 4) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} có lựa chọn trùng ID.`,
      });
    }

    if (!optionIds.has(question.correctOptionId)) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} có đáp án đúng không nằm trong lựa chọn.`,
      });
    }

    if (!question.explanation.trim()) {
      issues.push({
        level: "error",
        message: `Câu ${question.id} thiếu lời giải.`,
      });
    }

    if (!question.sourcePage.trim()) {
      issues.push({
        level: "warning",
        message: `Câu ${question.id} chưa ghi trang nguồn.`,
      });
    }
  }

  if (HISTORICAL_EVENTS.length !== 3) {
    issues.push({ level: "error", message: "Cần đúng 3 Biến cố lịch sử." });
  }
  const eventIds = new Set<string>();
  const checkpoints = new Set<number>();
  for (const event of HISTORICAL_EVENTS) {
    if (eventIds.has(event.id)) {
      issues.push({ level: "error", message: `Trùng ID Biến cố: ${event.id}.` });
    }
    if (checkpoints.has(event.checkpoint)) {
      issues.push({ level: "error", message: `Trùng mốc Biến cố: ${event.checkpoint}.` });
    }
    eventIds.add(event.id);
    checkpoints.add(event.checkpoint);
    if (!event.explanation.trim() || !event.sourcePage.trim()) {
      issues.push({ level: "error", message: `Biến cố ${event.id} thiếu lời giải hoặc nguồn.` });
    }
  }

  return issues;
}

export function validateTeamNames(names: string[]): string[] {
  const errors: string[] = [];

  if (names.length < MIN_TEAMS || names.length > MAX_TEAMS) {
    errors.push(`Số nhóm phải từ ${MIN_TEAMS} đến ${MAX_TEAMS}.`);
  }

  const normalized = names.map((name) => name.trim());
  if (normalized.some((name) => !name)) {
    errors.push("Tên nhóm không được để trống.");
  }

  if (normalized.some((name) => name.length > 24)) {
    errors.push("Tên nhóm tối đa 24 ký tự.");
  }

  const lowerNames = normalized.map((name) => name.toLocaleLowerCase("vi"));
  if (new Set(lowerNames).size !== lowerNames.length) {
    errors.push("Tên các nhóm không được trùng nhau.");
  }

  return errors;
}

export function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Partial<GameState>;
  if (!state.phase || !PHASES.includes(state.phase)) {
    return false;
  }

  if (!Array.isArray(state.teams) || !Array.isArray(state.territories)) {
    return false;
  }

  if (
    state.phase !== "setup" &&
    (state.teams.length < MIN_TEAMS || state.teams.length > MAX_TEAMS)
  ) {
    return false;
  }

  if (
    state.phase !== "setup" &&
    state.territories.length !== TERRITORIES.length
  ) {
    return false;
  }

  if (
    typeof state.currentTeamIndex !== "number" ||
    state.currentTeamIndex < 0 ||
    (state.teams.length > 0 && state.currentTeamIndex >= state.teams.length)
  ) {
    return false;
  }

  if (!Array.isArray(state.usedQuestionIds)) {
    return false;
  }

  if (!Array.isArray(state.journeyBonusAwards)) {
    return false;
  }

  if (!Array.isArray(state.stealAttemptedTeamIds)) {
    return false;
  }

  if (
    !Array.isArray(state.rejectedOptionIds) ||
    !Array.isArray(state.completedEventIds) ||
    !Array.isArray(state.eventAttemptedTeamIds)
  ) {
    return false;
  }

  if (state.teams.some((team) => typeof team.opportunityUsed !== "boolean")) {
    return false;
  }

  if (typeof state.stealAttempts !== "number") {
    return false;
  }

  if (typeof state.answerRevealed !== "boolean") {
    return false;
  }

  return true;
}

export function getQuestionProblems(question: Question): string[] {
  const problems: string[] = [];
  if (question.options.length !== 4) {
    problems.push("Không đủ 4 lựa chọn.");
  }
  if (!question.options.some((option) => option.id === question.correctOptionId)) {
    problems.push("Đáp án đúng không hợp lệ.");
  }
  if (!question.explanation.trim()) {
    problems.push("Thiếu lời giải.");
  }
  return problems;
}
