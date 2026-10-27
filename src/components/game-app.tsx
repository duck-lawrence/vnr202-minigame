"use client";

import { FinalResults } from "@/components/final-results";
import { GameScreen } from "@/components/game-screen";
import { SetupScreen } from "@/components/setup-screen";
import { useGame } from "@/hooks/use-game";

export function GameApp() {
  const {
    state,
    store,
    savedGame,
    startGame,
    resumeGame,
    discardSavedGame,
    resetGame,
    dispatch,
  } = useGame();

  if (state.phase === "setup") {
    return (
      <SetupScreen
        savedGame={savedGame}
        onStart={startGame}
        onResume={resumeGame}
        onDiscardSaved={discardSavedGame}
      />
    );
  }

  if (state.phase === "finished") {
    return <FinalResults state={state} onReset={resetGame} />;
  }

  return (
    <GameScreen
      state={state}
      canUndo={store.past.length > 0}
      dispatch={dispatch}
    />
  );
}
