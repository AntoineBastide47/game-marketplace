import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Types
export type Rarity = "common" | "rare" | "legendary";

interface Game {
  id: number;
  name: string;
}

interface GameItem {
  id: number;
  name: string;
  image: string; // could be an emoji or URL
  description: string;
  rarity: Rarity;
  price: number; // in EUR for now
}

interface GamePageProps {
  game: Game;
  onBack: () => void;
}

// Utilities
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

// Example data (you'll likely fetch these later)
const legendaryAndRare: GameItem[] = [
  { id: 1, name: "Dragon Blade", image: "🗡️", description: "Une épée légendaire forgée par les dragons", rarity: "legendary", price: 150 },
  { id: 2, name: "Forest Bow", image: "🏹", description: "Arc elfique des forêts anciennes", rarity: "rare", price: 89 },
  { id: 3, name: "Fire Staff", image: "🔥", description: "Bâton magique aux flammes éternelles", rarity: "legendary", price: 200 },
  { id: 4, name: "Ice Shield", image: "🛡️", description: "Bouclier de glace impénétrable", rarity: "rare", price: 95 },
  { id: 5, name: "Thunder Hammer", image: "⚡", description: "Marteau électrifié des tempêtes", rarity: "legendary", price: 175 },
  { id: 6, name: "Shadow Dagger", image: "🗡️", description: "Dague furtive des assassins", rarity: "rare", price: 67 },
  { id: 7, name: "Crystal Orb", image: "🔮", description: "Orbe mystique aux pouvoirs anciens", rarity: "legendary", price: 220 },
];

const commons: GameItem[] = [
  { id: 8, name: "Basic Sword", image: "⚔️", description: "Épée standard pour débutants", rarity: "common", price: 25 },
  { id: 9, name: "Wooden Bow", image: "🏹", description: "Arc en bois simple mais efficace", rarity: "common", price: 20 },
  { id: 10, name: "Iron Shield", image: "🛡️", description: "Bouclier en fer robuste", rarity: "common", price: 30 },
  { id: 11, name: "Stone Axe", image: "🪓", description: "Hache en pierre primitive", rarity: "common", price: 22 },
  { id: 12, name: "Leather Armor", image: "🦺", description: "Armure en cuir basique", rarity: "common", price: 35 },
  { id: 13, name: "Cloth Robe", image: "👘", description: "Robe en tissu pour mages", rarity: "common", price: 28 },
  { id: 14, name: "Basic Helmet", image: "⛑️", description: "Casque de protection standard", rarity: "common", price: 18 },
];

// Reusable components
const Badge: React.FC<{ rarity: Rarity; className?: string }> = ({ rarity, className = "" }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-bold ${rarityBadgeClass[rarity]} ${className}`}
  >
    {rarity.toUpperCase()}
  </span>
);

const SectionHeader: React.FC<{ title: string; gradientFrom: string; gradientTo: string }>
  = ({ title, gradientFrom, gradientTo }) => (
  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
    <span className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} w-1 h-8 rounded mr-4`}></span>
    {title}
  </h2>
);

// Card
const SkinCard: React.FC<{
  item: GameItem;
  onSelect: (item: GameItem) => void;
}> = React.memo(({ item, onSelect }) => {
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(item);
      }
    },
    [item, onSelect]
  );

  return (
    <button
      type="button"
      aria-label={`Voir ${item.name}`}
      onClick={() => onSelect(item)}
      onKeyDown={handleKey}
      className={`relative group text-left cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-xl`}
    >
      <div className={`bg-gradient-to-br ${rarityBgGradient[item.rarity]} p-4 rounded-xl shadow-lg group-hover:shadow-2xl`}> 
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 h-32 flex items-center justify-center border border-gray-200">
          <span className="text-4xl" aria-hidden>
            {item.image}
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-white font-bold text-sm truncate" title={item.name}>{item.name}</h3>
          <p className="text-white/90 text-xs mt-1">{formatPrice(item.price)}</p>
        </div>
        <div className="absolute top-2 right-2">
          <Badge rarity={item.rarity} />
        </div>
      </div>
    </button>
  );
});

// Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  titleId?: string;
}> = ({ isOpen, onClose, children, titleId = "modal-title" }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // focus trap minimal
    firstFocusable.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onMouseDown={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {children}
        <div className="sr-only" id={titleId}></div>
        <button ref={firstFocusable} className="sr-only" onClick={() => {}} aria-hidden />
      </div>
    </div>
  );
};

// Main component
const GamePage: React.FC<GamePageProps> = ({ game, onBack }) => {
  const [selected, setSelected] = useState<GameItem | null>(null);
  const [query, setQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [sort, setSort] = useState<"popular" | "priceAsc" | "priceDesc">("popular");

  // Combine data
  const allItems = useMemo(() => [...legendaryAndRare, ...commons], []);

  // Derived lists
  const filtered = useMemo(() => {
    let list = allItems;
    if (rarityFilter !== "all") list = list.filter(i => i.rarity === rarityFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allItems, rarityFilter, query, sort]);

  const categorized = useMemo(() => ({
    legendary: allItems.filter(i => i.rarity === "legendary"),
    rare: allItems.filter(i => i.rarity === "rare"),
    common: allItems.filter(i => i.rarity === "common"),
  }), [allItems]);

  const onSelect = useCallback((item: GameItem) => setSelected(item), []);
  const onClose = useCallback(() => setSelected(null), []);

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
            {game?.name ?? "Game Marketplace"}
          </h1>
        </div>

        <p className="text-base md:text-lg text-gray-700 mb-6">
          Découvrez les meilleurs skins et objets pour vos jeux favoris.
        </p>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-10">
          <div className="flex-1">
            <label className="sr-only" htmlFor="search">Rechercher</label>
            <input
              id="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un objet..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "common", "rare", "legendary"] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRarityFilter(r)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  rarityFilter === r
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/80 text-gray-800 border-gray-300 hover:bg-white"
                }`}
                aria-pressed={rarityFilter === r}
              >
                {r === "all" ? "Tous" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <div>
            <label className="sr-only" htmlFor="sort">Trier</label>
            <select
              id="sort"
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Populaires</option>
              <option value="priceAsc">Prix: croissant</option>
              <option value="priceDesc">Prix: décroissant</option>
            </select>
          </div>
        </div>

        {/* If filters active, show unified grid */}
        {(rarityFilter !== "all" || query.trim() || sort !== "popular") ? (
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Résultats</h2>
            {filtered.length === 0 ? (
              <div className="p-6 bg-white/70 rounded-xl border border-dashed text-gray-600">
                Aucun résultat. Essayez un autre terme ou filtre.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {filtered.map(item => (
                  <SkinCard key={item.id} item={item} onSelect={onSelect} />
                ))}
              </div>
            )}
          </section>
        ) : (
          // Default categorized view
          <div className="space-y-12">
            <section>
              <SectionHeader title="Skins Légendaires" gradientFrom="yellow-400" gradientTo="orange-500" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.legendary.map(s => (
                  <SkinCard key={s.id} item={s} onSelect={onSelect} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Skins Communs" gradientFrom="gray-400" gradientTo="gray-600" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.common.map(s => (
                  <SkinCard key={s.id} item={s} onSelect={onSelect} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Skins Rares" gradientFrom="blue-400" gradientTo="purple-600" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categorized.rare.map(s => (
                  <SkinCard key={s.id} item={s} onSelect={onSelect} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={!!selected} onClose={onClose}>
        {selected && (
          <div className="text-center">
            <span className="text-6xl block mb-4" aria-hidden>
              {selected.image}
            </span>
            <h3 id="modal-title" className="text-2xl font-bold mb-2">{selected.name}</h3>
            <p className="text-gray-600 mb-4">{selected.description}</p>
            <div className="flex justify-center items-center gap-3 mb-6">
              <Badge rarity={selected.rarity} />
              <span className="text-2xl font-bold text-green-600">{formatPrice(selected.price)}</span>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200">
                Acheter maintenant
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GamePage;
