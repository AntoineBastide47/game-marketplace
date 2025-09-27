import React, { useState, useTransition } from "react";
import { addGameAction } from "../actions/addGame";
import { X } from "lucide-react";
import { useNetworkVariable } from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

interface AddGameModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (game: { id: number; name: string; description: string; coverImage?: string; gameLink?: string }) => void;
}

export default function AddGameModal({ open, onClose, onCreated }: AddGameModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const packageId = useNetworkVariable("packageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
  const tx = new Transaction();

  if (!open) return null;

  function validate(): string | null {
    if (!name.trim()) return "Le nom est requis";
    if (!description.trim()) return "La description est requise";
    // URLs optionnelles mais si renseignées, on tente une validation légère
    const urlish = (s: string) => /^(https?:\/\/).+/.test(s);
    if (coverImage && !urlish(coverImage)) return "Cover image doit être une URL valide (https://...)";
    if (gameLink && !urlish(gameLink)) return "Game link doit être une URL valide (https://...)";
    return null;
  }


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError(null);

    tx.moveCall({
      target: `${packageId}::game::create_game`,
      arguments: [tx.pure.string(name), tx.pure.string(description), tx.pure.string(coverImage), tx.pure.string(gameLink)],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          try {
            console.log(effects?.created?.[0]?.reference?.objectId);
          } catch (e) {
            if (e instanceof Error)
              setError(e.message);
            else
              setError(String(e));
          }
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Ajouter un jeu</h3>
          <button onClick={onClose} aria-label="Fermer" className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3 text-sm">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nom du jeu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-[100px] rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Pitch en deux lignes"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cover image (URL)</label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
              inputMode="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Game link (URL)</label>
            <input
              value={gameLink}
              onChange={(e) => setGameLink(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
              inputMode="url"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Annuler</button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isPending ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}