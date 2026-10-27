"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, MapIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DEFAULT_TEAM_NAMES, MAX_TEAMS, MIN_TEAMS } from "@/data/teams";
import { cn } from "@/lib/cn";
import { validateGameData } from "@/lib/validation";
import type { StoredGame } from "@/types/game";

interface SetupScreenProps {
  savedGame: StoredGame | null;
  onStart: (teamNames: string[]) => void;
  onResume: () => void;
  onDiscardSaved: () => void;
}

const DATA_ERRORS = validateGameData().filter(
  (issue) => issue.level === "error",
);

export function SetupScreen({
  savedGame,
  onStart,
  onResume,
  onDiscardSaved,
}: SetupScreenProps) {
  const [teamCount, setTeamCount] = useState(MAX_TEAMS);
  const canStart = DATA_ERRORS.length === 0;

  const savedState = savedGame?.store.present;
  const savedQuestionCount = savedState?.usedQuestionIds.length ?? 0;
  const isSavedFinal = savedState?.phase === "finished";

  return (
    <main className="min-h-screen px-[var(--page-gutter)] py-6 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1440px] items-center gap-8 lg:grid-cols-[1.12fr_.88fr] lg:gap-12">
        <section>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-terracotta">
            <MapIcon className="size-4" />
            Mini board game lịch sử
          </div>
          <h1 className="display mt-4 text-[clamp(3rem,6vw,5.8rem)] leading-[0.95] text-ink">
            Bản đồ
            <span className="block text-terracotta">thời cơ</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-ink-soft">
            Một hành trình chiến lược qua phong trào giải phóng dân tộc 1939–1945.
          </p>

          <div className="relative mt-7 aspect-[16/9] max-w-[720px] overflow-hidden rounded-[32px] border border-line bg-cream-deep soft-shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/images/hero.webp)" }}
            />
          </div>
        </section>

        <section className="card rounded-[32px] p-5 sm:p-7 lg:p-8">
          {savedGame && savedState ? (
            <div className="mb-5 rounded-2xl border border-line bg-cream/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-terracotta">
                    {isSavedFinal ? "Trận đã kết thúc" : "Trận đang dở"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {isSavedFinal
                      ? "Xem lại kết quả"
                      : `Tiếp tục từ câu ${Math.min(savedQuestionCount + 1, 18)}/18`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={onDiscardSaved}>
                    Bỏ
                  </Button>
                  <Button size="sm" variant="primary" onClick={onResume}>
                    {isSavedFinal ? "Xem" : "Tiếp tục"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-terracotta">Thiết lập trận đấu</p>
          <h2 className="display mt-2 text-4xl text-ink">Chọn số nhóm</h2>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {Array.from({ length: MAX_TEAMS - MIN_TEAMS + 1 }, (_, index) => {
              const value = MIN_TEAMS + index;
              const active = teamCount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTeamCount(value)}
                  className={cn(
                    "flex min-h-12 items-center justify-center rounded-2xl border text-lg font-semibold transition",
                    active
                      ? "border-terracotta bg-terracotta-soft text-terracotta-dark"
                      : "border-line bg-paper-soft text-muted hover:border-line-strong hover:text-ink",
                  )}
                  aria-pressed={active}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {DATA_ERRORS.length > 0 ? (
            <div className="mt-4 rounded-xl border border-red/30 bg-red-soft px-3 py-2 text-xs leading-5 text-red">
              {DATA_ERRORS.slice(0, 3).map((issue) => (
                <p key={issue.message}>{issue.message}</p>
              ))}
            </div>
          ) : null}

          <Button
            size="lg"
            variant="primary"
            onClick={() => onStart(DEFAULT_TEAM_NAMES.slice(0, teamCount))}
            disabled={!canStart}
            className="mt-6 w-full justify-between rounded-2xl px-5"
          >
            <span>Bắt đầu</span>
            <ChevronRightIcon className="size-5" />
          </Button>

          <Link href="/huong-dan" className="mt-3 flex min-h-12 items-center justify-center rounded-2xl border-2 border-line bg-paper-soft text-base font-bold text-ink transition hover:border-terracotta">
            Xem hướng dẫn cách chơi
          </Link>

          <div className="mt-5 grid grid-cols-3 divide-x divide-line text-center">
            <div><strong className="block text-xl text-ink">18</strong><span className="text-xs font-semibold text-muted">Câu chính</span></div>
            <div><strong className="block text-xl text-ink">3</strong><span className="text-xs font-semibold text-muted">Biến cố</span></div>
            <div><strong className="block text-xl text-ink">3</strong><span className="text-xs font-semibold text-muted">Chương</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
