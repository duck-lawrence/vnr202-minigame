"use client";

import { TerritoryCard } from "@/components/territory-card";
import { getRegionTerritories } from "@/lib/game-rules";
import type { GameState, Region, Team } from "@/types/game";

interface RegionRowProps {
  state: GameState;
  region: Region;
  teams: Team[];
  disabled?: boolean;
  onSelect: (territoryId: string) => void;
}

export function RegionRow({
  state,
  region,
  teams,
  disabled,
  onSelect,
}: RegionRowProps) {
  const territories = getRegionTerritories(region.id);
  const captured = territories.filter((territory) => {
    const item = state.territories.find((entry) => entry.id === territory.id);
    return Boolean(item?.ownerTeamId);
  }).length;

  return (
    <section className="grid min-h-0 grid-cols-[150px_1fr] gap-2 2xl:grid-cols-[190px_1fr]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[20px] border-2 border-line-strong bg-paper">
        <div className="relative h-[43%] min-h-0 shrink-0">
          <div
            className="region-backdrop absolute inset-0"
            style={{ backgroundImage: `url(${region.image})` }}
            aria-hidden="true"
          />
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-sm font-extrabold tracking-wider text-white">
            CHƯƠNG 0{region.order}
          </span>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col justify-between p-2.5"
          style={{ backgroundColor: region.softColor }}
        >
          <div>
            <h2 className="display text-base leading-5 text-ink 2xl:text-xl 2xl:leading-6">
              {region.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              {region.period}
            </p>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-ink">
              {captured}/6
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper/70">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${(captured / 6) * 100}%`,
                  backgroundColor: region.accent,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 grid-cols-6 gap-1.5">
        {territories.map((territory) => (
          <TerritoryCard
            key={territory.id}
            state={state}
            territory={territory}
            teams={teams}
            disabled={disabled}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
