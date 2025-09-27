// app/my-games/page.tsx
"use client";

import MyGames from "../components/MyGames"; // respecte la casse !
import type { Game } from "../types/game";

export default function MyGamesPage() {
  const handleSelectGame = (game: Game) => {
    console.log("Selected game:", game);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <MyGames onSelectGame={handleSelectGame} />
    </div>
  );
}