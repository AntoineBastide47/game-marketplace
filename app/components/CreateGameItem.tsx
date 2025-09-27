// app/components/CreateGameItem.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import type { GameItem } from "@/types/gameItem";
import { gameItems as initialItems } from "../constants/gameItem";
import AddGameItemModal from "./addGameItemModal";

interface Props {
  onSelectItem: (item: GameItem) => void;
}

export default function CreateGameItem({ onSelectItem }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [localItems, setLocalItems] = useState<GameItem[]>(initialItems);

  // Affiche le bouton + du header si un compte est présent
  const account = useCurrentAccount();

  // Copie défensive pour futures opérations de tri/filtre
  const selection = useMemo(() => localItems.slice(0), [localItems]);

  return (
    <main className="min-h-screen w-full bg-white text-black pt-12">
      {/* En-tête */}
      <header className="w-full pt-8 pb-8 px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <h2 className="flex-1 text-center text-5xl md:text-6xl font-extrabold tracking-tight">
          Items du jeu
        </h2>

        {account && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            aria-label="Ajouter un nouvel item"
            className="ml-4 flex items-center justify-center rounded-full p-3 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </header>

      {/* Grille */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {selection.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              aria-label={`Voir l’item ${item.name}`}
              className="group relative w-full overflow-hidden text-left rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={item.image || "https://picsum.photos/600/800"}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold line-clamp-1">{item.name}</h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold bg-white/15 backdrop-blur"
                    title={`Rareté: ${item.rarity}`}
                  >
                    {item.rarity}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {Number.isFinite(item.price) ? `${item.price} €` : "—"}
                  </span>
                  <span className="inline-flex rounded-full px-4 py-2 bg-black/80 group-hover:bg-black text-sm font-semibold transition-colors">
                    Voir l’item
                  </span>
                </div>
              </div>
            </button>
          ))}

          {/* Tuile d’ajout en pointillé */}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            aria-label="Ajouter un item"
            className="relative w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 transition-colors shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex items-center justify-center group"
          >
            <div className="flex flex-col items-center justify-center text-indigo-600 group-hover:text-indigo-700">
              <Plus className="h-10 w-10" />
              <span className="mt-2 text-sm font-semibold">Ajouter un item</span>
            </div>
          </button>
        </div>
      </section>

      {/* Modal d’ajout */}
      <AddGameItemModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(i) => setLocalItems((prev) => [...prev, i])}
      />
    </main>
  );
}