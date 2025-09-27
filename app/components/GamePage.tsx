import React, { useState } from 'react';

interface Game {
  id: number;
  name: string;
}

interface GameItem {
  id: number;
  name: string;
  image: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  price: number;
}

interface GamePageProps {
  game: Game; // 👈 jeu reçu depuis App
}

const GamePage: React.FC<GamePageProps> = ({ game }) => {
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  // Données d'exemple pour les skins
  const skins: GameItem[] = [
    { id: 1, name: "Dragon Blade", image: "🗡️", description: "Une épée légendaire forgée par les dragons", rarity: "legendary", price: 150 },
    { id: 2, name: "Forest Bow", image: "🏹", description: "Arc elfique des forêts anciennes", rarity: "rare", price: 89 },
    { id: 3, name: "Fire Staff", image: "🔥", description: "Bâton magique aux flammes éternelles", rarity: "legendary", price: 200 },
    { id: 4, name: "Ice Shield", image: "🛡️", description: "Bouclier de glace impénétrable", rarity: "rare", price: 95 },
    { id: 5, name: "Thunder Hammer", image: "⚡", description: "Marteau électrifié des tempêtes", rarity: "legendary", price: 175 },
    { id: 6, name: "Shadow Dagger", image: "🗡️", description: "Dague furtive des assassins", rarity: "rare", price: 67 },
    { id: 7, name: "Crystal Orb", image: "🔮", description: "Orbe mystique aux pouvoirs anciens", rarity: "legendary", price: 220 },
  ];

  const commonSkins: GameItem[] = [
    { id: 8, name: "Basic Sword", image: "⚔️", description: "Épée standard pour débutants", rarity: "common", price: 25 },
    { id: 9, name: "Wooden Bow", image: "🏹", description: "Arc en bois simple mais efficace", rarity: "common", price: 20 },
    { id: 10, name: "Iron Shield", image: "🛡️", description: "Bouclier en fer robuste", rarity: "common", price: 30 },
    { id: 11, name: "Stone Axe", image: "🪓", description: "Hache en pierre primitive", rarity: "common", price: 22 },
    { id: 12, name: "Leather Armor", image: "🦺", description: "Armure en cuir basique", rarity: "common", price: 35 },
    { id: 13, name: "Cloth Robe", image: "👘", description: "Robe en tissu pour mages", rarity: "common", price: 28 },
    { id: 14, name: "Basic Helmet", image: "⛑️", description: "Casque de protection standard", rarity: "common", price: 18 },
  ];

  const rareSkins = skins.filter(skin => skin.rarity === 'rare');
  const legendarySkins = skins.filter(skin => skin.rarity === 'legendary');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const SkinCard: React.FC<{ item: GameItem }> = ({ item }) => (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      onClick={() => setSelectedGame(item)}
    >
      <div className={`bg-gradient-to-br ${getRarityColor(item.rarity)} p-4 rounded-xl shadow-lg hover:shadow-2xl`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 h-32 flex items-center justify-center border border-gray-200">
          <span className="text-4xl">{item.image}</span>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
          <p className="text-white/80 text-xs mt-1">{item.price}€</p>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
            item.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {item.rarity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 text-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {game?.name || "Game Marketplace"}
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez les meilleurs skins et objets pour vos jeux favoris
          </p>
        </div>

        {/* Sections Skins */}
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 w-1 h-8 rounded mr-4"></span>
              Skins Légendaires
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {legendarySkins.map((skin) => (
                <SkinCard key={skin.id} item={skin} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-gray-400 to-gray-600 w-1 h-8 rounded mr-4"></span>
              Skins Communs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {commonSkins.map((skin) => (
                <SkinCard key={skin.id} item={skin} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 w-1 h-8 rounded mr-4"></span>
              Skins Rares
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {rareSkins.map((skin) => (
                <SkinCard key={skin.id} item={skin} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Modal pour les détails */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <span className="text-6xl block mb-4">{selectedGame.image}</span>
              <h3 className="text-2xl font-bold mb-2">{selectedGame.name}</h3>
              <p className="text-gray-600 mb-4">{selectedGame.description}</p>
              <div className="flex justify-center items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  selectedGame.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                  selectedGame.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {selectedGame.rarity.toUpperCase()}
                </span>
                <span className="text-2xl font-bold text-green-400">{selectedGame.price}€</span>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105">
                  Acheter maintenant
                </button>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
