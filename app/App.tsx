'use client'
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import GamePage from "./components/GamePage";
import SkinPage from "./components/SkinPage";
import type { Game } from "./types/game";

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

  const handleGoToSkin = () => setView("skin");
  const handleBackToGame = () => setView("game");

  return (
    <div className="min-h-screen bg-white text-black flex">
      <Navbar />
      <Sidebar />

      {/* Contenu principal décalé par le rail étroit (ml-16) */}
      <main className="flex-1 ml-16">
        {/* Spacer sous la navbar */}
        <div className="h-[64px] md:h-[68px]" aria-hidden />

        {view === "overview" && <Overview onSelectGame={handleSelectGame} />}
        
        {view === "game" && selectedGame && (
          <GamePage
            game={selectedGame}
            onBack={handleBackToOverview}
            onGoToSkin={handleGoToSkin}
          />
        )}

        {view === "skin" && <SkinPage />}


      </div>
        
        {view === "skin" && (
          <SkinPage onBack={handleBackToGame} />
        )}
      </main>
    </div>
  );
}

export default App;