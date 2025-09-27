'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CounterList } from "./components/CounterList";
import SkinPage from "./components/SkinPage";
import GamePage from "./components/GamePage";
import Overview from "./components/Overview";
import { Game } from "./types/game";

function App() {
  const [view, setView] = useState<'overview' | 'game' | 'skin'>('overview');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setView("game");
  };

  const handleBackToOverview = () => {
    setSelectedGame(null);
    setView("overview");
  };

  const handleGoToSkin = () => {
    setView("skin");
  };

  const handleBackToGame = () => {
    setView("game");
  };

  return (
    <div className="w-full h-screen p-6">
      <div className="w-full h-full pt-6">
        {view === "overview" && (
          <Overview onSelectGame={handleSelectGame} />
        )}

        {view === "game" && selectedGame && (
          <GamePage
            game={selectedGame}
            onBack={handleBackToOverview}
            onGoToSkin={handleGoToSkin}
          />
        )}

        {view === "skin" && <SkinPage />}

        
      </div>
    </div>
  );
}

export default App;