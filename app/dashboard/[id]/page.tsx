// app/components/Overview.tsx
"use client";
import React, { useEffect, useState } from "react";
import type { Game } from "@/other/types/game";
import { useParams, useRouter } from "next/navigation";
import { useNetworkVariable } from "@/networkConfig";
import { useSuiClient } from "@/other/contexts/SuiClientContext";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Asset } from "@/other/types/asset";

type AssetMintedCreatedEvent = {
  asset_token_id: string;
  asset_id: string;
  creator: string;
}

export default function Overview() {
  const router = useRouter();
  const client = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useParams<{ id: string }>()

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await client.queryEvents({
        query: { MoveEventType: `${packageId}::asset::AssetMintedEvent` },
      });

      console.log(data.length)
      const ids = data.map((e) => (e.parsedJson as AssetMintedCreatedEvent));

      const loaded: (Asset | null)[] = await Promise.all(
        ids.map(async ({ asset_token_id, asset_id, creator }: AssetMintedCreatedEvent) => {
          const id = asset_id
          const res = await client.getObject({ id, options: { showContent: true } });
          const fields = (res.data?.content as any).fields;
          return creator == userId.id ? {
            id: asset_id,
            owner: creator,
            name: fields.name as string,
            description: fields.description as string,
            imageUrl: fields.imageUrl as string,
            count: fields.count as number,
            price: fields.price as number,
            gameId: fields.gameId as string,
            gameOwner: fields.gameOwner as string,
            metaData: [] as string[],
            renderingMetaData: [] as string[],
          } : null;
        })
      );

      if (alive) setAssets(loaded.filter(f => f != null));
    })()
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [client, packageId]);

  if (loading) return <div>Loading…</div>;

  return (
    <main className="min-h-screen w-full bg-white text-black">
      {/* Header sans bouton + */}
      <header className="w-full pt-16 pb-8 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        <h2 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight">
          My Assets
        </h2>
      </header>

      {/* Grille des jeux */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => router.push(`/game/${game.id}`)}
              aria-label={`Voir ${game.name}`}
              className="group relative w-full overflow-hidden text-left rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={game.imageUrl || "https://picsum.photos/600/800"}
                  alt={game.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-bold">{game.name}</h3>
                <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                  {game.description}
                </p>
                <span className="mt-3 inline-flex w-full justify-center rounded-full px-4 py-2 bg-black/80 group-hover:bg-black text-sm font-semibold transition-colors">
                  View game
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}