"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Game, GameItem, Rarity } from "@/types/game";
import { gameItemsByGameId } from "@/constants/game"; // ← vérifie bien le nom du fichier

interface GamePageProps {
  game: Game;
  onBack: () => void;
  onGoToSkin: (item: GameItem) => void; // NEW: pass clicked skin
}

const formatPrice = (value: number, locale = "fr-FR", currency = "EUR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

const rarityBadgeClass: Record<Rarity, string> = {
  legendary: "bg-yellow-200 text-yellow-900",
  rare: "bg-blue-200 text-blue-900",
  common: "bg-gray-200 text-gray-900",
};

const rarityBgGradient: Record<Rarity, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
};

const Badge: React.FC<{ rarity: Rarity }> = ({ rarity }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-bold ${rarityBadgeClass[rarity]}`}
  >
    {rarity.toUpperCase()}
  </span>
);

const SectionHeader: React.FC<{ title: string; gradientClass: string }> = ({
  title,
  gradientClass,
}) => (
  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
    <span
      className={`w-1 h-8 rounded mr-4 bg-gradient-to-r ${gradientClass}`}
    />
    {title}
  </h2>
);

const SkinCard: React.FC<{ item: GameItem; onClick: (item: GameItem) => void }> =
  ({ item, onClick }) => {
    return (
      <button
        type="button"
        aria-label={`Voir ${item.name}`}
        onClick={() => onClick(item)}
        className="relative group text-left cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 focus:outline-none rounded-xl"
      >
        <div
          className={`bg-gradient-to-br ${rarityBgGradient[item.rarity]} p-4 rounded-xl shadow-lg group-hover:shadow-2xl`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 h-32 flex items-center justify-center border border-white/70">
            <span className="text-4xl" aria-hidden>
              {item.image}
            </span>
          </div>
          <div className="mt-3">
            <h3
              className="text-white font-bold text-sm truncate"
              title={item.name}
            >
              {item.name}
            </h3>
            <p className="text-white/90 text-xs mt-1">
              {formatPrice(item.price)}
            </p>
          </div>
          <div className="absolute top-2 right-2">
            <Badge rarity={item.rarity} />
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
    if (rarityFilter !== "all")
      list = list.filter((i) => i.rarity === rarityFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc")
      list = [...list].sort((a, b) => b.price - a.price);
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

  const showUnifiedGrid =
    rarityFilter !== "all" || query.trim() || sort !== "popular";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 text-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="px-3 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-lg font-medium shadow-sm transition active:translate-y-[1px]"
            aria-label="Revenir à l'aperçu"
          >
            ←
          </button>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {game.name}
          </h1>
        </div>

        {/* Hero jeu */}
        <div className="grid md:grid-cols-[320px,1fr] gap-6 items-start mb-8 md:mb-10">
          <div className="w-full h-[220px] md:h-[260px] overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <img
              src={game.coverImage}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-700 text-base md:text-lg">
              {game.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
              {game.genres?.length ? (
                <span>Genres: {game.genres.join(", ")}</span>
              ) : null}
              {game.releaseYear ? <span>• Sortie: {game.releaseYear}</span> : null}
              {game.developer ? <span>• Dev: {game.developer}</span> : null}
              {typeof game.rating === "number" ? (
                <span>• Note: {game.rating}/5</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-8">
          <div className="flex-1 min-w-[220px]">
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un objet…"
              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-white/70 border border-gray-200 backdrop-blur">
              {(["all", "common", "rare", "legendary"] as const).map((r) => {
                const active = rarityFilter === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRarityFilter(r)}
                    aria-pressed={active}
                    className={`h-9 px-4 rounded-lg text-sm font-medium transition
                      ${
                        active
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-800 hover:bg-white"
                      }`}
                  >
                    {labelByFilter[r]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="h-10 px-3 rounded-xl border border-gray-300 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Populaires</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Grilles */}
        {showUnifiedGrid ? (
          filtered.length === 0 ? (
            <div className="p-6 bg-white/70 rounded-xl border border-dashed text-gray-600">
              Aucun résultat.
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
              <SectionHeader
                title="Skins Légendaires"
                gradientClass="from-yellow-400 to-orange-500"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.legendary.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader
                title="Skins Communs"
                gradientClass="from-gray-400 to-gray-600"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.common.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader
                title="Skins Rares"
                gradientClass="from-blue-400 to-purple-600"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.rare.map((s) => (
                  <SkinCard key={s.id} item={s} onClick={onGoToSkin} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;