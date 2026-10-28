"use client";

import { RefreshCw, TrophyIcon } from "@/components/icons";
import { TeamBadge } from "@/components/team-badge";
import { Button } from "@/components/ui/button";
import { getTeamDefinition, rankTeams } from "@/lib/game-rules";
import { cn } from "@/lib/cn";
import type { GameState } from "@/types/game";

interface FinalResultsProps {
  state: GameState;
  onReset: () => void;
}

export function FinalResults({ state, onReset }: FinalResultsProps) {
  const ranked = rankTeams(state);
  const winners = ranked.filter((team) => team.rank === 1);
  const winner = winners[0];
  const isJoint = winners.length > 1;

  return (
    <main className="flex min-h-screen items-center justify-center px-[var(--page-gutter)] py-8">
      <div className="w-full max-w-[860px]">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-terracotta-soft text-terracotta-dark">
            <TrophyIcon className="size-6" />
          </span>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.13em] text-terracotta">
            Kết thúc · {state.usedQuestionIds.length}/18 câu
          </p>
          <h1 className="display mt-2 text-[clamp(3.2rem,6vw,5.4rem)] leading-none text-ink">
            {isJoint ? "Đồng hạng 1" : `${winner?.name ?? "Nhóm 1"} thắng`}
          </h1>
          {winner ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {winners.map((team) => (
                <span
                  key={team.id}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5"
                >
                  <TeamBadge slot={team.slot} size="sm" />
                  <span className="text-sm font-semibold text-ink">
                    {team.name}
                  </span>
                </span>
              ))}
              <span className="text-sm font-semibold text-terracotta">
                {winner.score} điểm
              </span>
            </div>
          ) : null}
        </div>

        <div className="card mt-7 overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="text-sm font-semibold text-ink">Bảng xếp hạng</p>
            <p className="text-sm font-medium text-muted">
              Điểm · địa bàn · khu vực 3
            </p>
          </div>
          <div className="divide-y divide-line">
            {ranked.map((team) => {
              const definition = getTeamDefinition(team);
              const isTied =
                ranked.filter((item) => item.rank === team.rank).length > 1;
              return (
                <div
                  key={team.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3",
                    team.rank === 1 && "bg-cream/60",
                  )}
                >
                  <span
                    className="w-7 shrink-0 text-sm font-semibold text-muted"
                    style={{ color: team.rank === 1 ? definition.color : undefined }}
                  >
                    {team.rank}
                    {isTied ? "=" : ""}
                  </span>
                  <TeamBadge slot={team.slot} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {team.name}
                    </p>
                    <p className="text-sm text-muted">
                      {team.territoryCount} địa bàn · {state.journeyBonusAwards.includes(team.id) ? "Hoàn thành Hành trình" : "Chưa đủ 3 chương"}
                    </p>
                  </div>
                  <p
                    className="text-xl font-bold"
                    style={{ color: definition.color }}
                  >
                    {team.score}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            variant="primary"
            onClick={onReset}
            className="min-w-56 justify-between"
          >
            <span>Chơi lại</span>
            <RefreshCw className="size-5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
