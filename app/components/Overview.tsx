"use client";
import React from "react";
import type { Game } from "@/types/game";
import { games } from "@/constants/game";

interface OverviewProps {
  onSelectGame: (game: Game) => void;
}

export default function Overview({ onSelectGame }: OverviewProps) {
  const popular = games.slice(0, 3);
  const selection = games.slice().reverse();

  const renderRow = (title: string, list: Game[]) => (
    <section className="w-full overflow-hidden"> {/* clip tout ce qui dépasse */}
      <div className="flex items-baseline justify-between px-6 md:px-10 pt-8 pb-4">
        <h2 className="font-bold text-2xl md:text-3xl">{title}</h2>
        <span className="text-sm text-gray-600">{list.length} jeux</span>
      </div>

      <div className="relative">
        {/* Le conteneur qui scroll ne dépasse plus: pas de width custom, juste flex */}
        <div className="flex overflow-x-auto gap-6 px-6 md:px-10 pb-10 snap-x snap-mandatory scroll-p-6 md:scroll-p-10">
          {list.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group relative flex-shrink-0 w-[280px] md:w-[320px] h-[360px] md:h-[400px]
           rounded-2xl bg-white shadow-md hover:shadow-lg transition-transform duration-300
           hover:scale-[1.03] active:scale-[0.98]
           focus:outline-none focus:ring-2 focus:ring-pink-600/40 snap-start"
              aria-label={`Ouvrir ${game.name}`}
            >
              <div className="relative z-10 flex flex-col w-full h-full p-3 md:p-4">
                <div className="relative w-full h-[65%] overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                <div className="flex-1 w-full mt-3 md:mt-4 text-left">
                  <div className="font-semibold truncate">{game.name}</div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {game.description}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {game.genres?.slice(0, 2).join(" • ") || "—"}
                    {game.releaseYear ? ` • ${game.releaseYear}` : ""}
                  </div>
                </div>

                {/* glow subtil, pas de bordure */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-xl bg-pink-600/10" />
              </div>
            </button>
          ))}
        </div>

        {/* Les caches de bord, mais sans créer d’overflow: parent overflow-hidden s’en charge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );

  return (
    <main className="min-h-screen w-full bg-white text-black overflow-y-auto">
      {/* Full-bleed, pas de conteneur avec bordure ni radius géant */}
      {renderRow("Les plus populaires", popular)}
      {renderRow("Sélection", selection)}
    </main>
  );
}