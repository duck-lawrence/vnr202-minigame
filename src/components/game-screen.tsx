"use client";

import { useState } from "react";
import type { Dispatch } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { GameBoard } from "@/components/game-board";
import { FlagIcon, SparkIcon, UndoIcon } from "@/components/icons";
import { HistoricalEventStage } from "@/components/historical-event-stage";
import { QuestionStage } from "@/components/question-stage";
import { ScoreStrip } from "@/components/score-strip";
import { Button } from "@/components/ui/button";
import { drawOpportunityEffect, getCurrentTeam, getScoutElimination, OPPORTUNITY_LABELS } from "@/lib/game-rules";
import { QUESTION_BY_ID } from "@/data/questions";
import { TERRITORY_BY_ID } from "@/data/territories";
import type { GameAction } from "@/lib/reducer";
import type { GameState } from "@/types/game";

interface GameScreenProps {
  state: GameState;
  canUndo: boolean;
  dispatch: Dispatch<GameAction>;
}

export function GameScreen({ state, canUndo, dispatch }: GameScreenProps) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const currentTeam = getCurrentTeam(state);
  const isSelecting = state.phase === "selecting";
  const isEvent = state.phase.startsWith("event-");
  const questionNumber = Math.min(state.usedQuestionIds.length + 1, 18);

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1720px] shrink-0 items-center justify-between gap-3 px-[var(--page-gutter)] py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-terracotta-soft text-terracotta-dark">
            <FlagIcon className="size-4" />
          </span>
          <div><p className="display text-xl leading-tight text-ink">Bản đồ thời cơ</p><p className="text-sm font-bold uppercase tracking-[0.12em] text-muted">1939–1945</p></div>
        </div>

        <span className="rounded-full border-2 border-line bg-paper px-4 py-2 text-sm font-extrabold text-ink">
          {isEvent ? `Biến cố ${Math.ceil(state.usedQuestionIds.length / 6)}/3` : `Câu ${questionNumber}/18`}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            title="Hoàn tác thao tác gần nhất"
          >
            <UndoIcon className="size-4" />
            Hoàn tác
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowEndConfirm(true)}
            className="border-red/25 text-red hover:border-red/45 hover:bg-red-soft"
          >
            Kết thúc trận
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1720px] shrink-0 px-[var(--page-gutter)]">
        <ScoreStrip state={state} />
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-[1720px] flex-1 flex-col px-[var(--page-gutter)] pb-3 pt-1.5">
        {isSelecting ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-2.5">
              <p className="text-base font-semibold text-ink">Lượt của <span className="font-extrabold">Nhóm {currentTeam?.slot ?? 1}</span> · chọn một địa bàn còn trống</p>
              {state.pendingOpportunity ? (
                <span className="rounded-full bg-amber-soft px-4 py-2 text-sm font-extrabold text-ink">{OPPORTUNITY_LABELS[state.pendingOpportunity.effect].name} · {OPPORTUNITY_LABELS[state.pendingOpportunity.effect].description}</span>
              ) : currentTeam && !currentTeam.opportunityUsed ? (
                <Button variant="secondary" onClick={() => dispatch({ type: "ACTIVATE_OPPORTUNITY", effect: drawOpportunityEffect() })}>
                  <SparkIcon className="size-4" /> Chớp thời cơ
                </Button>
              ) : (
                <span className="text-sm font-semibold text-muted">Chớp thời cơ đã dùng</span>
              )}
            </div>
            <GameBoard
              state={state}
              disabled={!isSelecting}
              onSelect={(territoryId) => {
                const territory = TERRITORY_BY_ID[territoryId];
                const question = territory ? QUESTION_BY_ID[territory.questionId] : null;
                dispatch({
                  type: "SELECT_TERRITORY",
                  territoryId,
                  scoutEliminatedOptionId:
                    state.pendingOpportunity?.effect === "scout" && question
                      ? getScoutElimination(question.correctOptionId)
                      : undefined,
                });
              }}
            />
          </div>
        ) : isEvent ? (
          <HistoricalEventStage state={state} dispatch={dispatch} />
        ) : (
          <QuestionStage key={`${state.currentQuestionId}-${state.phase}-${state.stealTeamId ?? "main"}`} state={state} dispatch={dispatch} />
        )}
      </div>

      <ConfirmDialog
        open={showEndConfirm}
        title="Kết thúc trận?"
        description="Bảng xếp hạng sẽ được chốt theo điểm và số địa bàn hiện tại."
        confirmLabel="Kết thúc trận"
        onConfirm={() => {
          setShowEndConfirm(false);
          dispatch({ type: "END_GAME" });
        }}
        onCancel={() => setShowEndConfirm(false)}
      />
    </main>
  );
}
