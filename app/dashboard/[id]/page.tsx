"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSuiClient } from "@/other/contexts/SuiClientContext";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { Asset } from "@/other/types/asset";

type LoadedAsset = Asset & { rawId: string };

export default function TransferPage() {
  // /dashboard/[id]/transfer/[assetId]
  const { id, assetId } = useParams<{ id: string; assetId: string }>();
  const router = useRouter();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } =
    useSignAndExecuteTransactionBlock();

  const [asset, setAsset] = useState<LoadedAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await client.getObject({
          id: assetId,
          options: { showContent: true, showOwner: true },
        });

        const content: any = res.data?.content;
        const fields = content?.fields;
        if (!fields) throw new Error("Objet introuvable ou contenu absent.");

        const loaded: LoadedAsset = {
          rawId: String(assetId),
          id: String(assetId),
          owner: (res.data as any)?.owner?.AddressOwner ?? "",
          name: fields.name as string,
          description: fields.description as string,
          imageUrl: fields.imageUrl as string,
          count: Number(fields.count) || 1,
          price: Number(fields.price) || 0,
          gameId: fields.gameId as string,
          gameOwner: fields.gameOwner as string,
          metaData: [],
          renderingMetaData: [],
        };

        if (alive) setAsset(loaded);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Erreur de chargement.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [client, assetId]);

  const canTransfer = useMemo(() => {
    if (!asset) return false;
    if (!account?.address) return false;
    if (!recipient || recipient.length < 10) return false;
    if (isPending) return false;
    return true;
  }, [asset, account?.address, recipient, isPending]);

  async function handleTransfer() {
    setError(null);
    setTxDigest(null);
    try {
      if (!account?.address) throw new Error("Aucun compte connecté.");
      if (!asset) throw new Error("Asset non chargé.");
      if (!recipient) throw new Error("Adresse destinataire manquante.");

      const tx = new TransactionBlock();
      tx.transferObjects([tx.object(asset.rawId)], tx.pure.address(recipient));

      const result = await signAndExecute({
        transactionBlock: tx,
        options: { showEffects: true, showInput: true },
      });

      setTxDigest(result?.digest ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Le transfert a échoué.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-white text-black flex items-center justify-center">
        <div className="animate-pulse text-lg">Chargement de l’asset…</div>
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

  if (!asset) {
    return (
      <main className="min-h-screen w-full bg-white text-black grid place-items-center">
        <p className="text-gray-700">Aucun asset trouvé.</p>
      </main>
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
          ← Retour
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
            <h2 className="text-xl font-bold mb-4">Vous</h2>
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
                <p className="mt-2 text-xs text-gray-500">ID: {asset.rawId}</p>
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
            <h2 className="text-xl font-bold mb-4">Destinataire</h2>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse Sui du destinataire
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
                ${
                  canTransfer
                    ? "bg-black hover:bg-black/80"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Confirmer le transfert
            </button>

            {isPending && (
              <p className="mt-3 text-sm text-gray-600">Signature en cours…</p>
            )}
            {txDigest && (
              <div className="mt-3 text-sm">
                <span className="font-semibold">Transfert confirmé.</span>{" "}
                Tx digest: <span className="font-mono">{txDigest}</span>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          Vérifie bien l’adresse. Une faute et ton asset fait sa vie ailleurs,
          comme un Dracaufeu vexé.
        </div>
      </section>
    </main>
  );
}