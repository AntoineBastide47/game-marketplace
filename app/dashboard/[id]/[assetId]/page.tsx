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

            const content = res.data?.content as any;
            const fields = content?.fields;

            const owner = res.data?.owner;
            if (!owner || !fields) return;

            const ownerAddr =
              typeof owner === "string" ? null :                 // "Immutable"
                "AddressOwner" in owner ? owner.AddressOwner :
                  "ObjectOwner" in owner ? owner.ObjectOwner :
                    "ConsensusAddressOwner" in owner ? owner.ConsensusAddressOwner.owner :
  /* "Shared" */                            null;

            setAssetToken({
              id: asset_token_id,
              asset_id: asset_id,
            });

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
            });
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

  if (loading) return <div className="min-h-screen grid place-items-center bg-neutral-50 text-neutral-800">Chargement…</div>;
  if (asset == null) return <div className="min-h-screen grid place-items-center bg-neutral-50 text-neutral-800">Chargement…</div>;
  if (assetToken == null) return <div className="min-h-screen grid place-items-center bg-neutral-50 text-neutral-800">Chargement…</div>;

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-neutral-50 text-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-base">Chargement de l’asset…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => router.push(`/dashboard/${id}`)}
          className="mt-4 rounded-xl px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800"
        >
          Retour
        </button>
      </main>
    );
  }

  if (!assetToken) {
    return (
      <main className="min-h-screen w-full bg-neutral-50 text-neutral-900 grid place-items-center">
        <p className="text-neutral-600">Aucun asset trouvé.</p>
      </main>
    );
  }

  async function handleTransfer() {
    if (!assetToken || !currentWallet) return;

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
    <main className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Header minimal */}
      <header className="w-full px-16 md:px-16 lg:px-16 pt-16 pb-16 border-b border-neutral-200">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => router.push(`/dashboard/${id}`)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-neutral-300 text-sm hover:bg-white transition"
            aria-label="Retour au dashboard"
          >
            <span aria-hidden>←</span>
            <span>Retour</span>
          </button>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Transférer l’asset</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Contenu */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Carte expéditeur */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4">Depuis</h2>
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 overflow-hidden rounded-xl border border-neutral-200">
                <img
                  src={asset.imageUrl || "https://picsum.photos/400/400"}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium truncate">{asset.name}</p>
                <p className="text-sm text-neutral-600 line-clamp-2">{asset.description}</p>
                <div className="mt-3 space-y-1 text-xs text-neutral-500">
                  <p>ID: <span className="font-mono break-all">{asset.id}</span></p>
                  <p>Propriétaire: <span className="font-mono">{asset.owner?.slice(0, 10)}…</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte destinataire */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4">Vers</h2>
            <label htmlFor="recipient" className="block text-sm font-medium text-neutral-800">Adresse SUI du destinataire</label>
            <input
              id="recipient"
              type="text"
              placeholder="0x…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-800"
              autoComplete="off"
              spellCheck={false}
            />

            <button
              type="button"
              onClick={handleTransfer}
              disabled={!canTransfer}
              className={`mt-4 w-full rounded-lg px-5 py-3 text-white font-medium transition ${canTransfer ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-300 cursor-not-allowed"}`}
            >
              Confirmer le transfert
            </button>

            {isPending && (
              <p className="mt-3 text-sm text-neutral-600">Signature en cours…</p>
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        {/* Indication */}
        <p className="mt-10 text-center text-xs text-neutral-500">
          Vérifiez l’adresse attentivement. Une seule erreur et l’asset est perdu.
        </p>
      </section>
    </main>
  );
}
