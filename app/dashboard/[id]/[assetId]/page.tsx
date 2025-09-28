"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { Asset } from "@/other/types/asset";
import { useNetworkVariable } from "@/networkConfig";
import { AssetMintedCreatedEvent } from "@/dashboard/[id]/page";

type AssetToken = {
  id: string,
  asset_id: string,
}

export default function TransferPage() {
  const { id, assetId } = useParams<{ id: string; assetId: string }>();
  const router = useRouter();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const { currentWallet } = useCurrentWallet();

  const [assetToken, setAssetToken] = useState<AssetToken | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);

  const suiClient = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  const tx = new Transaction();

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await client.queryEvents({
        query: { MoveEventType: `${packageId}::asset::AssetMintedEvent` },
      });

      const ids = data.map((e) => e.parsedJson as AssetMintedCreatedEvent);

      await Promise.all(
        ids.map(async ({ asset_token_id, asset_id }) => {

          try {
            const res = await client.getObject({
              id: asset_id,
              options: { showContent: true, showOwner: true },
            });

            console.log(res.data)

            const content = res.data?.content as any;
            const fields = content?.fields;

            const owner = res.data?.owner;
            if (!owner || !fields)
              return
            const ownerAddr =
              typeof owner === "string" ? null :                 // "Immutable"
                "AddressOwner" in owner ? owner.AddressOwner :
                  "ObjectOwner" in owner ? owner.ObjectOwner :
                    "ConsensusAddressOwner" in owner ? owner.ConsensusAddressOwner.owner :
  /* "Shared" */                            null;

            setAssetToken({
              id: asset_token_id,
              asset_id: asset_id,
            })

            setAsset({
              id: asset_id,
              owner: ownerAddr || "",
              name: fields.name as string,
              description: fields.description as string,
              imageUrl: fields.imageUrl as string,
              count: fields.count as number,
              price: fields.price as number,
              gameId: fields.gameId as string,
              gameOwner: fields.gameOwner as string,
              metaData: [] as string[],
              renderingMetaData: [] as string[],
            })
          } catch {
          }
        })
      );
    })()
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [client, packageId]);

  const canTransfer = useMemo(() => {
    if (!assetToken) return false;
    if (!account?.address) return false;
    if (!recipient || recipient.length < 10) return false;
    if (isPending) return false;
    return true;
  }, [assetToken, account?.address, recipient, isPending]);

  if (loading) return <div>Loading ...</div>
  if (asset == null) return <div>Loading ...</div>
  if (assetToken == null) return <div>Loading ...</div>

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-white text-black flex items-center justify-center">
        <div className="animate-pulse text-lg">Chargement de l'asset…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center p-6">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => router.push(`/dashboard/${id}`)}
          className="mt-4 rounded-full px-5 py-2 bg-black text-white hover:bg-black/80"
        >
          Retour
        </button>
      </main>
    );
  }

  if (!assetToken) {
    return (
      <main className="min-h-screen w-full bg-white text-black grid place-items-center">
        <p className="text-gray-700">Aucun asset trouvé.</p>
      </main>
    );
  }

  async function handleTransfer() {
    if (!assetToken || !currentWallet) return

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::asset::transfer_asset`,
      arguments: [
        tx.object(assetToken.id),
        tx.pure.address(recipient)
      ],
    } as any);

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: { showEffects: true },
          });
        },
      }
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-black">
      <header className="w-full pt-10 pb-6 px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <button
          onClick={() => router.push(`/dashboard/${id}`)}
          className="rounded-full px-4 py-2 border border-gray-300 hover:bg-gray-100 transition"
          aria-label="Retour au dashboard"
        >
          ← Back
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Trade Center
        </h1>
        <div />
      </header>

      <section className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start gap-8">
          {/* Carte expéditeur */}
          <div className="rounded-3xl bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">From</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 overflow-hidden rounded-2xl shadow">
                <img
                  src={asset.imageUrl || "https://picsum.photos/400/400"}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">{asset.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {asset.description}
                </p>
                <p className="mt-2 text-xs text-gray-500">ID: {asset.id}</p>
                <p className="text-xs text-gray-500">
                  Owner: {asset.owner?.slice(0, 10)}…
                </p>
              </div>
            </div>
          </div>

          {/* Pokéball */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-full border-8 border-black relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-black bg-white" />
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-500">
              Exchange
            </div>
          </div>

          {/* Carte destinataire */}
          <div className="rounded-3xl bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">To</h2>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              To SUI address
            </label>
            <input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="off"
              spellCheck={false}
            />

            <button
              type="button"
              onClick={handleTransfer}
              disabled={!canTransfer}
              className={`mt-4 w-full rounded-full px-5 py-3 text-white font-semibold transition
                ${canTransfer
                  ? "bg-black hover:bg-black/80"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Confirme Transfer
            </button>

            {isPending && (
              <p className="mt-3 text-sm text-gray-600">Signature en cours…</p>
            )}
            {/*
            {txDigest && (
              <div className="mt-3 text-sm">
                <span className="font-semibold">Transfert confirmé.</span>{" "}
                Tx digest: <span className="font-mono">{txDigest}</span>
              </div>
            )}
              */}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          Double-check the address. One mistake and your asset flies off on its own like an offended Charizard.
        </div>
      </section>
    </main>
  );
}