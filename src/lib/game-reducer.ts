import {
  HISTORICAL_EVENT_BY_CHECKPOINT,
  HISTORICAL_EVENT_BY_ID,
} from "@/data/historical-events";
import { QUESTION_BY_ID } from "@/data/questions";
import { TERRITORY_BY_ID } from "@/data/territories";
import {
  DECISIVE_BONUS,
  FIRST_STEAL_POINTS,
  MAIN_POINTS,
  MAX_HISTORY,
  OPPORTUNITY_EFFECTS,
  SECOND_STEAL_POINTS,
  applyCapture,
  createInitialState,
  createSetupState,
  getCurrentTeam,
  getEligibleStealTeams,
  getTerritoryStatus,
  isHistoricalEventAnswerCorrect,
} from "@/lib/game-rules";
import { validateTeamNames } from "@/lib/validation";
import type {
  EventAnswer,
  GameState,
  GameStore,
  OpportunityEffect,
  OptionId,
  ScoreResult,
} from "@/types/game";

export type GameAction =
  | { type: "START_GAME"; teamNames: string[] }
  | { type: "ACTIVATE_OPPORTUNITY"; effect: OpportunityEffect }
  | { type: "SELECT_TERRITORY"; territoryId: string; scoutEliminatedOptionId?: OptionId }
  | { type: "SUBMIT_MAIN_ANSWER"; optionId: OptionId }
  | { type: "TIMEOUT_MAIN" }
  | { type: "SELECT_STEAL_TEAM"; teamId: string }
  | { type: "SUBMIT_STEAL_ANSWER"; optionId: OptionId }
  | { type: "SWITCH_STEAL_TEAM" }
  | { type: "SKIP_STEAL" }
  | { type: "END_ROUND" }
  | { type: "START_EVENT" }
  | { type: "SELECT_EVENT_TEAM"; teamId: string }
  | { type: "SUBMIT_EVENT_ANSWER"; answer: EventAnswer }
  | { type: "SKIP_EVENT" }
  | { type: "END_EVENT" }
  | { type: "END_GAME" }
  | { type: "UNDO" }
  | { type: "RESET_GAME" }
  | { type: "HYDRATE"; store: GameStore };

export const initialStore: GameStore = { present: createSetupState(), past: [] };

function commit(store: GameStore, next: GameState): GameStore {
  if (next === store.present) return store;
  return { present: next, past: [...store.past, store.present].slice(-MAX_HISTORY) };
}

function zeroResult(teamId: string): ScoreResult {
  return { teamId, points: 0, bonusPoints: 0, journeyBonus: false, capturedTerritoryId: null };
}

function afterFailedSteal(
  store: GameStore,
  rejectedOptionIds: OptionId[],
  lastSubmittedOptionId: OptionId | null,
): GameStore {
  const state = store.present;
  if (!state.stealTeamId) return store;
  const next: GameState = {
    ...state,
    phase: "steal-select",
    stealAttempts: state.stealAttempts + 1,
    stealAttemptedTeamIds: state.stealAttemptedTeamIds.includes(state.stealTeamId)
      ? state.stealAttemptedTeamIds
      : [...state.stealAttemptedTeamIds, state.stealTeamId],
    stealOutcome: "wrong",
    rejectedOptionIds,
    lastSubmittedOptionId,
    lastResult: state.stealTeamId ? zeroResult(state.stealTeamId) : null,
    stealTeamId: null,
    answerRevealed: false,
  };
  if (getEligibleStealTeams(next).length === 0) {
    next.phase = "steal-result";
    next.answerRevealed = true;
  }
  return commit(store, next);
}

export function gameReducer(store: GameStore, action: GameAction): GameStore {
  const state = store.present;

  switch (action.type) {
    case "START_GAME": {
      if (validateTeamNames(action.teamNames).length > 0) return store;
      return { present: createInitialState(action.teamNames), past: [] };
    }
    case "ACTIVATE_OPPORTUNITY": {
      const team = getCurrentTeam(state);
      if (
        state.phase !== "selecting" || !team || team.opportunityUsed ||
        state.pendingOpportunity || !OPPORTUNITY_EFFECTS.includes(action.effect)
      ) return store;
      return commit(store, {
        ...state,
        teams: state.teams.map((item) =>
          item.id === team.id ? { ...item, opportunityUsed: true } : item,
        ),
        pendingOpportunity: { teamId: team.id, effect: action.effect },
      });
    }
    case "SELECT_TERRITORY": {
      if (
        state.phase !== "selecting" ||
        getTerritoryStatus(state, action.territoryId) !== "available"
      ) return store;
      const territory = TERRITORY_BY_ID[action.territoryId];
      const question = territory ? QUESTION_BY_ID[territory.questionId] : null;
      if (!territory || !question) return store;
      const team = getCurrentTeam(state);
      const opportunity =
        team && state.pendingOpportunity?.teamId === team.id
          ? state.pendingOpportunity
          : null;
      const scoutChoice = action.scoutEliminatedOptionId;
      const rejectedOptionIds =
        opportunity?.effect === "scout" && scoutChoice && scoutChoice !== question.correctOptionId
          ? [scoutChoice]
          : [];
      return commit(store, {
        ...state,
        phase: "question",
        currentTerritoryId: territory.id,
        currentQuestionId: territory.questionId,
        mainOutcome: null,
        stealTeamId: null,
        stealAttempts: 0,
        stealAttemptedTeamIds: [],
        stealOutcome: null,
        rejectedOptionIds,
        lastSubmittedOptionId: null,
        pendingOpportunity: null,
        activeOpportunity: opportunity,
        lastResult: null,
        answerRevealed: false,
      });
    }
    case "SUBMIT_MAIN_ANSWER": {
      const team = getCurrentTeam(state);
      const question = state.currentQuestionId ? QUESTION_BY_ID[state.currentQuestionId] : null;
      if (
        state.phase !== "question" || !state.currentTerritoryId || !team || !question ||
        state.rejectedOptionIds.includes(action.optionId)
      ) return store;
      if (action.optionId === question.correctOptionId) {
        const base = state.activeOpportunity?.effect === "decisive"
          ? MAIN_POINTS + DECISIVE_BONUS
          : MAIN_POINTS;
        const applied = applyCapture(state, team.id, state.currentTerritoryId, base);
        return commit(store, {
          ...applied.state,
          phase: "main-result",
          mainOutcome: "correct",
          lastSubmittedOptionId: action.optionId,
          lastResult: applied.result,
          answerRevealed: true,
        });
      }
      return commit(store, {
        ...state,
        phase: "steal-select",
        mainOutcome: "wrong",
        rejectedOptionIds: [...state.rejectedOptionIds, action.optionId],
        lastSubmittedOptionId: action.optionId,
        lastResult: zeroResult(team.id),
        answerRevealed: false,
      });
    }
    case "TIMEOUT_MAIN": {
      const team = getCurrentTeam(state);
      if (state.phase !== "question" || !team) return store;
      return commit(store, {
        ...state,
        phase: "steal-select",
        mainOutcome: "timeout",
        lastSubmittedOptionId: null,
        lastResult: zeroResult(team.id),
        answerRevealed: false,
      });
    }
    case "SELECT_STEAL_TEAM": {
      if (
        state.phase !== "steal-select" ||
        !getEligibleStealTeams(state).some((team) => team.id === action.teamId)
      ) return store;
      return commit(store, {
        ...state,
        phase: "steal-question",
        stealTeamId: action.teamId,
        stealOutcome: null,
      });
    }
    case "SUBMIT_STEAL_ANSWER": {
      const question = state.currentQuestionId ? QUESTION_BY_ID[state.currentQuestionId] : null;
      if (
        state.phase !== "steal-question" || !state.stealTeamId ||
        !state.currentTerritoryId || !question || state.rejectedOptionIds.includes(action.optionId)
      ) return store;
      if (action.optionId === question.correctOptionId) {
        const points = state.stealAttempts === 0 ? FIRST_STEAL_POINTS : SECOND_STEAL_POINTS;
        const applied = applyCapture(state, state.stealTeamId, state.currentTerritoryId, points);
        return commit(store, {
          ...applied.state,
          phase: "steal-result",
          stealAttempts: state.stealAttempts + 1,
          stealAttemptedTeamIds: state.stealAttemptedTeamIds.includes(state.stealTeamId)
            ? state.stealAttemptedTeamIds
            : [...state.stealAttemptedTeamIds, state.stealTeamId],
          stealOutcome: "correct",
          lastSubmittedOptionId: action.optionId,
          lastResult: applied.result,
          answerRevealed: true,
        });
      }
      return afterFailedSteal(
        store,
        [...state.rejectedOptionIds, action.optionId],
        action.optionId,
      );
    }
    case "SWITCH_STEAL_TEAM": {
      if (state.phase !== "steal-question" || !state.stealTeamId) return store;
      const next: GameState = {
        ...state,
        phase: "steal-select",
        stealAttemptedTeamIds: state.stealAttemptedTeamIds.includes(state.stealTeamId)
          ? state.stealAttemptedTeamIds
          : [...state.stealAttemptedTeamIds, state.stealTeamId],
        stealTeamId: null,
        stealOutcome: null,
        lastSubmittedOptionId: null,
        lastResult: null,
        answerRevealed: false,
      };
      if (getEligibleStealTeams(next).length === 0) {
        next.phase = "steal-result";
        next.answerRevealed = true;
      }
      return commit(store, next);
    }
    case "SKIP_STEAL":
      if (state.phase !== "steal-select" && state.phase !== "steal-question") return store;
      return commit(store, { ...state, phase: "steal-result", stealTeamId: null, answerRevealed: true });
    case "END_ROUND": {
      if (
        (state.phase !== "main-result" && state.phase !== "steal-result") ||
        !state.answerRevealed || !state.currentQuestionId
      ) return store;
      const used = state.usedQuestionIds.includes(state.currentQuestionId)
        ? state.usedQuestionIds
        : [...state.usedQuestionIds, state.currentQuestionId];
      const event = HISTORICAL_EVENT_BY_CHECKPOINT[used.length as 6 | 12 | 18];
      const opensEvent = Boolean(event) && !state.completedEventIds.includes(event.id);
      return commit(store, {
        ...state,
        phase: opensEvent ? "event-intro" : used.length >= 18 ? "finished" : "selecting",
        usedQuestionIds: used,
        currentTeamIndex: opensEvent || used.length >= 18
          ? state.currentTeamIndex
          : (state.currentTeamIndex + 1) % state.teams.length,
        currentTerritoryId: null,
        currentQuestionId: null,
        mainOutcome: null,
        stealTeamId: null,
        stealAttempts: 0,
        stealAttemptedTeamIds: [],
        stealOutcome: null,
        rejectedOptionIds: [],
        lastSubmittedOptionId: null,
        activeOpportunity: null,
        currentEventId: opensEvent ? event.id : null,
        eventAttemptedTeamIds: [],
        eventAnsweringTeamId: null,
        eventOutcome: null,
        eventWinnerTeamId: null,
        lastResult: null,
        answerRevealed: false,
      });
    }
    case "START_EVENT":
      if (state.phase !== "event-intro" || !state.currentEventId) return store;
      return commit(store, { ...state, phase: "event-open" });
    case "SELECT_EVENT_TEAM":
      if (
        state.phase !== "event-open" || state.eventAttemptedTeamIds.includes(action.teamId) ||
        !state.teams.some((team) => team.id === action.teamId)
      ) return store;
      return commit(store, { ...state, phase: "event-answering", eventAnsweringTeamId: action.teamId });
    case "SUBMIT_EVENT_ANSWER": {
      const event = state.currentEventId ? HISTORICAL_EVENT_BY_ID[state.currentEventId] : null;
      if (state.phase !== "event-answering" || !state.eventAnsweringTeamId || !event) return store;
      const teamId = state.eventAnsweringTeamId;
      if (isHistoricalEventAnswerCorrect(event, action.answer)) {
        return commit(store, {
          ...state,
          phase: "event-result",
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, score: team.score + event.points } : team,
          ),
          eventOutcome: "correct",
          eventWinnerTeamId: teamId,
        });
      }
      const attempted = [...state.eventAttemptedTeamIds, teamId];
      const exhausted = attempted.length >= state.teams.length;
      return commit(store, {
        ...state,
        phase: exhausted ? "event-result" : "event-open",
        eventAttemptedTeamIds: attempted,
        eventAnsweringTeamId: null,
        eventOutcome: exhausted ? "exhausted" : null,
      });
    }
    case "SKIP_EVENT":
      if (state.phase !== "event-open" && state.phase !== "event-answering") return store;
      return commit(store, {
        ...state,
        phase: "event-result",
        eventOutcome: "timeout",
        eventAnsweringTeamId: null,
      });
    case "END_EVENT": {
      if (state.phase !== "event-result" || !state.currentEventId) return store;
      const finished = state.usedQuestionIds.length >= 18;
      return commit(store, {
        ...state,
        phase: finished ? "finished" : "selecting",
        currentTeamIndex: finished
          ? state.currentTeamIndex
          : (state.currentTeamIndex + 1) % state.teams.length,
        completedEventIds: state.completedEventIds.includes(state.currentEventId)
          ? state.completedEventIds
          : [...state.completedEventIds, state.currentEventId],
        currentEventId: null,
        eventAttemptedTeamIds: [],
        eventAnsweringTeamId: null,
        eventOutcome: null,
        eventWinnerTeamId: null,
      });
    }
    case "END_GAME":
      if (state.phase === "setup" || state.phase === "finished") return store;
      return commit(store, {
        ...state,
        phase: "finished",
        currentTerritoryId: null,
        currentQuestionId: null,
        currentEventId: null,
        pendingOpportunity: null,
        activeOpportunity: null,
        eventAnsweringTeamId: null,
        answerRevealed: true,
      });
    case "UNDO":
      if (store.past.length === 0) return store;
      return { present: store.past[store.past.length - 1], past: store.past.slice(0, -1) };
    case "RESET_GAME":
      return { present: createSetupState(), past: [] };
    case "HYDRATE":
      return action.store;
    default:
      return store;
  }
}
