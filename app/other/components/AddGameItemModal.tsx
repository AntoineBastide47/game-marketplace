// app/components/AddGameItemModal.tsx
"use client";
import * as React from "react";
import type { GameItem } from "@/other/types/gameItem";
import type { Rarity } from "@/other/types/game";
import { X, Plus, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (item: GameItem) => void;
};

const RARITY_OPTIONS: Rarity[] = ["common", "rare", "legendary"] as unknown as Rarity[];
const META_KEYS = ["color", "style", "material", "pattern"] as const;
type MetaKey = (typeof META_KEYS)[number];
const STYLE_OPTIONS = ["bold", "italic", "bold+italic"] as const;
type MetaRow = { id: number; key: MetaKey; value: string };

export default function AddGameItemModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [rarity, setRarity] = React.useState<Rarity>(RARITY_OPTIONS[0]);
  const [price, setPrice] = React.useState<number>(0);

  const [meta, setMeta] = React.useState<MetaRow[]>([
    { id: 1, key: "color", value: "#251818" },
    { id: 2, key: "style", value: "bold" },
  ]);
  const [submitting, setSubmitting] = React.useState(false);

  const usedKeys = React.useMemo(() => new Set(meta.map((m) => m.key)), [meta]);
  const availableKeys = React.useMemo(
    () => META_KEYS.filter((k) => !usedKeys.has(k)),
    [usedKeys]
  );

  function addMetaRow() {
    if (availableKeys.length === 0) return;
    const nextKey = availableKeys[0];
    setMeta((prev) => [...prev, { id: Date.now(), key: nextKey, value: defaultValueFor(nextKey) }]);
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
    setRarity(RARITY_OPTIONS[0]);
    setPrice(0);
    setMeta([
      { id: 1, key: "color", value: "#251818" },
      { id: 2, key: "style", value: "bold" },
    ]);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setSubmitting(true);

    const item: GameItem = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      image: image.trim() || "https://picsum.photos/600/800",
      rarity,
      price,
    };

    onCreated(item);
    resetForm();
    setSubmitting(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header fixé */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 id="add-item-title" className="text-xl font-semibold tracking-tight">
            Ajouter un item
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

        {/* Corps scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          {/* MAIN */}
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Main
          </h4>
          <div className="space-y-4">
            <Input label="Nom *" value={name} onChange={setName} required placeholder="Ex. Crimson Blade" />
            <Textarea label="Description *" value={description} onChange={setDescription} required />
            <Input label="URL de l’image (optionnel)" value={image} onChange={setImage} placeholder="https://…" />
            <Select label="Rareté" value={rarity} onChange={(v) => setRarity(v as Rarity)} options={RARITY_OPTIONS} />
            <Input label="Prix (€)" type="number" value={price.toString()} onChange={(v) => setPrice(parseFloat(v) || 0)} />
          </div>

          {/* META DATA */}
          <h4 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Meta data
          </h4>
          <div className="space-y-3">
            {meta.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-2 items-center">
                <select
                  value={row.key}
                  onChange={(e) =>
                    updateMetaRow(row.id, { key: e.target.value as MetaKey, value: defaultValueFor(e.target.value as MetaKey) })
                  }
                  className="rounded-lg border px-3 py-2"
                >
                  {META_KEYS.map((k) => {
                    const takenByOther = k !== row.key && meta.some((m) => m.key === k);
                    return (
                      <option key={k} value={k} disabled={takenByOther}>
                        {k}
                      </option>
                    );
                  })}
                </select>
                <div className="flex items-center gap-2">
                  {row.key === "color" ? (
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
                  ) : row.key === "style" ? (
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
              disabled={availableKeys.length === 0}
              className="mt-2 w-full rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 py-3 flex items-center justify-center gap-2 text-indigo-700 font-medium disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Ajouter un champ
            </button>
          </div>
        </form>

        {/* Footer fixé */}
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
            disabled={!name.trim() || !description.trim() || submitting}
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

// Petits composants utilitaires
function Input({ label, value, onChange, required = false, type = "text", placeholder = "" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
function Textarea({ label, value, onChange, required = false }: any) {
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
function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
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
function defaultValueFor(k: MetaKey) {
  if (k === "color") return "#FFFFFF";
  if (k === "style") return "bold";
  return "";
}