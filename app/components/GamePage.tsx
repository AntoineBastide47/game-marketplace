"use client";
import React, { useMemo, useState } from "react";
import type { Game, GameItem, Rarity } from "@/types/game";
import { gameItemsByGameId } from "@/constants/game"; // ← vérifie bien le nom du fichier
import { ArrowLeft, Search, ChevronDown } from "lucide-react";

interface GamePageProps {
  game: Game;
  onBack: () => void;
  onGoToSkin: (item: GameItem) => void; // NEW: pass clicked skin
}

const formatPrice = (value: number, locale = "fr-FR", currency = "EUR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

const rarityBadgeClass: Record<Rarity, string> = {
  legendary: "bg-amber-200 text-amber-900 ring-1 ring-amber-300/60",
  rare: "bg-indigo-200 text-indigo-900 ring-1 ring-indigo-300/60",
  common: "bg-zinc-200 text-zinc-900 ring-1 ring-zinc-300/60",
};

const rarityBgGradient: Record<Rarity, string> = {
  common: "from-zinc-400 via-zinc-500 to-zinc-700",
  rare: "from-indigo-400 via-violet-500 to-fuchsia-600",
  legendary: "from-amber-400 via-orange-500 to-rose-500",
};

const Badge: React.FC<{ rarity: Rarity }> = ({ rarity }) => (
  <span
    className={`px-2 py-1 rounded-full text-[10px] tracking-wide font-extrabold uppercase ${rarityBadgeClass[rarity]}`}
  >
    {rarity}
  </span>
);

const SectionHeader: React.FC<{ title: string; gradientClass: string }> = ({
  title,
  gradientClass,
}) => (
  <div className="flex items-center mb-4 md:mb-6">
    <div
      className={`h-8 w-1 rounded bg-gradient-to-b ${gradientClass} shadow-[0_0_0_1px_rgba(255,255,255,0.4)_inset] mr-4`}
      aria-hidden
    />
    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
      {title}
    </h2>
  </div>
);

const glowBorder =
  "relative before:absolute before:inset-0 before:rounded-[14px] before:p-[1px] before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/0 before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:exclude]";

/**
 * BackButton — bouton premium avec halo dégradé, brillance, focus net et état pressé
 */
const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Revenir à l'aperçu"
      className="group relative inline-flex items-center h-11 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:translate-y-px transition-transform"
    >
      {/* Halo dégradé externe */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-70 blur-[6px] transition-opacity duration-300 group-hover:opacity-100 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.indigo.300)_0deg,transparent_90deg,theme(colors.fuchsia.300)_180deg,transparent_270deg,theme(colors.rose.300)_360deg)]"
      />

      {/* Corps en verre avec bord */}
      <span
        className="relative z-10 inline-flex items-center gap-2 h-[42px] pl-3 pr-4 rounded-[14px] bg-white/75 backdrop-blur-md border border-white/70 shadow-sm"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
        <span className="font-semibold tracking-tight">Retour</span>
      </span>

      {/* Liseré lumineux côté droit */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-24 translate-x-10 group-hover:translate-x-0 transition-transform duration-300 bg-gradient-to-l from-fuchsia-300/40 to-transparent rounded-2xl"
      />

      {/* Brillance en balayage */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_50%_at_30%_0%,#000,transparent)] -translate-x-1/2 group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-white/0 via-white/60 to-white/0"
      />
    </button>
  );
};

const SkinCard: React.FC<{ item: GameItem; onClick: (item: GameItem) => void }> =
  ({ item, onClick }) => {
    return (
      <button
        type="button"
        aria-label={`Voir ${item.name}`}
        onClick={() => onClick(item)}
        className={`group text-left cursor-pointer focus:outline-none rounded-2xl ${glowBorder} transition-transform duration-200 will-change-transform hover:-translate-y-1 active:translate-y-0`}
      >
        <div
          className={`bg-gradient-to-br ${rarityBgGradient[item.rarity]} p-[1px] rounded-2xl shadow-lg transition-shadow hover:shadow-xl`}
        >
          <div className="rounded-[14px] bg-white/80 backdrop-blur-md border border-white/60">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-[14px] grid place-items-center">
              <span className="text-5xl md:text-6xl" aria-hidden>
                {item.image}
              </span>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="font-bold text-sm md:text-[15px] text-zinc-900 truncate"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <Badge rarity={item.rarity} />
              </div>
              <p className="text-zinc-700 text-xs mt-1">
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        </div>
      </button>
    );
  };

const labelByFilter: Record<"all" | Rarity, string> = {
  all: "Tous",
  common: "Commun",
  rare: "Rare",
  legendary: "Légendaire",
};

const GamePage: React.FC<GamePageProps> = ({ game, onBack, onGoToSkin }) => {
  const [query, setQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [sort, setSort] = useState<"popular" | "priceAsc" | "priceDesc">(
    "popular"
  );

  const allItems = useMemo(() => gameItemsByGameId[game.id] ?? [], [game.id]);

  const filtered = useMemo(() => {
    let list = allItems;
    if (rarityFilter !== "all") list = list.filter((i) => i.rarity === rarityFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allItems, rarityFilter, query, sort]);

  const categorized = useMemo(
    () => ({
      legendary: allItems.filter((i) => i.rarity === "legendary"),
      rare: allItems.filter((i) => i.rarity === "rare"),
      common: allItems.filter((i) => i.rarity === "common"),
    }),
    [allItems]
  );

  const showUnifiedGrid = rarityFilter !== "all" || query.trim() || sort !== "popular";

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.20),transparent),radial-gradient(1000px_500px_at_90%_-20%,rgba(236,72,153,0.18),transparent)] from-zinc-50 via-white to-zinc-50 text-zinc-800">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Barre du haut */}
        <div className="flex flex-col items-center gap-3 mb-6 mt-6 md:mt-8">
          <BackButton onClick={onBack} />
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight text-center">
            {game.name}
          </h1>
        </div>

        {/* Hero jeu */}
        <div className="grid md:grid-cols-[320px,1fr] gap-6 items-start mb-8 md:mb-10">
          <div className="w-full h-[220px] md:h-[260px] overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xl ${glowBorder}">
            <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-zinc-700 text-base md:text-lg leading-relaxed">
              {game.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-600">
              {game.genres?.length ? (
                <span>Genres: {game.genres.join(", ")}</span>
              ) : null}
              {game.releaseYear ? (
                <span className="relative pl-4 before:content-['•'] before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:text-zinc-400">
                  Sortie: {game.releaseYear}
                </span>
              ) : null}
              {game.developer ? (
                <span className="relative pl-4 before:content-['•'] before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:text-zinc-400">
                  Dev: {game.developer}
                </span>
              ) : null}
              {typeof game.rating === "number" ? (
                <span className="relative pl-4 before:content-['•'] before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:text-zinc-400">
                  Note: {game.rating}/5
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 mb-6 backdrop-blur supports-[backdrop-filter]:bg-white/55 bg-white/80 border-b border-white/60">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1 min-w-[220px]">
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

            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 rounded-2xl bg-white/80 border border-zinc-200 backdrop-blur shadow-sm">
                {(["all", "common", "rare", "legendary"] as const).map((r) => {
                  const active = rarityFilter === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRarityFilter(r)}
                      aria-pressed={active}
                      className={`h-9 px-4 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        active
                          ? "bg-zinc-900 text-white shadow"
                          : "text-zinc-800 hover:bg-white"
                      }`}
                    >
                      {labelByFilter[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="relative">
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="appearance-none h-11 pl-3 pr-9 rounded-2xl border border-zinc-300/80 bg-white/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm font-medium"
                >
                  <option value="popular">Populaires</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grilles */}
        {showUnifiedGrid ? (
          filtered.length === 0 ? (
            <div className="p-6 md:p-8 bg-white/70 rounded-2xl border border-dashed text-zinc-600 backdrop-blur">
              Aucun résultat. Essayez un autre terme ou filtre.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {filtered.map((item) => (
                <SkinCard key={item.id} item={item} onClick={onGoToSkin} />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-10">
            <section>
              <SectionHeader title="Communs" gradientClass="from-zinc-400 to-zinc-700" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.common.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Rares" gradientClass="from-indigo-400 to-fuchsia-600" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.rare.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Légendaires" gradientClass="from-amber-400 to-rose-500" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.legendary.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Pied léger */}
        <div className="mt-10 text-center text-xs text-zinc-500">
          <span className="inline-block px-2 py-1 rounded bg-white/60 border border-white/70 backdrop-blur">{allItems.length} objets</span>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
