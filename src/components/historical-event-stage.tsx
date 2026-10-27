"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, DragEvent } from "react";
import { ClockIcon, SparkIcon, TrophyIcon } from "@/components/icons";
import { TeamBadge } from "@/components/team-badge";
import { Button } from "@/components/ui/button";
import { HISTORICAL_EVENT_BY_ID } from "@/data/historical-events";
import type { GameAction } from "@/lib/reducer";
import { isHistoricalEventAnswerCorrect } from "@/lib/game-rules";
import { cn } from "@/lib/cn";
import type { EventAnswer, GameState } from "@/types/game";

interface HistoricalEventStageProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  if (result.length > 1 && result.every((value, index) => value === values[index])) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

export function HistoricalEventStage({ state, dispatch }: HistoricalEventStageProps) {
  const event = state.currentEventId ? HISTORICAL_EVENT_BY_ID[state.currentEventId] : null;
  const [remaining, setRemaining] = useState(45);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [sourceOrder] = useState(() =>
    event?.type === "order" ? shuffle(event.items.map((item) => item.id)) : [],
  );

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setDeadline(null);
      }
    };
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const answeringTeam = state.teams.find((team) => team.id === state.eventAnsweringTeamId);
  const winner = state.teams.find((team) => team.id === state.eventWinnerTeamId);
  const eventNumber = event ? event.checkpoint / 6 : 1;
  const isResult = state.phase === "event-result";
  const canEdit = state.phase === "event-answering";
  const answer: EventAnswer = useMemo(() => {
    if (!event) return [];
    if (event.type === "matching") return pairs;
    return event.type === "order" ? order : selected;
  }, [event, order, pairs, selected]);
  const answerComplete = !event
    ? false
    : event.type === "order"
      ? order.length === event.items.length
      : event.type === "matching"
        ? Object.keys(pairs).length === event.leftItems.length
        : selected.length === event.correctOptionIds.length;

  if (!event) return null;

  const shownOrder = event.type === "order" && isResult ? event.correctOrder : order;
  const shownPairs = event.type === "matching" && isResult ? event.correctPairs : pairs;
  const shownSelected = event.type === "multi-select" && isResult ? event.correctOptionIds : selected;

  const clearDraft = () => {
    setOrder([]);
    setPairs({});
    setSelected([]);
    setSelectedMatch(null);
  };

  const chooseTeam = (teamId: string) => {
    setDeadline(null);
    clearDraft();
    dispatch({ type: "SELECT_EVENT_TEAM", teamId });
  };

  const submitAnswer = () => {
    const correct = isHistoricalEventAnswerCorrect(event, answer);
    const exhausted = state.eventAttemptedTeamIds.length + 1 >= state.teams.length;
    dispatch({ type: "SUBMIT_EVENT_ANSWER", answer });
    clearDraft();
    if (!correct && !exhausted) {
      setDeadline(Date.now() + remaining * 1000);
    } else {
      setDeadline(null);
    }
  };

  const skipEvent = () => {
    setDeadline(null);
    dispatch({ type: "SKIP_EVENT" });
  };

  const assignMatch = (leftId: string, rightId: string) => {
    if (!canEdit || !rightId) return;
    setPairs((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([key, value]) => key !== leftId && value !== rightId),
      );
      return { ...next, [leftId]: rightId };
    });
    setSelectedMatch(null);
  };

  const returnMatchToTray = (rightId: string) => {
    if (!canEdit || !rightId) return;
    setPairs((current) => Object.fromEntries(
      Object.entries(current).filter(([, value]) => value !== rightId),
    ));
    setSelectedMatch(null);
  };

  const readDraggedMatch = (dragEvent: DragEvent<HTMLElement>) =>
    dragEvent.dataTransfer.getData("text/plain");

  return (
    <section className="game-panel flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] p-6 2xl:p-8">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-terracotta text-white"><SparkIcon className="size-6" /></span>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-terracotta">Biến cố lịch sử {eventNumber}/3</p>
            <h1 className="display mt-1 text-[clamp(2rem,3vw,3.4rem)] leading-none text-ink">{event.title}</h1>
          </div>
        </div>
        <div className={cn("flex items-center gap-3 rounded-2xl border px-5 py-3", remaining <= 10 ? "border-red/35 bg-red-soft" : "border-line bg-paper-soft")}>
          <ClockIcon className="size-5" />
          <span className="timer-digits text-3xl font-extrabold text-ink">{remaining}</span>
          <span className="text-sm font-semibold text-muted">giây</span>
        </div>
      </div>

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[1fr_260px] gap-5">
        <div className="flex min-h-0 flex-col rounded-[24px] border border-line bg-paper-soft p-5">
          <p className="text-[clamp(1.2rem,1.6vw,1.8rem)] font-extrabold leading-snug text-ink">{event.prompt}</p>

          <div className="mt-4 min-h-0 flex-1">
            {event.type === "order" ? (
              <div className="grid h-full grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted">Các mốc đã xáo trộn</p>
                  {sourceOrder.filter((id) => !shownOrder.includes(id)).map((id) => (
                    <button
                      key={id}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => setOrder([...order, id])}
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-left font-semibold text-ink transition hover:border-terracotta disabled:cursor-not-allowed"
                    >
                      {event.items.find((item) => item.id === id)?.text}
                    </button>
                  ))}
                  {sourceOrder.every((id) => shownOrder.includes(id)) ? (
                    <div className="rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm font-semibold text-muted">Đã xếp đủ bốn mốc</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted">{isResult ? "Đáp án đúng" : "Trình tự đội chọn"}</p>
                  {shownOrder.map((id, index) => (
                    <button key={id} type="button" disabled={!canEdit} onClick={() => setOrder(order.filter((item) => item !== id))} className="flex w-full items-center gap-3 rounded-xl border border-terracotta/30 bg-terracotta-soft px-4 py-3 text-left font-semibold text-ink disabled:cursor-default">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">{index + 1}</span>
                      {event.items.find((item) => item.id === id)?.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {event.type === "matching" ? (
              <div className="flex h-full min-h-0 flex-col gap-3">
                <div
                  className="grid grid-cols-2 gap-2 rounded-2xl border border-dashed border-terracotta/35 bg-terracotta-soft/35 p-3"
                  onDragOver={(dragEvent) => { if (canEdit) dragEvent.preventDefault(); }}
                  onDrop={(dragEvent) => {
                    dragEvent.preventDefault();
                    returnMatchToTray(readDraggedMatch(dragEvent));
                  }}
                >
                  {event.rightItems.map((right) => {
                    const assigned = Object.values(shownPairs).includes(right.id);
                    return (
                      <button
                        key={right.id}
                        type="button"
                        data-testid={`matching-choice-${right.id}`}
                        draggable={canEdit}
                        disabled={!canEdit}
                        onDragStart={(dragEvent) => dragEvent.dataTransfer.setData("text/plain", right.id)}
                        onClick={() => setSelectedMatch(selectedMatch === right.id ? null : right.id)}
                        className={cn(
                          "rounded-xl border bg-paper px-3 py-2 text-left text-sm font-bold text-ink transition disabled:cursor-not-allowed",
                          selectedMatch === right.id ? "border-terracotta ring-2 ring-terracotta/20" : "border-line",
                          assigned && "border-green/35 bg-green-soft",
                        )}
                      >
                        {right.text}
                        <span className="mt-1 block text-xs font-semibold text-muted">{assigned ? "Đã ghép · kéo về đây để gỡ" : "Kéo hoặc bấm để chọn"}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
                  {event.leftItems.map((left) => {
                    const rightId = shownPairs[left.id];
                    const right = event.rightItems.find((item) => item.id === rightId);
                    return (
                      <button
                        key={left.id}
                        type="button"
                        data-testid={`matching-target-${left.id}`}
                        disabled={!canEdit}
                        onClick={() => {
                          if (selectedMatch) assignMatch(left.id, selectedMatch);
                          else if (rightId) returnMatchToTray(rightId);
                        }}
                        onDragOver={(dragEvent) => { if (canEdit) dragEvent.preventDefault(); }}
                        onDrop={(dragEvent) => {
                          dragEvent.preventDefault();
                          assignMatch(left.id, readDraggedMatch(dragEvent));
                        }}
                        className={cn(
                          "rounded-2xl border-2 p-3 text-left transition disabled:cursor-not-allowed",
                          right ? "border-green/35 bg-green-soft" : "border-dashed border-line bg-paper",
                        )}
                      >
                        <span className="block text-base font-extrabold text-ink">{left.text}</span>
                        <span className={cn("mt-2 block rounded-xl px-3 py-2 text-sm font-semibold", right ? "bg-paper text-ink" : "bg-cream-deep text-muted")}>
                          {right?.text ?? (selectedMatch ? "Bấm để đặt đáp án đã chọn" : "Thả đáp án vào đây")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {event.type === "multi-select" ? (
              <div className="grid grid-cols-2 gap-3">
                {event.options.map((option) => {
                  const active = shownSelected.includes(option.id);
                  const incorrectAtResult = isResult && !active;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={!canEdit || (!active && selected.length >= 3)}
                      onClick={() => setSelected(active ? selected.filter((id) => id !== option.id) : [...selected, option.id])}
                      className={cn(
                        "rounded-2xl border-2 px-5 py-5 text-left text-lg font-extrabold transition disabled:cursor-not-allowed",
                        active ? "border-green/45 bg-green-soft text-ink" : "border-line bg-paper text-ink-soft",
                        incorrectAtResult && "opacity-55",
                      )}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {isResult ? (
            <div className="mt-4 rounded-2xl border border-green/25 bg-green-soft px-5 py-4">
              <p className="font-extrabold text-green">{winner ? `Nhóm ${winner.slot} trả lời đúng · +${event.points} điểm` : "Đã công bố đáp án đúng · không cộng điểm"}</p>
              <p className="mt-1 text-sm text-ink-soft">{event.explanation}</p>
              <p className="mt-1 text-sm text-muted">Nguồn: {event.sourcePage}</p>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col rounded-[24px] bg-ink p-4 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/55">Giành quyền</p>
          {state.phase === "event-intro" ? (
            <div className="flex flex-1 flex-col justify-between">
              <p className="mt-4 text-base leading-7 text-white/75">Mọi đội cùng thảo luận. Mỗi đội được thử một lần; đội đúng đầu tiên nhận 50 điểm.</p>
              <Button variant="primary" size="lg" onClick={() => { setDeadline(Date.now() + 45000); dispatch({ type: "START_EVENT" }); }}>Bắt đầu 45 giây</Button>
            </div>
          ) : null}

          {state.phase === "event-open" ? (
            <div className="mt-4 flex min-h-0 flex-1 flex-col">
              <div className="grid gap-2">
                {state.teams.map((team) => {
                  const attempted = state.eventAttemptedTeamIds.includes(team.id);
                  return (
                    <button key={team.id} type="button" disabled={attempted} onClick={() => chooseTeam(team.id)} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-left font-bold hover:bg-white/15 disabled:opacity-30">
                      <TeamBadge slot={team.slot} size="sm" /> Nhóm {team.slot}
                    </button>
                  );
                })}
              </div>
              <Button variant="ghost" onClick={skipEvent} className="mt-auto border-white/15 text-white/70 hover:bg-white/10 hover:text-white">Bỏ qua Biến cố</Button>
            </div>
          ) : null}

          {state.phase === "event-answering" && answeringTeam ? (
            <div className="flex flex-1 flex-col">
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-3"><TeamBadge slot={answeringTeam.slot} size="md" /><span className="font-extrabold">Nhóm {answeringTeam.slot}</span></div>
              <p className="mt-3 text-sm leading-6 text-white/65">Đồng hồ đang tạm dừng. Host nhập đúng câu trả lời đội đã nói.</p>
              <div className="mt-auto grid gap-2">
                <Button variant="primary" size="lg" disabled={!answerComplete} onClick={submitAnswer}>Chốt câu trả lời</Button>
                <Button variant="ghost" onClick={skipEvent} className="border-white/15 text-white/70 hover:bg-white/10 hover:text-white">Bỏ qua Biến cố</Button>
              </div>
            </div>
          ) : null}

          {isResult ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <TrophyIcon className="size-10 text-amber" />
              <p className="mt-4 text-xl font-extrabold">{winner ? `Nhóm ${winner.slot} ghi điểm` : "Biến cố đã khép lại"}</p>
              <p className="mt-2 text-sm leading-6 text-white/60">Đáp án chuẩn đã được điền trên bảng.</p>
              <Button variant="primary" size="lg" onClick={() => dispatch({ type: "END_EVENT" })} className="mt-6 w-full">{event.checkpoint === 18 ? "Xem tổng kết" : "Trở lại bản đồ"}</Button>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
