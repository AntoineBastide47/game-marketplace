"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSuiClient } from "@/other/contexts/SuiClientContext";
import { useNetworkVariable } from "@/networkConfig";
import { Asset } from "@/other/types/asset";
import { EventId } from "@mysten/sui/client";

export type AssetMintedCreatedEvent = {
  asset_token_id: string;
  asset_id: string;
};

type AssetTransferredEvent = {
  asset_token_id: string;
  from: string;
  to: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const userId = useParams<{ id: string }>();
  const client = useSuiClient();
  const packageId = useNetworkVariable("packageId");

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 1) Load mint events
      const { data: mintData } = await client.queryEvents({
        query: { MoveEventType: `${packageId}::asset::AssetMintedEvent` },
        order: 'descending',
        limit: 1000,
      });

      const minted = mintData.map((e) => e.parsedJson as AssetMintedCreatedEvent);

      // 2) Build the set of token_ids we care about
      const wanted = new Set(minted.map((m) => m.asset_token_id));

      // 3) Load transfer events once, newest first, keep the first per token_id
      const latestToByToken = new Map<string, string>();
      let cursor: EventId | null | undefined = null;

      while (true) {
        const { data, nextCursor, hasNextPage } = await client.queryEvents({
          query: { MoveEventType: `${packageId}::asset::AssetTransferredEvent` },
          order: 'descending',
          cursor,
          limit: 1000,
        });

        for (const ev of data) {
          const pj = ev.parsedJson as AssetTransferredEvent;
          const tid = pj.asset_token_id;
          if (!wanted.has(tid)) continue;
          if (!latestToByToken.has(tid)) latestToByToken.set(tid, pj.to);
          if (latestToByToken.size === wanted.size) break;
        }

        if (!hasNextPage || latestToByToken.size === wanted.size) break;
        cursor = nextCursor;
      }

      // 4) Resolve assets and override owner with latest transfer "to" if present
      const loaded = await Promise.all(
        minted.map(async ({ asset_token_id, asset_id }) => {
          try {
            const res = await client.getObject({
              id: asset_id,
              options: { showContent: true, showOwner: true },
            });

            const owner = res.data?.owner;
            if (!owner) return null;

            const onChainOwner =
              typeof owner === 'string'
                ? null // "Immutable"
                : 'AddressOwner' in owner
                  ? owner.AddressOwner
                  : 'ObjectOwner' in owner
                    ? owner.ObjectOwner
                    : 'ConsensusAddressOwner' in owner
                      ? owner.ConsensusAddressOwner.owner
                      : null; // "Shared"

            const effectiveOwner = latestToByToken.get(asset_token_id) ?? onChainOwner;
            if (!effectiveOwner) return null;

            const content = res.data?.content as any;
            const fields = content?.fields;
            if (!fields) return null;

            return effectiveOwner === userId.id
              ? {
                id: asset_id,
                owner: effectiveOwner,
                name: fields.name as string,
                description: fields.description as string,
                imageUrl: fields.imageUrl as string,
                count: fields.count as number,
                price: fields.price as number,
                gameId: fields.gameId as string,
                gameOwner: fields.gameOwner as string,
                metaData: [] as string[],
                renderingMetaData: [] as string[],
              }
              : null;
          } catch {
            return null;
          }
        })
      );

      if (alive) {
        setAssets(loaded.filter((f): f is Asset => f !== null));
      }
    })()
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [client, packageId, userId.id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-white text-black grid place-items-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <header className="w-full pt-16 pb-8 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        <h2 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight">
          My Assets
        </h2>
      </header>

      <section className="w-full px-4 md:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {assets.map((asset) => (
            <button
              key={asset.id ?? asset.gameId}
              type="button"
              onClick={() => router.push(`/dashboard/${asset.owner}/${asset.id}`)}
              aria-label={`Échanger ${asset.name}`}
              className="group relative w-full overflow-hidden text-left rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={asset.imageUrl || "https://picsum.photos/600/800"}
                  alt={asset.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-bold">{asset.name}</h3>
                <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                  {asset.description}
                </p>
                <span className="mt-3 inline-flex w-full justify-center rounded-full px-4 py-2 bg-black/80 group-hover:bg-black text-sm font-semibold transition-colors">
                  Trade / Transfer
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}