import React from "react";

export default function Overview() {
  const categories = [
    { title: "Jeux populaires" },
    { title: "RPG" },
    { title: "Open world" },
  ];

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-300 p-2 mb-6">
        {/* Texte */}
        <span className="font-bold text-lg text-black">GAME-MARKETPLACE</span>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Search for a game"
          className="flex-1 mx-4 px-3 py-2 rounded border border-gray-400 text-black placeholder-gray-500"
        />

        {/* Bouton Search flashy */}
        <button className="px-4 py-2 rounded bg-pink-600 text-white font-bold hover:bg-pink-700 transition">
          Search
        </button>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.title} className="mb-8">
          <h2 className="font-bold text-lg mb-2 text-black">{category.title}</h2>
          <div className="flex overflow-x-auto space-x-4 p-3 rounded">
            {Array.from({ length: 8 }).map((_, idx) => (
              <button
                key={idx}
                className="flex-shrink-0 w-24 h-24 bg-gray-200 border border-gray-400 rounded flex items-center justify-center hover:bg-gray-300 active:bg-gray-400 transition"
              >
                <span className="text-sm text-gray-600">Image</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

