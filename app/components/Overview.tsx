import React from "react";

export default function Overview() {
  const categories = [
    { title: "Jeux populaires" },
    { title: "RPG" },
    { title: "Open world" },
  ];

  return (
    <div className="bg-sky-100 min-h-screen p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-gray-200 p-2 rounded mb-6">
        <button className="bg-gray-300 px-3 py-1 rounded font-bold">
          Jeux/skins
        </button>
        <input
          type="text"
          placeholder="Barre de recherche"
          className="flex-1 mx-4 px-3 py-1 rounded border border-gray-400"
        />
        <button className="bg-gray-300 px-3 py-1 rounded">Log</button>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.title} className="mb-8">
          <h2 className="font-bold text-lg mb-2">{category.title}</h2>
          <div className="flex overflow-x-auto space-x-4 bg-red-200 p-3 rounded">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded"
              >
                <img
                  src=""
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
