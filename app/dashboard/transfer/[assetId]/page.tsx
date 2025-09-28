// app/dashboard/[id]/transfer/[assetId]/page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import type { Asset } from "@/other/types/asset";

// ————————————————————————————————————————————————————————————————
// Helpers
const isSuiAddress = (s: string) => /^0x[a-f0-9]{40,64}$/i.test(s);
const shorten = (s?: string, n = 10) => (s ? `${s.slice(0, n)}…${s.slice(-4)}` : "");

// ————————————————————————————————————————————————————————————————
type LoadedAsset = Asset & { rawId: string };

export default function TransferPage() {
  // /dashboard/[id]/transfer/[assetId]
  const { id: dashboardId, assetId } = useParams<{ id: string; assetId: string }>();
  const router = useRouter();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [asset, setAsset] = useState<LoadedAsset | null>(null);
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'asset
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

  const addressValid = isSuiAddress(recipient);
  const canTransfer = !!asset && !!account?.address && addressValid && !isPending;

  async function handleTransfer() {
    setError(null);
    setTxDigest(null);
    try {
      if (!account?.address) throw new Error("Aucun compte connecté.");
      if (!asset) throw new Error("Asset non chargé.");
      if (!addressValid) throw new Error("Adresse Sui invalide.");

      const tx = new Transaction();
      tx.transferObjects([tx.object(asset.rawId)], tx.pure.address(recipient));

      const result = await signAndExecute({
        transaction: tx,
        options: { showEffects: true, showInput: true },
      });

      setTxDigest(result?.digest ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Le transfert a échoué.");
    }
  }

  // ————————————————————————————————————————————————————————————————
  // UI
  if (loading) {
    return (
      <main className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-indigo-100 via-white to-indigo-50">
        <div className="animate-pulse rounded-2xl bg-white/70 px-6 py-4 shadow">Chargement de l’asset…</div>
      </main>
    );
  }

  if (error && !asset) {
    return (
      <main className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-rose-50 via-white to-rose-100">
        <div className="rounded-2xl border border-rose-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-rose-700 font-semibold">{error}</p>
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}`)}
            className="mt-4 rounded-full px-4 py-2 bg-black text-white hover:bg-black/80"
          >
            Retour
          </button>
        </div>
      </main>
    );
  }

  if (!asset) {
    return (
      <main className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-indigo-100 via-white to-indigo-50">
        <p className="text-gray-700">Aucun asset trouvé.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.20),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.15),transparent_40%)]">
      {/* Topbar local */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}`)}
            className="rounded-full px-4 py-2 border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Retour au dashboard"
          >
            ← Retour
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Trade Center</h1>
          <div className="w-24" />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* Carte émetteur */}
<div className="h-full rounded-3xl bg-white/80 backdrop-blur shadow-xl p-6 border border-black/5 flex flex-col justify-between">
  <div>
    <div className="flex items-start justify-between">
      <h2 className="text-xl font-bold">Vous</h2>
      <span className="text-xs rounded-full bg-black text-white px-2 py-1">Owner</span>
    </div>

    <div className="mt-4 flex items-center gap-5">
      <div className="relative w-28 h-28 overflow-hidden rounded-2xl ring-1 ring-black/10 shadow">
        <img
          src={asset.imageUrl || "https://picsum.photos/400/400"}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-semibold truncate">{asset.name}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{asset.description}</p>
        <div className="mt-3 space-y-1 text-xs text-gray-500">
          <p className="font-mono break-all">ID: {asset.rawId}</p>
          <p>Owner: {shorten(asset.owner)}</p>
        </div>
      </div>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
    <div className="rounded-2xl border border-black/10 p-3">
      <p className="text-xs text-gray-500">Count</p>
      <p className="font-semibold">{asset.count ?? 1}</p>
    </div>
    <div className="rounded-2xl border border-black/10 p-3">
      <p className="text-xs text-gray-500">Game</p>
      <p className="font-semibold truncate">{shorten(asset.gameId)}</p>
    </div>
    <div className="rounded-2xl border border-black/10 p-3">
      <p className="text-xs text-gray-500">Price</p>
      <p className="font-semibold">{asset.price ?? 0}</p>
    </div>
  </div>
</div>

          {/* Séparateur animé type Pokéball */}
          <div className="flex flex-col items-center gap-2 select-none">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-8 border-black relative overflow-hidden shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-red-500" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-black bg-white" />
              </div>
            </div>
          </div>

          {/* Carte destinataire */}
<div className="h-full rounded-3xl bg-white/80 backdrop-blur shadow-xl p-6 border border-black/5 flex flex-col justify-between">
  <div>
    <h2 className="text-xl font-bold">Destinataire</h2>

    <label htmlFor="recipient" className="mt-4 block text-sm font-medium text-gray-700">
      Adresse Sui
    </label>
    <div className="mt-2 flex gap-2">
      <input
        id="recipient"
        type="text"
        placeholder="0x..."
        value={recipient}
        onChange={(e) => setRecipient(e.target.value.trim())}
        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoComplete="off"
        spellCheck={false}
        disabled={isPending}
      />
      <button
        type="button"
        onClick={() => setRecipient(account?.address ?? "")}
        className="rounded-xl px-4 py-3 border border-gray-300 hover:bg-gray-100"
        disabled={!account?.address || isPending}
        title="Me remplir"
      >
        Moi
      </button>
    </div>

    {!recipient ? (
      <p className="mt-2 text-xs text-gray-500">Colle une adresse Sui en 0x…</p>
    ) : addressValid ? (
      <p className="mt-2 text-xs text-emerald-600">Adresse valide.</p>
    ) : (
      <p className="mt-2 text-xs text-rose-600">Adresse invalide. Format attendu: 0x… hex.</p>
    )}
  </div>

  <div className="mt-6">
    <button
      type="button"
      onClick={handleTransfer}
      disabled={!canTransfer}
      className={`w-full rounded-full px-5 py-3 text-white font-semibold transition
        ${
          canTransfer
            ? "bg-black hover:bg-black/90 active:scale-[0.99]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
    >
      Confirmer le transfert
    </button>

    {isPending && <div className="mt-3 text-sm text-gray-600">Signature en cours…</div>}
    {txDigest && (
      <div className="mt-3 text-sm rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <span className="font-semibold">Transfert confirmé.</span>
        <div className="font-mono break-all mt-1">Tx: {txDigest}</div>
        <div className="mt-3">
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}`)}
            className="rounded-full px-4 py-2 border border-gray-300 hover:bg-gray-100"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    )}
    {error && (
      <div className="mt-3 text-sm rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
        {error}
      </div>
    )}
  </div>
</div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Vérifie bien l’adresse. Une faute et ton asset fait sa vie ailleurs, comme un Dracaufeu vexé.
        </p>
      </section>
    </main>
  );
}