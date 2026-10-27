"use client";

import { RegionRow } from "@/components/region-row";
import { REGIONS } from "@/data/regions";
import type { GameState } from "@/types/game";

interface GameBoardProps {
  state: GameState;
  disabled?: boolean;
  onSelect: (territoryId: string) => void;
}

export function GameBoard({ state, disabled, onSelect }: GameBoardProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-rows-3 gap-1.5">
      {REGIONS.map((region) => (
        <RegionRow
          key={region.id}
          state={state}
          region={region}
          teams={state.teams}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
