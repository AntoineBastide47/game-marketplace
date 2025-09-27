'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CounterList } from "./components/CounterList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto p-6">
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
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

          {view === "skin" && (
            <SkinPage />
          )}

          {view === "skin" && (
            <button
              onClick={handleBackToGame}
              className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold"
            >
              ← Back to Game
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;