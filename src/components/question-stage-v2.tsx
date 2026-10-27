"use client";

import { useState } from "react";
import type { Dispatch } from "react";
import { CheckIcon, ClockIcon, XIcon } from "@/components/icons";
import { TeamBadge } from "@/components/team-badge";
import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { QUESTION_BY_ID } from "@/data/questions";
import { REGION_BY_ID } from "@/data/regions";
import { TERRITORY_BY_ID } from "@/data/territories";
import {
  MAIN_SECONDS,
  OPPORTUNITY_LABELS,
  STEAL_SECONDS,
  REINFORCED_MAIN_SECONDS,
  getCurrentTeam,
  getEligibleStealTeams,
  getQuestionNumber,
  getTeamById,
} from "@/lib/game-rules";
import type { GameAction } from "@/lib/reducer";
import { cn } from "@/lib/cn";
import type { GameState, OptionId, QuestionOption } from "@/types/game";

interface QuestionStageProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

function OptionCard({
  option,
  correct,
  revealed,
  rejected,
  selected,
  disabled,
  onClick,
}: {
  option: QuestionOption;
  correct: boolean;
  revealed: boolean;
  rejected: boolean;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || rejected || revealed}
      onClick={onClick}
      className={cn(
        "group flex min-h-0 items-center gap-4 rounded-[22px] border-2 px-5 py-4 text-left transition",
        "border-line bg-paper hover:border-terracotta/55",
        selected && !rejected && "border-terracotta bg-terracotta-soft/55",
        rejected && "border-red/35 bg-red-soft text-muted",
        revealed && correct && "border-green/55 bg-green-soft",
        disabled && !rejected && !revealed && "cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-cream-deep text-lg font-extrabold text-ink-soft",
          selected && !rejected && "bg-terracotta text-white",
          rejected && "bg-red/15 text-red",
          revealed && correct && "bg-green text-white",
        )}
      >
        {revealed && correct ? <CheckIcon className="size-5" /> : rejected ? <XIcon className="size-5" /> : option.id}
      </span>
      <span className={cn("text-[clamp(1rem,1.15vw,1.35rem)] font-semibold leading-snug text-ink", rejected && "line-through opacity-65")}>
        {option.text}
      </span>
    </button>
  );
}

export function QuestionStageV2({ state, dispatch }: QuestionStageProps) {
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const question = state.currentQuestionId ? QUESTION_BY_ID[state.currentQuestionId] : null;
  const territory = state.currentTerritoryId ? TERRITORY_BY_ID[state.currentTerritoryId] : null;
  const currentTeam = getCurrentTeam(state);
  const stealTeam = state.stealTeamId ? getTeamById(state, state.stealTeamId) : null;

  if (!question || !territory || !currentTeam) return null;
  const region = REGION_BY_ID[territory.regionId];
  const isAnswering = state.phase === "question" || state.phase === "steal-question";
  const answeringTeam = state.phase === "steal-question" && stealTeam ? stealTeam : currentTeam;
  const eligibleTeams = getEligibleStealTeams(state);
  const duration = state.phase === "question" && state.activeOpportunity?.effect === "reinforce"
    ? REINFORCED_MAIN_SECONDS
    : state.phase === "question"
      ? MAIN_SECONDS
      : STEAL_SECONDS;
  const opportunity = state.activeOpportunity
    ? OPPORTUNITY_LABELS[state.activeOpportunity.effect]
    : null;
  const resultTeam = state.lastResult ? getTeamById(state, state.lastResult.teamId) : null;

  const submit = () => {
    if (!selected) return;
    dispatch(
      state.phase === "question"
        ? { type: "SUBMIT_MAIN_ANSWER", optionId: selected }
        : { type: "SUBMIT_STEAL_ANSWER", optionId: selected },
    );
  };
  const timeout = () => dispatch({ type: "TIMEOUT_MAIN" });

  return (
    <section className="game-panel grid h-full min-h-0 grid-cols-[35%_65%] overflow-hidden rounded-[30px]">
      <div className="relative min-h-0 overflow-hidden bg-cream-deep">
        <div className="territory-thumb absolute inset-0" style={{ backgroundImage: `url(${territory.image})` }} />
        <div className="absolute inset-x-5 bottom-5 rounded-[22px] border border-white/60 bg-paper/94 px-5 py-4 shadow-xl backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-terracotta">Chương {region?.order} · Câu {getQuestionNumber(state)}/18</p>
          <h2 className="display mt-1 text-[clamp(1.75rem,2.2vw,2.6rem)] leading-tight text-ink">{territory.name}</h2>
          <p className="mt-1 text-sm text-ink-soft">{region?.name}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col px-6 py-5 2xl:px-8 2xl:py-7">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TeamBadge slot={answeringTeam.slot} size="md" />
            <div>
              <p className="text-sm font-bold text-ink">
                {state.phase === "steal-question" ? "Cướp quyền" : "Lượt chính"} · Nhóm {answeringTeam.slot}
              </p>
              <p className="text-sm text-muted">
                {state.phase === "steal-question" ? `Lượt trả lời cướp ${state.stealAttempts + 1}/2` : question.topic}
              </p>
            </div>
          </div>
          {opportunity ? (
            <span className="rounded-full bg-amber-soft px-4 py-2 text-sm font-bold text-ink">
              Chớp thời cơ · {opportunity.name}
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 shrink-0 text-[clamp(1.6rem,2vw,2.35rem)] font-extrabold leading-[1.22] tracking-[-0.025em] text-ink">
          {question.prompt}
        </h1>

        <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
          {question.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              correct={option.id === question.correctOptionId}
              revealed={state.answerRevealed}
              rejected={state.rejectedOptionIds.includes(option.id)}
              selected={selected === option.id}
              disabled={!isAnswering || !timerStarted}
              onClick={() => setSelected(option.id)}
            />
          ))}
        </div>

        {state.answerRevealed ? (
          <div className="mt-3 rounded-2xl border border-green/25 bg-green-soft px-4 py-3">
            {state.lastResult && resultTeam && state.lastResult.points > 0 ? (
              <p className="mb-1 text-sm font-extrabold text-ink">
                Nhóm {resultTeam.slot} · +{state.lastResult.points} điểm
                {state.lastResult.journeyBonus ? " · Hoàn thành Hành trình lịch sử" : ""}
              </p>
            ) : null}
            <p className="text-sm font-extrabold text-green">Đáp án đúng: {question.correctOptionId} · {question.options.find((item) => item.id === question.correctOptionId)?.text}</p>
            <p className="mt-1 text-sm leading-5 text-ink-soft">{question.explanation}</p>
            <p className="mt-1 text-sm text-muted">Nguồn: {question.sourcePage}</p>
          </div>
        ) : null}

        <div className="mt-3 shrink-0">
          {isAnswering ? (
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Timer
                key={`${question.id}-${state.phase}-${answeringTeam.id}`}
                duration={duration}
                label={state.phase === "question" ? "Thời gian trả lời" : "Thời gian cướp quyền"}
                onStart={() => setTimerStarted(true)}
              />
              <div className="grid min-w-56 grid-rows-2 gap-2">
                <Button variant="primary" disabled={!selected || !timerStarted} onClick={submit} className="rounded-xl px-5">
                  {selected ? `Chốt đáp án ${selected}` : "Chọn đáp án"}
                </Button>
                {state.phase === "question" ? (
                  <Button variant="ghost" disabled={!timerStarted} onClick={timeout} className="rounded-xl">
                    <ClockIcon className="size-4" /> Hết giờ
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" onClick={() => dispatch({ type: "SWITCH_STEAL_TEAM" })} className="rounded-xl px-3">
                      Đổi nhóm
                    </Button>
                    <Button variant="ghost" onClick={() => dispatch({ type: "SKIP_STEAL" })} className="rounded-xl px-3">
                      Bỏ qua
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {state.phase === "steal-select" ? (
            <div className="rounded-2xl border border-terracotta/25 bg-terracotta-soft/45 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-ink">Cơ hội cướp quyền</p>
                  <p className="text-sm text-muted">Chọn đội giơ tay nhanh nhất. Mỗi đội chỉ thử một lần.</p>
                </div>
                <Button variant="ghost" onClick={() => dispatch({ type: "SKIP_STEAL" })}>Bỏ qua</Button>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {eligibleTeams.map((team) => (
                  <button key={team.id} type="button" onClick={() => dispatch({ type: "SELECT_STEAL_TEAM", teamId: team.id })} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-paper px-3 py-2.5 font-bold text-ink hover:border-terracotta">
                    <TeamBadge slot={team.slot} size="sm" /> Nhóm {team.slot}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {(state.phase === "main-result" || state.phase === "steal-result") && state.answerRevealed ? (
            <Button variant="primary" className="w-full text-lg" onClick={() => dispatch({ type: "END_ROUND" })}>
              {[5, 11, 17].includes(state.usedQuestionIds.length) ? "Đến Biến cố lịch sử" : "Câu tiếp theo"}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
