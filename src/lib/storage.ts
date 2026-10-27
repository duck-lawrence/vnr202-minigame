import { isValidGameState } from "@/lib/validation";
import type { GameStore, StoredGame } from "@/types/game";

export const STORAGE_KEY = "ban-do-thoi-co:v2";
export const STORAGE_VERSION = 2;

export function saveGame(store: GameStore): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const payload: StoredGame = {
      version: STORAGE_VERSION,
      savedAt: Date.now(),
      store,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): StoredGame | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredGame>;
    if (parsed.version !== STORAGE_VERSION || !parsed.store) {
      return null;
    }
    if (
      !parsed.store.present ||
      !Array.isArray(parsed.store.past) ||
      !isValidGameState(parsed.store.present)
    ) {
      return null;
    }
    if (parsed.store.present.phase === "setup") {
      return null;
    }
    return parsed as StoredGame;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing; the game still works in memory.
  }
}
