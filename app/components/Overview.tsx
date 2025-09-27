"use client";
import React from "react";
import type { Game } from "@/types/game";
import { games } from "@/constants/game";

interface OverviewProps {
  onSelectGame: (game: Game) => void;
}

export default function Overview({ onSelectGame }: OverviewProps) {
  const selection: Game[] = games.slice(0);

  return (
    <main className="min-h-screen w-full bg-white text-black">
      {/* Titre centré */}
      <header className="w-full pt-16 pb-8">
        <h2 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight">
          Featured Games
        </h2>
      </header>

      {/* Grille responsive */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selection.map((game) => (
            <article
              key={game.id}
              className="
                group relative w-full overflow-hidden
                rounded-2xl bg-white
                shadow-md hover:shadow-xl
                transition-transform duration-300 hover:-translate-y-1
              "
            >
              {/* Image avec overlay */}
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={game.coverImage}
                  alt={game.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Contenu en bas de la carte */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-bold">{game.name}</h3>
                <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                  {game.description}
                </p>
                <button
                  onClick={() => onSelectGame(game)}
                  className="
                    mt-3 w-full
                    rounded-full px-4 py-2
                    bg-black/80 hover:bg-black
                    text-sm font-semibold
                    transition-colors
                  "
                >
                  View game
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}