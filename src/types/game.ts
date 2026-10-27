export type RegionId = "chien-luoc" | "chuan-bi" | "tong-khoi-nghia";

export type OptionId = "A" | "B" | "C" | "D";

export type Phase =
  | "setup"
  | "selecting"
  | "question"
  | "main-result"
  | "steal-select"
  | "steal-question"
  | "steal-result"
  | "event-intro"
  | "event-open"
  | "event-answering"
  | "event-result"
  | "finished";

export type AnswerOutcome = "correct" | "wrong" | "timeout";
export type OpportunityEffect = "scout" | "reinforce" | "decisive";
export type EventOutcome = "correct" | "timeout" | "exhausted";
export type EventAnswer = string[] | Record<string, string>;

export interface TeamDefinition {
  slot: number;
  color: string;
  softColor: string;
  onColor: string;
}

export interface Team {
  id: string;
  slot: number;
  name: string;
  score: number;
  opportunityUsed: boolean;
}

export interface Region {
  id: RegionId;
  order: number;
  name: string;
  period: string;
  description: string;
  image: string;
  accent: string;
  softColor: string;
}

export interface Territory {
  id: string;
  name: string;
  regionId: RegionId;
  questionId: string;
  image: string;
}

export interface TerritoryState {
  id: string;
  ownerTeamId: string | null;
}

export interface QuestionOption {
  id: OptionId;
  text: string;
}

export interface Question {
  id: string;
  territoryId: string;
  topic: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: OptionId;
  explanation: string;
  sourcePage: string;
}

export interface ScoreResult {
  teamId: string;
  points: number;
  bonusPoints: number;
  journeyBonus?: boolean;
  regionBonus?: boolean;
  capturedTerritoryId: string | null;
}

interface HistoricalEventBase {
  id: string;
  checkpoint: 6 | 12 | 18;
  title: string;
  prompt: string;
  explanation: string;
  sourcePage: string;
  points: number;
}

export interface OrderHistoricalEvent extends HistoricalEventBase {
  type: "order";
  items: { id: string; text: string }[];
  correctOrder: string[];
}

export interface MatchingHistoricalEvent extends HistoricalEventBase {
  type: "matching";
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
  correctPairs: Record<string, string>;
}

export interface MultiSelectHistoricalEvent extends HistoricalEventBase {
  type: "multi-select";
  options: { id: string; text: string }[];
  correctOptionIds: string[];
}

export type HistoricalEvent =
  | OrderHistoricalEvent
  | MatchingHistoricalEvent
  | MultiSelectHistoricalEvent;

export interface GameState {
  phase: Phase;
  teams: Team[];
  territories: TerritoryState[];
  currentTeamIndex: number;
  currentTerritoryId: string | null;
  currentQuestionId: string | null;
  mainOutcome: AnswerOutcome | null;
  stealTeamId: string | null;
  stealAttempts: number;
  stealAttemptedTeamIds: string[];
  stealOutcome: AnswerOutcome | null;
  rejectedOptionIds: OptionId[];
  lastSubmittedOptionId: OptionId | null;
  usedQuestionIds: string[];
  journeyBonusAwards: string[];
  regionBonusAwards: string[];
  pendingOpportunity: { teamId: string; effect: OpportunityEffect } | null;
  activeOpportunity: { teamId: string; effect: OpportunityEffect } | null;
  currentEventId: string | null;
  completedEventIds: string[];
  eventAttemptedTeamIds: string[];
  eventAnsweringTeamId: string | null;
  eventOutcome: EventOutcome | null;
  eventWinnerTeamId: string | null;
  lastResult: ScoreResult | null;
  answerRevealed: boolean;
}

export interface GameStore {
  present: GameState;
  past: GameState[];
}

export interface StoredGame {
  version: number;
  savedAt: number;
  store: GameStore;
}
