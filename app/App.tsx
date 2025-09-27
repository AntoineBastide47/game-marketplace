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

type Game = {
  id: number;
  name: string;
  // tu pourras rajouter d’autres champs (image, description, etc.)
};

function App() {
  const [view, setView] = useState<'overview' | 'game' | 'skin'>('overview');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setView('game');
  };

  const handleBackToOverview = () => {
    setSelectedGame(null);
    setView('overview');
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
          {/* Navigation */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant={view === 'overview' ? 'default' : 'outline'}
              onClick={handleBackToOverview}
              className={
                view === 'overview'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Overview
            </Button>

            <Button
              variant={view === 'game' ? 'default' : 'outline'}
              onClick={() => setView('game')}
              disabled={!selectedGame}
              className={
                view === 'game'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Game
            </Button>

            <Button
              variant={view === 'skin' ? 'default' : 'outline'}
              onClick={() => setView('skin')}
              className={
                view === 'skin'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Skins
            </Button>
          </div>

          {/* Conditional rendering */}
          {view === 'overview' && <Overview onSelectGame={handleSelectGame} />}
          {view === 'game' && selectedGame && <GamePage game={selectedGame} />}
          {view === 'skin' && <SkinPage />}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;