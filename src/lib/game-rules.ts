import { REGIONS } from "@/data/regions";
import { TEAM_DEFINITIONS } from "@/data/teams";
import { TERRITORIES, TERRITORY_BY_ID } from "@/data/territories";
import type {
  EventAnswer,
  GameState,
  HistoricalEvent,
  OpportunityEffect,
  OptionId,
  RegionId,
  ScoreResult,
  Team,
  Territory,
  TerritoryState,
} from "@/types/game";

export const MAIN_POINTS = 100;
export const FIRST_STEAL_POINTS = 60;
export const SECOND_STEAL_POINTS = 40;
export const JOURNEY_BONUS = 50;
export const STEAL_POINTS = FIRST_STEAL_POINTS;
export const REGION_BONUS = JOURNEY_BONUS;
export const REGION_BONUS_THRESHOLD = 4;
export const DECISIVE_BONUS = 50;
export const MAX_STEAL_ATTEMPTS = 2;
export const MAX_HISTORY = 30;
export const MAIN_SECONDS = 15;
export const REINFORCED_MAIN_SECONDS = 25;
export const STEAL_SECONDS = 5;
export const TEAM_NAME_MAX = 24;

export const OPPORTUNITY_EFFECTS: OpportunityEffect[] = [
  "scout",
  "reinforce",
  "decisive",
];

export const OPPORTUNITY_LABELS: Record<
  OpportunityEffect,
  { name: string; description: string }
> = {
  scout: {
    name: "Trinh sát",
    description: "Loại trước một phương án sai.",
  },
  reinforce: {
    name: "Tiếp viện",
    description: "Có 25 giây cho câu trả lời chính.",
  },
  decisive: {
    name: "Quyết đoán",
    description: "Trả lời đúng nhận thêm 50 điểm.",
  },
};

export function drawOpportunityEffect(): OpportunityEffect {
  return OPPORTUNITY_EFFECTS[
    Math.floor(Math.random() * OPPORTUNITY_EFFECTS.length)
  ];
}

export function isHistoricalEventAnswerCorrect(
  event: HistoricalEvent,
  answer: EventAnswer,
): boolean {
  if (event.type === "matching") {
    if (Array.isArray(answer)) return false;
    return Object.entries(event.correctPairs).every(
      ([leftId, rightId]) => answer[leftId] === rightId,
    );
  }

  if (!Array.isArray(answer)) return false;
  if (event.type === "order") {
    return (
      answer.length === event.correctOrder.length &&
      answer.every((id, index) => id === event.correctOrder[index])
    );
  }

  const expected = [...event.correctOptionIds].sort();
  const actual = [...answer].sort();
  return (
    actual.length === expected.length &&
    actual.every((id, index) => id === expected[index])
  );
}

export function getScoutElimination(
  correctOptionId: OptionId,
): OptionId {
  const choices: OptionId[] = ["A", "B", "C", "D"].filter(
    (id): id is OptionId => id !== correctOptionId,
  );
  return choices[Math.floor(Math.random() * choices.length)];
}

export type TerritoryStatus = "available" | "captured" | "asked";

export function createSetupState(): GameState {
  return {
    phase: "setup",
    teams: [],
    territories: [],
    currentTeamIndex: 0,
    currentTerritoryId: null,
    currentQuestionId: null,
    mainOutcome: null,
    stealTeamId: null,
    stealAttempts: 0,
    stealAttemptedTeamIds: [],
    stealOutcome: null,
    rejectedOptionIds: [],
    lastSubmittedOptionId: null,
    usedQuestionIds: [],
    journeyBonusAwards: [],
    regionBonusAwards: [],
    pendingOpportunity: null,
    activeOpportunity: null,
    currentEventId: null,
    completedEventIds: [],
    eventAttemptedTeamIds: [],
    eventAnsweringTeamId: null,
    eventOutcome: null,
    eventWinnerTeamId: null,
    lastResult: null,
    answerRevealed: false,
  };
}

export function createTeams(names: string[]): Team[] {
  return names.map((name, index) => ({
    id: `team-${index + 1}`,
    slot: index + 1,
    name: name.trim(),
    score: 0,
    opportunityUsed: false,
  }));
}

export function createInitialState(names: string[]): GameState {
  return {
    ...createSetupState(),
    phase: "selecting",
    teams: createTeams(names),
    territories: TERRITORIES.map((territory) => ({
      id: territory.id,
      ownerTeamId: null,
    })),
  };
}

export function getTeamDefinition(team: Team) {
  return TEAM_DEFINITIONS[team.slot - 1];
}

export function getCurrentTeam(state: GameState): Team | null {
  return state.teams[state.currentTeamIndex] ?? null;
}

export function getTeamById(state: GameState, teamId: string): Team | null {
  return state.teams.find((team) => team.id === teamId) ?? null;
}

export function getTerritoryState(
  state: GameState,
  territoryId: string,
): TerritoryState | null {
  return state.territories.find((territory) => territory.id === territoryId) ?? null;
}

export function getTerritory(territoryId: string): Territory | null {
  return TERRITORY_BY_ID[territoryId] ?? null;
}

export function getTerritoryStatus(
  state: GameState,
  territoryId: string,
): TerritoryStatus {
  const territoryState = getTerritoryState(state, territoryId);
  if (!territoryState) {
    return "asked";
  }
  if (territoryState.ownerTeamId) {
    return "captured";
  }
  const definition = TERRITORY_BY_ID[territoryId];
  if (definition && state.usedQuestionIds.includes(definition.questionId)) {
    return "asked";
  }
  return "available";
}

export function getOwnedTerritoryCount(state: GameState, teamId: string): number {
  return state.territories.filter(
    (territory) => territory.ownerTeamId === teamId,
  ).length;
}

export function getOwnedInRegion(
  state: GameState,
  teamId: string,
  regionId: RegionId,
): number {
  return state.territories.filter((territory) => {
    if (territory.ownerTeamId !== teamId) {
      return false;
    }
    return TERRITORY_BY_ID[territory.id]?.regionId === regionId;
  }).length;
}

export function getEligibleStealTeams(state: GameState): Team[] {
  if (state.stealAttempts >= MAX_STEAL_ATTEMPTS) {
    return [];
  }
  const currentTeam = getCurrentTeam(state);
  if (!currentTeam) {
    return [];
  }
  return state.teams.filter(
    (team) =>
      team.id !== currentTeam.id &&
      !state.stealAttemptedTeamIds.includes(team.id),
  );
}

export function applyCapture(
  state: GameState,
  teamId: string,
  territoryId: string,
  basePoints: number,
): { state: GameState; result: ScoreResult } {
  const territory = TERRITORY_BY_ID[territoryId];
  const territoryState = getTerritoryState(state, territoryId);
  if (!territory || !territoryState || territoryState.ownerTeamId) {
    return {
      state,
      result: {
        teamId,
        points: 0,
        bonusPoints: 0,
        journeyBonus: false,
        regionBonus: false,
        capturedTerritoryId: null,
      },
    };
  }

  let teams = state.teams.map((team) =>
    team.id === teamId ? { ...team, score: team.score + basePoints } : team,
  );
  const territories = state.territories.map((item) =>
    item.id === territoryId ? { ...item, ownerTeamId: teamId } : item,
  );

  const ownsEveryRegion = REGIONS.every((region) =>
    territories.some(
      (item) =>
        item.ownerTeamId === teamId &&
        TERRITORY_BY_ID[item.id]?.regionId === region.id,
    ),
  );
  const journeyBonusAwards = [...state.journeyBonusAwards];
  let bonusPoints = 0;

  if (ownsEveryRegion && !journeyBonusAwards.includes(teamId)) {
    bonusPoints = JOURNEY_BONUS;
    journeyBonusAwards.push(teamId);
    teams = teams.map((team) =>
      team.id === teamId ? { ...team, score: team.score + bonusPoints } : team,
    );
  }

  return {
    state: {
      ...state,
      teams,
      territories,
      journeyBonusAwards,
    },
    result: {
      teamId,
      points: basePoints + bonusPoints,
      bonusPoints,
      journeyBonus: bonusPoints > 0,
      regionBonus: false,
      capturedTerritoryId: territoryId,
    },
  };
}

export interface RankedTeam extends Team {
  rank: number;
  territoryCount: number;
  region3Count: number;
}

export function compareRankedTeams(a: RankedTeam, b: RankedTeam): number {
  return (
    b.score - a.score ||
    b.territoryCount - a.territoryCount ||
    b.region3Count - a.region3Count
  );
}

export function rankTeams(state: GameState): RankedTeam[] {
  const region3 = REGIONS.find((region) => region.order === 3);
  const rows: RankedTeam[] = state.teams.map((team) => ({
    ...team,
    rank: 0,
    territoryCount: getOwnedTerritoryCount(state, team.id),
    region3Count: region3
      ? getOwnedInRegion(state, team.id, region3.id)
      : 0,
  }));

  const sorted = [...rows].sort(
    (a, b) => compareRankedTeams(a, b) || a.slot - b.slot,
  );

  let currentRank = 1;
  return sorted.map((row, index) => {
    if (index > 0 && compareRankedTeams(sorted[index - 1], row) !== 0) {
      currentRank = index + 1;
    }
    return { ...row, rank: currentRank };
  });
}

export function getQuestionNumber(state: GameState): number {
  return Math.min(state.usedQuestionIds.length + 1, 18);
}

export function getRegionTerritories(regionId: RegionId): Territory[] {
  return TERRITORIES.filter((territory) => territory.regionId === regionId);
}
