"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Game } from "@/other/types/game";
import { ArrowLeft, Search, ChevronDown, Plus } from "lucide-react";
import type { Asset, Rarity } from "@/other/types/asset";
import { useParams, useRouter } from "next/navigation";
import { useSuiClient } from "@/other/contexts/SuiClientContext";
// importe bien le default export du fichier AddAssetModal.tsx
import AddAssetModal from "@/other/components/AddAssetModal";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/networkConfig";

export type AssetCreatedEvent = {
  asset_id: string;
  creator: string;
};

// Helpers
const formatPrice = (v: number, locale = "fr-FR", currency = "EUR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

const PLACEHOLDER_IMG = "https://picsum.photos/600/800";

// Décorations partagées
const glowBorder =
  "relative before:absolute before:inset-0 before:rounded-[14px] before:p-[1px] before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/0 before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:exclude]";

// Couleurs par rareté
const rarityBadgeClass: Record<Rarity, string> = {
  common: "bg-zinc-200 text-zinc-900 ring-1 ring-zinc-300/60",
  uncommon: "bg-emerald-200 text-emerald-900 ring-1 ring-emerald-300/60",
  rare: "bg-indigo-200 text-indigo-900 ring-1 ring-indigo-300/60",
  epic: "bg-fuchsia-200 text-fuchsia-900 ring-1 ring-fuchsia-300/60",
  legendary: "bg-amber-200 text-amber-900 ring-1 ring-amber-300/60",
  mythic: "bg-violet-200 text-violet-900 ring-1 ring-violet-300/60",
  exotic: "bg-teal-200 text-teal-900 ring-1 ring-teal-300/60",
  ancient: "bg-stone-300 text-stone-900 ring-1 ring-stone-400/60",
  divine: "bg-sky-200 text-sky-900 ring-1 ring-sky-300/60",
  transcendent: "bg-rose-200 text-rose-900 ring-1 ring-rose-300/60",
};

const rarityBgGradient: Record<Rarity, string> = {
  common: "from-zinc-800 via-zinc-500 to-zinc-100",
  uncommon: "from-emerald-800 via-emerald-400 to-emerald-100",
  rare: "from-indigo-800 via-indigo-400 to-indigo-100",
  epic: "from-fuchsia-800 via-fuchsia-400 to-fuchsia-100",
  legendary: "from-amber-600 via-amber-300 to-amber-100",
  mythic: "from-violet-800 via-violet-400 to-violet-100",
  exotic: "from-teal-800 via-teal-400 to-teal-100",
  ancient: "from-stone-700 via-stone-400 to-stone-100",
  divine: "from-sky-700 via-sky-400 to-sky-100",
  transcendent: "from-rose-700 via-rose-400 to-rose-100",
};

const headerGradient: Record<Rarity, string> = {
  common: "from-zinc-400 to-zinc-700",
  uncommon: "from-emerald-400 to-emerald-700",
  rare: "from-indigo-400 to-fuchsia-600",
  epic: "from-fuchsia-400 to-pink-600",
  legendary: "from-amber-400 to-rose-500",
  mythic: "from-violet-400 to-violet-700",
  exotic: "from-teal-400 to-teal-700",
  ancient: "from-stone-400 to-stone-700",
  divine: "from-sky-400 to-sky-700",
  transcendent: "from-rose-400 to-rose-700",
};

const normalizeRarity = (value: string | undefined | null): Rarity => {
  const v = (value || "").toLowerCase().trim();
  const all: Rarity[] = [
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
  return (all.find((r) => r === (v as Rarity)) ?? "common") as Rarity;
};

const getRarity = (a: Asset): Rarity => {
  /*
  const direct = a.metaData?.find((m) => m.name.toLowerCase() === "rarity")?.value;
  if (direct) return normalizeRarity(direct);
  for (const m of a.metaData || []) {
    const r = m.renderingMetaData?.find((x) => x.name.toLowerCase() === "rarity")?.value;
    if (r) return normalizeRarity(r);
  }
    */
  return "common";
};

const getImageUrl = (a: Asset): string => {
  /*
  const tryKeys = ["image", "thumbnail", "img", "imageUrl", "cover"];
  for (const m of a.metaData || []) {
    if (tryKeys.includes(m.name.toLowerCase())) return m.value || PLACEHOLDER_IMG;
    for (const r of m.renderingMetaData || []) {
      if (tryKeys.includes(r.name.toLowerCase())) return r.value || PLACEHOLDER_IMG;
    }
  }
    */
  return PLACEHOLDER_IMG;
};

const Badge: React.FC<{ rarity: Rarity }> = ({ rarity }) => (
  <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm tracking-wide font-extrabold uppercase ${rarityBadgeClass[rarity]}`}>
    {rarity}
  </span>
);

const SectionHeader: React.FC<{ title: string; gradientClass: string }> = ({ title, gradientClass }) => (
  <div className="flex items-center mb-4 md:mb-6">
    <div className={`h-8 w-1 rounded bg-gradient-to-b ${gradientClass} shadow-[0_0_0_1px_rgba(255,255,255,0.4)_inset] mr-4`} aria-hidden />
    <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
  </div>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Revenir à l'aperçu"
    className="group relative inline-flex items-center h-11 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:translate-y-px transition-transform"
  >
    <span aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl opacity-70 blur-[6px] transition-opacity duration-300 group-hover:opacity-100 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.indigo.300)_0deg,transparent_90deg,theme(colors.fuchsia.300)_180deg,transparent_270deg,theme(colors.rose.300)_360deg)]" />
    <span className="relative z-10 inline-flex items-center gap-2 h-[42px] pl-3 pr-4 rounded-[14px] bg-white/75 backdrop-blur-md border border-white/70 shadow-sm">
      <ArrowLeft className="h-4 w-4" aria-hidden />
      <span className="font-semibold tracking-tight">Retour</span>
    </span>
    <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-24 translate-x-10 group-hover:translate-x-0 transition-transform duration-300 bg-gradient-to-l from-fuchsia-300/40 to-transparent rounded-2xl" />
    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_50%_at_30%_0%,#000,transparent)] -translate-x-1/2 group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-white/0 via-white/60 to-white/0" />
  </button>
);

const SkinCard: React.FC<{ item: Asset; onClick: (item: Asset) => void }> = ({ item, onClick }) => {
  const rarity = getRarity(item);
  const img = getImageUrl(item);
  return (
    <button
      type="button"
      aria-label={`Voir ${item.name}`}
      onClick={() => onClick(item)}
      className={`group relative text-left cursor-pointer focus:outline-none rounded-2xl ${glowBorder} transition-transform duration-300 hover:-translate-y-1 hover:scale-105`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-indigo-500" />
      <div className={`relative bg-gradient-to-b ${rarityBgGradient[rarity]} p-[3px] rounded-2xl shadow-xl`}>
        <div className="rounded-[18px] bg-white/60 backdrop-blur-md border border-white/60">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-t-[18px] grid place-items-center p-3">
            <img src={img} alt={item.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg md:text-xl text-zinc-900 truncate" title={item.name}>{item.name}</h3>
              <Badge rarity={rarity} />
            </div>
            <p className="text-zinc-700 text-base md:text-lg mt-3 font-medium">{formatPrice(item.price)}</p>
          </div>
        </div>
      </div>
    </button>
  );
};


const AddCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex justify-center">
    <button
      type="button"
      onClick={onClick}
      aria-label="Ajouter un asset"
      className="aspect-square w-48 rounded-2xl border-2 border-dashed border-zinc-300 bg-white
                 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
                 flex flex-col items-center justify-center gap-2 p-4"
    >
      <div className="h-12 w-12 rounded-xl border-2 border-dashed border-zinc-300 grid place-items-center">
        <Plus className="h-6 w-6" aria-hidden />
      </div>
      <span className="font-semibold text-zinc-700">Ajouter</span>
      <span className="text-xs text-zinc-500">Nouvel asset</span>
    </button>
  </div>
);

const labelByFilter: Record<"all" | Rarity, string> = {
  all: "Tous",
  common: "Commun",
  uncommon: "Peu commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique",
  exotic: "Exotique",
  ancient: "Ancien",
  divine: "Divin",
  transcendent: "Transcendant",
};

const rarityOrder: Rarity[] = [
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

export default function GamePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const [query, setQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [sort, setSort] = useState<"popular" | "priceAsc" | "priceDesc">("popular");

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // état des assets (local) + modal
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        if (alive) {
          setError("Paramètre id manquant");
          setLoading(false);
        }
        return;
      }
      try {
        const res = await client.getObject({ id, options: { showContent: true } });
        const content: any = res?.data?.content;
        if (content?.dataType === "moveObject" && content?.fields) {
          const f = content.fields;
          const loaded: Game = {
            id,
            owner: String(f.owner ?? ""),
            name: String(f.name ?? ""),
            description: String(f.description ?? ""),
            imageUrl: String(f.imageUrl ?? ""),
            pageUrl: String(f.pageUrl ?? ""),
          };
          if (alive) setGame(loaded);
        } else {
          if (alive) setError("Objet introuvable ou sans contenu");
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [client, id]);

  const gameId = id
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await client.queryEvents({
        query: { MoveEventType: `${packageId}::asset::AssetCreated` },
      });

      const ids = data.map((e) => (e.parsedJson as AssetCreatedEvent).asset_id);

      const loaded: (Asset | null)[] = await Promise.all(
        ids.map(async (id) => {
          const res = await client.getObject({ id, options: { showContent: true } });
          const fields = (res.data?.content as any).fields;
          return fields.gameId === gameId
            ? {
              id,
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
        })
      );

      if (alive) setAssets(loaded.filter(g => g != null));
    })()
      .catch(console.error)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [client, packageId, account]);

  // liste à afficher = assets locaux
  const allItems = assets;

  // Raretés présentes dans les assets (sert au <select>)
  const availableRarities = useMemo(() => {
    const present = new Set<Rarity>();
    for (const a of allItems) present.add(getRarity(a));
    return rarityOrder.filter((r) => present.has(r));
  }, [allItems]);

  // Si la rareté choisie n'est plus disponible (ex: filtrage dynamique), on revient à "all"
  useEffect(() => {
    if (rarityFilter !== "all" && !availableRarities.includes(rarityFilter)) {
      setRarityFilter("all");
    }
  }, [availableRarities, rarityFilter]);

  const filtered = useMemo(() => {
    let list = allItems;
    if (rarityFilter !== "all") list = list.filter((i) => getRarity(i) === rarityFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allItems, rarityFilter, query, sort]);

  const categorized = useMemo(() => {
    const map = {} as Record<Rarity, Asset[]>;
    for (const r of rarityOrder) map[r] = allItems.filter((i) => getRarity(i) === r);
    return map;
  }, [allItems]);

  const showUnifiedGrid = rarityFilter !== "all" || query.trim() || sort !== "popular";

  // handler exigé par AddAssetModal
  const handleCreated = (a: Asset) => {
    setAssets((prev) => [a, ...prev]);
    setShowAdd(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!game) return <div className="p-6">Introuvable</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-800">
      {/* HERO */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="h-76 md:h-76 w-full overflow-hidden">
            <img src={game.imageUrl || PLACEHOLDER_IMG} alt="cover" className="w-full h-full object-cover blur-sm scale-105 opacity-70" />
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-3 pt-12 md:pt-16 pb-6 md:pb-8">
            <BackButton onClick={() => router.push(`/user/${id}`)} />
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight text-center">
              {game.name}
            </h1>
            {(game.description || game.pageUrl) && (
              <div className="w-full max-w-3xl text-center mt-2 md:mt-3 space-y-3">
                {game.description && (
                  <p className="text-sm md:text-base text-zinc-700 whitespace-pre-line">{game.description}</p>
                )}
                {game.pageUrl && (
                  <a
                    href={game.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-300 bg-white/80 hover:bg-white text-sm font-medium shadow-sm"
                  >
                    Visiter la page du jeu
                  </a>
                )}
              </div>
            )}
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden border border-white/60 bg-white/80 backdrop-blur shadow-xl">
              <img src={game.imageUrl || PLACEHOLDER_IMG} alt={game.name} className="w-full h-76 md:h-76 object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-12">
        {/* BARRE D'OUTILS */}
        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 mb-6 backdrop-blur supports-[backdrop-filter]:bg-white/55 bg-white/80 border-b border-white/60">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
            {/* Search */}
            <div className="md:col-span-6">
              <label htmlFor="search" className="sr-only">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden />
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un objet…"
                  className="w-full h-11 pl-10 pr-3 rounded-2xl border border-zinc-300/80 bg-white/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* Rarity select (dynamique) */}
            <div className="md:col-span-3">
              <div className="relative">
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <select
                  id="rarity"
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value as any)}
                  className="appearance-none h-11 pl-3 pr-9 w-full rounded-2xl border border-zinc-300/80 bg-white/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
                >
                  <option value="all">Toutes les raretés</option>
                  {availableRarities.map((r) => (
                    <option key={r} value={r}>
                      {labelByFilter[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="md:col-span-2">
              <div className="relative">
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="appearance-none h-11 pl-3 pr-9 w-full rounded-2xl border border-zinc-300/80 bg-white/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
                >
                  <option value="popular">Populaires</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                </select>
              </div>
            </div>


          </div>
        </div>

        {/* CONTENT */}
        {(() => {
          const showUnifiedGrid = rarityFilter !== "all" || query.trim() || sort !== "popular";
          if (showUnifiedGrid) {
            return filtered.length === 0 ? (
              <div className="p-6 md:p-8 bg-white/70 rounded-2xl border border-dashed text-zinc-600 backdrop-blur">
                Aucun résultat. Essayez un autre terme ou filtre.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-zinc-600">
                    {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {/* Carte d'ajout en tête de grille */}
                  <AddCard onClick={() => setShowAdd(true)} />
                  {filtered.map((s) => (
                    <SkinCard key={s.id} item={s} onClick={() => { }} />
                  ))}
                </div>
              </>
            );
          }
          return (
            <div className="space-y-10">
              {rarityOrder.map((r) =>
                categorized[r].length > 0 ? (
                  <section key={r}>
                    <div className="flex items-center justify-between">
                      <SectionHeader title={labelByFilter[r]} gradientClass={headerGradient[r]} />
                      <span className="text-sm text-zinc-600">{categorized[r].length} item{categorized[r].length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                      {/* Carte d'ajout en tête de chaque section */}
                      <AddCard onClick={() => setShowAdd(true)} />
                      {categorized[r].map((s) => (
                        <SkinCard key={s.id} item={s} onClick={() => { }} />
                      ))}
                    </div>
                  </section>
                ) : null
              )}
            </div>
          );
        })()}

        {/* Carte d’ajout en bas (fallback) */}
        <div className="mt-10">
          <AddCard onClick={() => setShowAdd(true)} />
        </div>

        {/* MODAL d’ajout (conservé depuis la 2e page) */}
        <AddAssetModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false)
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}
