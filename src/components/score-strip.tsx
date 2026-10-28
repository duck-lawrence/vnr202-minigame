"use client";

import { TeamBadge } from "@/components/team-badge";
import { getCurrentTeam, getTeamDefinition } from "@/lib/game-rules";
import { cn } from "@/lib/cn";
import { REGIONS } from "@/data/regions";
import { getOwnedInRegion } from "@/lib/game-rules";
import type { GameState } from "@/types/game";

interface ScoreStripProps {
  state: GameState;
}

export function ScoreStrip({ state }: ScoreStripProps) {
  const currentTeam = getCurrentTeam(state);

  return (
    <div
      className="grid gap-2 pb-1"
      style={{ gridTemplateColumns: `repeat(${state.teams.length}, minmax(0, 1fr))` }}
    >
      {state.teams.map((team) => {
        const definition = getTeamDefinition(team);
        const isCurrent = currentTeam?.id === team.id;
        const territoryCount = state.territories.filter(
          (territory) => territory.ownerTeamId === team.id,
        ).length;

        return (
          <div
            key={team.id}
            className={cn(
              "relative flex min-w-0 items-center gap-3 rounded-2xl border-2 px-3 py-2 transition",
              isCurrent
                ? "border-terracotta bg-terracotta-soft/80 shadow-[0_8px_22px_rgba(195,111,78,.12)]"
                : "border-line bg-paper",
            )}
          >
            <TeamBadge slot={team.slot} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold text-ink">
                  {team.name}
                </p>
                <p
                  data-testid={`team-score-${team.id}`}
                  className="score-pop text-2xl font-extrabold leading-none"
                  style={{ color: definition.color }}
                >
                  {team.score}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-muted">{territoryCount} địa bàn</p>
                <span className="flex gap-1" aria-label="Tiến trình Hành trình lịch sử">
                  {REGIONS.map((region) => (
                    <span key={region.id} className={cn("size-2.5 rounded-full border", getOwnedInRegion(state, team.id, region.id) > 0 ? "border-transparent" : "border-line-strong bg-transparent")} style={getOwnedInRegion(state, team.id, region.id) > 0 ? { backgroundColor: region.accent } : undefined} />
                  ))}
                </span>
              </div>
            </div>
            <span className={cn("absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-paper text-[11px] font-black", team.opportunityUsed ? "bg-line text-muted" : "bg-amber text-white")} title={team.opportunityUsed ? "Đã dùng Chớp thời cơ" : "Còn Chớp thời cơ"}>✦</span>
          </div>
        );
      })}
    </div>
  );
}
