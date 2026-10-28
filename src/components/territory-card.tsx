"use client";

import type { CSSProperties } from "react";
import { LockIcon } from "@/components/icons";
import { TeamBadge } from "@/components/team-badge";
import { getTeamDefinition, getTerritoryStatus } from "@/lib/game-rules";
import { cn } from "@/lib/cn";
import type { GameState, Team, Territory } from "@/types/game";

interface TerritoryCardProps {
  state: GameState;
  territory: Territory;
  teams: Team[];
  disabled?: boolean;
  onSelect: (territoryId: string) => void;
}

export function TerritoryCard({
  state,
  territory,
  teams,
  disabled = false,
  onSelect,
}: TerritoryCardProps) {
  const status = getTerritoryStatus(state, territory.id);
  const ownerId = state.territories.find(
    (item) => item.id === territory.id,
  )?.ownerTeamId;
  const owner = teams.find((team) => team.id === ownerId);
  const ownerDefinition = owner ? getTeamDefinition(owner) : null;
  const selectable = status === "available" && !disabled;

  return (
    <button
      type="button"
      onClick={() => onSelect(territory.id)}
      disabled={!selectable}
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border-2 bg-paper text-left transition duration-200",
        status === "captured"
          ? "capture-flash"
          : status === "asked"
            ? "opacity-75"
            : "cursor-pointer border-line hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_16px_34px_rgba(67,57,42,0.10)]",
      )}
      style={
        ownerDefinition
          ? { borderColor: ownerDefinition.color }
          : undefined
      }
      aria-label={`${territory.name}: ${
        status === "captured"
          ? `đã bị ${owner?.name ?? "một nhóm"} chiếm`
          : status === "asked"
            ? "đã hỏi, không chọn lại"
            : "còn trống, bấm để chọn"
      }`}
    >
      <span className="relative min-h-0 flex-1 overflow-hidden bg-cream-deep">
        <span
          className={cn(
            "territory-thumb absolute inset-0 transition duration-300",
            status === "asked" && "opacity-45 grayscale",
            selectable && "group-hover:scale-[1.02]",
          )}
          style={{ backgroundImage: `url(${territory.image})` }}
          aria-hidden="true"
        />

        {status === "captured" && owner ? (
          <span className="absolute right-2 top-2">
            <TeamBadge slot={owner.slot} size="sm" />
          </span>
        ) : null}

      </span>

      <span
        className={cn(
          "flex h-[58px] shrink-0 flex-col justify-center px-3 py-1.5 2xl:h-[68px]",
          status === "captured" && "bg-[var(--team-soft)]",
          status === "asked" && "bg-cream",
          status === "available" && "bg-paper",
        )}
        style={
          ownerDefinition
            ? ({ "--team-soft": ownerDefinition.softColor } as CSSProperties)
            : undefined
        }
      >
        <span
          className={cn(
            "line-clamp-2 min-h-8 text-sm font-bold leading-4 2xl:text-base 2xl:leading-5",
            status === "asked" ? "text-muted" : "text-ink",
          )}
        >
          {territory.name}
        </span>
        {status !== "available" ? (
          <span className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-muted">
            {status === "captured" && owner ? (
              <span style={{ color: ownerDefinition?.color }}>
                {owner.name}
              </span>
            ) : (
              <>
                <LockIcon className="size-3" />
                Đã hỏi
              </>
            )}
          </span>
        ) : null}
      </span>
    </button>
  );
}
