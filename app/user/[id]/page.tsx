// app/components/myGames.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Game } from "@/other/types/game";
import AddGameModal from "../../other/components/AddGameModal";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Plus } from "lucide-react";
import { useNetworkVariable } from "@/networkConfig";
import { GameCreatedEvent } from "../../page";
import { useRouter } from "next/navigation";
import { useSuiClient } from "@/other/contexts/SuiClientContext";

export default function MyGames() {
  const account = useCurrentAccount();
  const router = useRouter();
  const packageId = useNetworkVariable("packageId");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const client = useSuiClient();

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await client.queryEvents({
        query: { MoveEventType: `${packageId}::game::GameCreated` },
      });

      const ids = data.map((e) => (e.parsedJson as GameCreatedEvent).game_id);

      const loaded: (Game | null)[] = await Promise.all(
        ids.map(async (id) => {
          const res = await client.getObject({ id, options: { showContent: true } });
          const fields = (res.data?.content as any).fields;
          return fields.owner == account?.address ? null : {
            id,
            owner: fields.owner as string,
            name: fields.name as string,
            description: fields.description as string,
            imageUrl: fields.imageUrl as string,
            pageUrl: fields.pageUrl as string,
          };
        })
      );

      if (alive) setGames(loaded.filter(g => g != null));
    })()
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [client, packageId, account]);

  if (loading) return <div>Loading…</div>;

  return (
    <main className="min-h-screen w-full bg-white text-black pt-12">
      {/* En-tête */}
      <header className="w-full pt-8 pb-8 px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <h2 className="flex-1 text-center text-5xl md:text-6xl font-extrabold tracking-tight">
          My Games
        </h2>
      </header>

      {/* Grille des jeux */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => router.push(`/my-games/edit/${game.id}`)}
              aria-label={`Voir ${game.name}`}
              className="group relative w-full overflow-hidden text-left rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={game.imageUrl || "https://picsum.photos/600/800"}
                  alt={game.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-bold line-clamp-1">{game.name}</h3>
                <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                  {game.description}
                </p>
                <span className="mt-3 inline-flex w-full justify-center rounded-full px-4 py-2 bg-black/80 group-hover:bg-black text-sm font-semibold transition-colors">
                  View game
                </span>
              </div>
            </button>
          ))}

          {/* Tuile d’ajout en pointillé */}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            aria-label="Ajouter un jeu"
            className="relative w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 transition-colors shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex items-center justify-center group"
          >
            <div className="flex flex-col items-center justify-center text-indigo-600 group-hover:text-indigo-700">
              <Plus className="h-10 w-10" />
              <span className="mt-2 text-sm font-semibold">Ajouter un jeu</span>
            </div>
          </button>
        </div>
      </section>
    </main>
  );
}