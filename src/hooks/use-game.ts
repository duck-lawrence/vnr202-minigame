"use client";

import { useEffect, useReducer, useState } from "react";
import { gameReducer, initialStore } from "@/lib/reducer";
import { clearGame, loadGame, saveGame } from "@/lib/storage";
import type { GameStore, StoredGame } from "@/types/game";

export function useGame() {
  const [store, dispatch] = useReducer(gameReducer, initialStore);
  const [savedGame, setSavedGame] = useState<StoredGame | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    const frame = window.setTimeout(() => {
      setSavedGame(saved);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(frame);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (store.present.phase !== "setup") {
      saveGame(store);
    }
  }, [loaded, store]);

  const startGame = (teamNames: string[]) => {
    clearGame();
    setSavedGame(null);
    dispatch({ type: "START_GAME", teamNames });
  };

  const resumeGame = () => {
    if (!savedGame) {
      return;
    }
    dispatch({ type: "HYDRATE", store: savedGame.store });
    setSavedGame(null);
  };

  const discardSavedGame = () => {
    clearGame();
    setSavedGame(null);
  };

  const resetGame = () => {
    clearGame();
    setSavedGame(null);
    dispatch({ type: "RESET_GAME" });
  };

  return {
    state: store.present as GameStore["present"],
    store,
    dispatch,
    savedGame,
    startGame,
    resumeGame,
    discardSavedGame,
    resetGame,
  };
}
