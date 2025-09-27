import React from "react";

type Game = {
  id: number;
  name: string;
};

interface OverviewProps {
  onSelectGame: (game: Game) => void;
}

export default function Overview({ onSelectGame }: OverviewProps) {
  const popular: Game[] = Array.from({ length: 8 }).map((_, idx) => ({
    id: idx,
    name: `Populaire ${idx + 1}`,
  }));

  const selection: Game[] = Array.from({ length: 12 }).map((_, idx) => ({
    id: idx + 100, // éviter doublons d’ID
    name: `Jeu ${idx + 1}`,
  }));

  const renderRow = (title: string, games: Game[]) => (
    <div className="mb-10">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="text-sm text-gray-600">{games.length} jeux</span>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto space-x-5 p-3 rounded-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group relative flex-shrink-0 w-44 h-56 rounded-2xl border border-gray-300 bg-gradient-to-b from-white to-gray-50 hover:from-white hover:to-gray-100 transition
                         shadow-sm hover:shadow-xl active:scale-[0.98]
                         before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                         before:bg-[conic-gradient(at_top_right,_#ec4899_0%,_#db2777_35%,_#9f1239_70%,_#ec4899_100%)]
                         before:opacity-60 before:blur-[2px]
                         after:absolute after:inset-[2px] after:rounded-[1rem] after:bg-white after:transition"
            >
              <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-3">
                <div className="w-full h-36 rounded-xl border border-gray-300 bg-gray-100 grid place-items-center group-hover:border-pink-600/50 transition">
                  <span className="text-sm text-gray-600">Image</span>
                </div>

                <div className="w-full">
                  <div className="mt-3 font-semibold truncate">{game.name}</div>
                  <div className="text-xs text-gray-500">Action • 2025</div>
                </div>

                <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-xl bg-pink-600/20 pointer-events-none" />
              </div>
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur border border-gray-300 rounded-xl px-3 py-2 mb-6 shadow-sm">
        <span className="font-black text-lg tracking-tight">
          <span className="bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
            GAME
          </span>
          -MARKETPLACE
        </span>

        <div className="flex items-center gap-2 flex-1 mx-4">
          <input
            type="text"
            placeholder="Search for a game"
            className="w-full px-4 py-2 rounded-lg border border-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600/40 focus:border-pink-600/60 transition"
          />
          <button className="px-4 py-2 rounded-lg font-bold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 transition shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_24px_-8px_rgba(236,72,153,0.6)]">
            Search
          </button>
        </div>
      </div>

      {/* Lignes */}
      {renderRow("Les plus populaires", popular)}
      {renderRow("Sélection", selection)}
    </div>
  );
}