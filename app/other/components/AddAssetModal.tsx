// app/components/AddAssetModal.tsx
"use client";
import * as React from "react";
import type { Rarity } from "@/other/types/asset";
import { X, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/networkConfig";
import { useParams } from "next/navigation";

const U64_MAX = BigInt("18446744073709551615");

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const RARITY_OPTIONS: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "exotic",
  "ancient",
  "divine",
  "transcendent",
];

const META_KEYS = ["color", "style", "material", "pattern"] as const;
// on n’impose plus MetaKey, on passe en string pour autoriser les clés libres
type MetaRow = { id: number; key: string; isCustom?: boolean; value: string };

const STYLE_OPTIONS = ["bold", "italic", "bold+italic"] as const;

export default function AddAssetModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [rarity, setRarity] = React.useState<Rarity>("common");
  const [price, setPrice] = React.useState<number>(0);
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const tx = new Transaction();
  const { id } = useParams<{ id: string }>();

  // nouveau: gestion du nombre de skins, avec option "infini"
  const [skinsCount, setSkinsCount] = React.useState<number>(0);
  const [skinsInfinite, setSkinsInfinite] = React.useState<boolean>(false);

  const [meta, setMeta] = React.useState<MetaRow[]>([
    { id: 1, key: "color", value: "#251818" },
    { id: 2, key: "style", value: "bold" },
  ]);
  const [submitting, setSubmitting] = React.useState(false);

  const usedKeys = React.useMemo(() => new Set(meta.map((m) => m.key.trim()).filter(Boolean)), [meta]);
  const availableKeys = React.useMemo(
    () => (META_KEYS as readonly string[]).filter((k) => !usedKeys.has(k)),
    [usedKeys]
  );

  const hasDuplicateKeys = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of meta) {
      const k = r.key.trim();
      if (!k) continue;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    return Array.from(counts.values()).some((n) => n > 1);
  }, [meta]);

  const hasEmptyCustomKey = React.useMemo(
    () => meta.some((r) => r.isCustom && !r.key.trim()),
    [meta]
  );

  const priceNegative = price < 0;
  const skinsNegative = !skinsInfinite && skinsCount < 0;

  // nouveaux flags "zéro interdit"
  const priceZero = price === 0;
  const skinsZero = !skinsInfinite && skinsCount === 0;

  function addMetaRow() {
    // s’il reste des clés suggérées libres, on en prend une; sinon on ouvre un champ custom
    if (availableKeys.length > 0) {
      const nextKey = availableKeys[0];
      setMeta((prev) => [...prev, { id: Date.now(), key: nextKey, value: defaultValueFor(nextKey) }]);
    } else {
      setMeta((prev) => [...prev, { id: Date.now(), key: "", isCustom: true, value: "" }]);
    }
  }

  function updateMetaRow(id: number, patch: Partial<MetaRow>) {
    setMeta((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeMetaRow(id: number) {
    setMeta((rows) => rows.filter((r) => r.id !== id));
  }

  function resetForm() {
    setName("");
    setDescription("");
    setImage("");
    setRarity("common");
    setPrice(0);
    setSkinsCount(0);
    setSkinsInfinite(false);
    setMeta([
      { id: 1, key: "color", value: "#251818" },
      { id: 2, key: "style", value: "bold" },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    if (hasDuplicateKeys || hasEmptyCustomKey) return;
    if (priceNegative || skinsNegative) return;
    if (priceZero || skinsZero) return; // blocage si 0

    setSubmitting(true);

    tx.moveCall({
      target: `${packageId}::asset::create_asset`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(image || "https://picsum.photos/600/800"),
        tx.pure.u64(skinsInfinite ? U64_MAX : skinsCount),
        tx.pure.u64(price),
        tx.pure.id(id),
        tx.pure.address(account?.address || ""),
        tx.pure.vector("string", []),
        tx.pure.vector("string", []),
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

          onCreated();
          resetForm();
          setSubmitting(false);
          onClose();
        },
        onError: () => setSubmitting(false),
      }
    );
  }

  if (!open) return null;

  const formInvalid =
    !name.trim() ||
    !description.trim() ||
    submitting ||
    hasDuplicateKeys ||
    hasEmptyCustomKey ||
    priceNegative ||
    skinsNegative ||
    priceZero || // prix doit être > 0
    skinsZero;   // nombre doit être > 0 si non infini

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 id="add-item-title" className="text-xl font-semibold tracking-tight">
            Ajouter un asset
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corps */}
        <form id="form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          {/* Main */}
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Main</h4>
          <div className="space-y-4">
            <Input label="Nom *" value={name} onChange={setName} required placeholder="Ex. Crimson Blade" />
            <Textarea label="Description *" value={description} onChange={setDescription} required />
            <Input label="URL de l'image (optionnel)" value={image} onChange={setImage} placeholder="https://…" />
            <Select
              label="Rareté"
              value={rarity}
              onChange={(v: string) => setRarity(v as Rarity)}
              options={RARITY_OPTIONS}
            />

            {/* Prix non négatif */}
            <Input
              label="Prix (SUI)"
              type="number"
              min={0}
              value={Number.isFinite(price) ? String(price) : "0"}
              onChange={(v: string) => {
                const n = parseFloat(v);
                setPrice(Number.isFinite(n) ? n : 0);
              }}
            />

            {priceNegative && <FieldError message="Le prix ne peut pas être négatif." />}
            {priceZero && <FieldError message="Le prix doit être supérieur à 0." />}

            {/* Nombre de skins + option infini */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Nombre de skins</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={skinsInfinite}
                    onChange={(e) => setSkinsInfinite(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>Infini</span>
                </label>
              </div>
              <input
                type="number"
                min={0}
                step={1}
                disabled={skinsInfinite}
                value={skinsInfinite ? "" : String(Number.isFinite(skinsCount) ? skinsCount : 0)}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setSkinsCount(Number.isFinite(n) ? n : 0);
                }}
                placeholder={skinsInfinite ? "Infini" : "0"}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              {skinsNegative && <FieldError message="Le nombre de skins ne peut pas être négatif." />}
              {skinsZero && <FieldError message="Le nombre de skins doit être supérieur à 0 (ou cochez Infini)." />}
            </div>
          </div>

          {/* Meta data */}
          <h4 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">Meta data</h4>

          {(hasDuplicateKeys || hasEmptyCustomKey) && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <p className="text-sm">
                Corrigez les métadonnées: {hasDuplicateKeys ? "clés dupliquées" : ""}
                {hasDuplicateKeys && hasEmptyCustomKey ? " · " : ""}
                {hasEmptyCustomKey ? "clé personnalisée vide" : ""}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {meta.map((row) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-[260px_1fr_auto] gap-2 items-center">
                {/* Éditeur de clé */}
                <div className="flex items-center gap-2">
                  {!row.isCustom ? (
                    <select
                      value={row.key}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "__custom__") {
                          updateMetaRow(row.id, { isCustom: true, key: "" });
                        } else {
                          updateMetaRow(row.id, { key: val, value: defaultValueFor(val) });
                        }
                      }}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      {/* garder la valeur actuelle même si prise, pour ne pas la faire disparaître */}
                      {[row.key, ...availableKeys.filter((k) => k !== row.key)].map((k) => {
                        const takenByOther = k !== row.key && meta.some((m) => m.key === k);
                        return (
                          <option key={k} value={k} disabled={takenByOther}>
                            {k}
                          </option>
                        );
                      })}
                      <option value="__custom__">— personnalisé… —</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) => updateMetaRow(row.id, { key: e.target.value })}
                      placeholder="clé personnalisée (ex. faction, set, tier)"
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  )}
                </div>

                {/* Éditeur de valeur */}
                <div className="flex items-center gap-2">
                  {row.key === "color" && !row.isCustom ? (
                    <>
                      <input
                        type="color"
                        value={isValidHex(row.value) ? row.value : "#FFFFFF"}
                        onChange={(e) => updateMetaRow(row.id, { value: e.target.value })}
                        className="h-10 w-12 rounded-md border"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => updateMetaRow(row.id, { value: normalizeHex(e.target.value) })}
                        placeholder="#FFFFFF"
                        className="flex-1 rounded-lg border px-3 py-2"
                      />
                    </>
                  ) : row.key === "style" && !row.isCustom ? (
                    <select
                      value={row.value || STYLE_OPTIONS[0]}
                      onChange={(e) => updateMetaRow(row.id, { value: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      {STYLE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateMetaRow(row.id, { value: e.target.value })}
                      placeholder="valeur"
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeMetaRow(row.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border text-gray-600 hover:bg-gray-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addMetaRow}
              className="mt-2 w-full rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 py-3 flex items-center justify-center gap-2 text-indigo-700 font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter un champ
            </button>

            {/* Aide: suggestions de clés courantes */}
            <p className="mt-2 text-xs text-gray-500">
              Astuce: vous pouvez saisir vos propres clés. Suggestions: {Array.from(META_KEYS).join(", ")}.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-end gap-3 border-t px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="form"
            disabled={formInvalid}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}

/* Petits composants utilitaires */
function Input({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  min,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        disabled={disabled}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        required={required}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-sm text-red-600">{message}</p>;
}

/* Helpers hex */
function normalizeHex(v: string) {
  let s = v.trim();
  if (!s) return "";
  if (!s.startsWith("#")) s = `#${s}`;
  if (/^#([0-9A-Fa-f]{3})$/.test(s)) {
    s = "#" + s.slice(1).split("").map((c) => c + c).join("");
  }
  return s.slice(0, 7);
}
function isValidHex(v: string) {
  return /^#([0-9A-Fa-f]{6})$/.test(v.trim());
}
function defaultValueFor(k: string) {
  if (k === "color") return "#FFFFFF";
  if (k === "style") return "bold";
  return "";
}