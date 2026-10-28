"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, MapIcon, UsersIcon, XIcon } from "@/components/icons";
import { TeamBadge } from "@/components/team-badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_TEAM_NAMES, MAX_TEAMS, MIN_TEAMS } from "@/data/teams";
import { validateGameData, validateTeamNames } from "@/lib/validation";
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
  const [teamNames, setTeamNames] = useState<string[]>(() => [...DEFAULT_TEAM_NAMES]);
  const teamErrors = validateTeamNames(teamNames);
  const canStart = DATA_ERRORS.length === 0 && teamErrors.length === 0;

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
          <h2 className="display mt-2 text-4xl text-ink">Đặt tên nhóm</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            Thêm từ {MIN_TEAMS} đến {MAX_TEAMS} nhóm và nhập tên dùng trong suốt trận đấu.
          </p>

          <form
            className="mt-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (canStart) onStart(teamNames.map((name) => name.trim()));
            }}
          >
            <div className="grid max-h-[264px] gap-2 overflow-y-auto pr-1">
              {teamNames.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TeamBadge slot={index + 1} size="md" />
                  <label className="sr-only" htmlFor={`team-name-${index}`}>
                    Tên nhóm {index + 1}
                  </label>
                  <input
                    id={`team-name-${index}`}
                    type="text"
                    value={name}
                    maxLength={24}
                    autoComplete="off"
                    placeholder={`Tên nhóm ${index + 1}`}
                    onChange={(event) => {
                      const nextNames = [...teamNames];
                      nextNames[index] = event.target.value;
                      setTeamNames(nextNames);
                    }}
                    className="min-h-12 min-w-0 flex-1 rounded-2xl border border-line bg-paper-soft px-4 font-semibold text-ink outline-none transition placeholder:text-muted/70 focus:border-terracotta focus:ring-2 focus:ring-terracotta/15"
                  />
                  <button
                    type="button"
                    onClick={() => setTeamNames(teamNames.filter((_, teamIndex) => teamIndex !== index))}
                    disabled={teamNames.length <= MIN_TEAMS}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-red-soft hover:text-red disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label={`Xóa nhóm ${index + 1}`}
                    title={teamNames.length <= MIN_TEAMS ? `Cần ít nhất ${MIN_TEAMS} nhóm` : "Xóa nhóm"}
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {teamNames.length < MAX_TEAMS ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTeamNames([...teamNames, ""])}
                className="mt-2 w-full border border-dashed border-line"
              >
                <UsersIcon className="size-4" />
                Thêm nhóm
              </Button>
            ) : null}

            {teamNames.some((name) => name.trim()) && teamErrors.length > 0 ? (
              <div className="mt-3 rounded-xl border border-amber/30 bg-amber-soft px-3 py-2 text-xs font-semibold leading-5 text-ink-soft">
                {teamErrors.map((error) => <p key={error}>{error}</p>)}
              </div>
            ) : null}

          {DATA_ERRORS.length > 0 ? (
            <div className="mt-4 rounded-xl border border-red/30 bg-red-soft px-3 py-2 text-xs leading-5 text-red">
              {DATA_ERRORS.slice(0, 3).map((issue) => (
                <p key={issue.message}>{issue.message}</p>
              ))}
            </div>
          ) : null}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={!canStart}
              className="mt-5 w-full justify-between rounded-2xl px-5"
            >
              <span>Bắt đầu</span>
              <ChevronRightIcon className="size-5" />
            </Button>
          </form>

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
