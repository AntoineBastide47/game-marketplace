'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { FancyConnectButton } from './Navbar';

export type Skin = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rarity: string;
  description: string;
  imageUrl?: string;
  series?: string;
  firstAppearance?: string;
  gameName?: string;
  availability?: 'available' | 'unavailable' | 'coming_soon';
  discountPercentage?: number;
};

const DEFAULT_SKIN: Skin = {
  id: 'raven-1',
  name: 'Raven',
  price: 15.99,
  originalPrice: 19.99,
  rarity: 'Légendaire',
  description: 'Un personnage mystérieux aux ailes sombres.',
  imageUrl: '/images/raven.png',
  series: 'Nevermore',
  firstAppearance: 'Saison 3',
  gameName: 'Fortnite',
  availability: 'available',
  discountPercentage: 20
};

const rarityColors: Record<string, string> = {
  'Légendaire': 'bg-yellow-50 text-yellow-700 border-yellow-300',
  'Epique': 'bg-purple-50 text-purple-700 border-purple-300',
  'Rare': 'bg-blue-50 text-blue-700 border-blue-300',
};

type SkinPageProps = {
  skin?: Skin;
  onPurchase?: (skinId: string) => void;
  onWishlistToggle?: (skinId: string, isWishlisted: boolean) => void;
};

const SkinPage = ({
  skin = DEFAULT_SKIN,
  onPurchase = (id) => alert(`Achat de "${id}" pour ${skin.price}€`),
  onWishlistToggle
}: SkinPageProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handlePurchase = () => {
    onPurchase(skin.id);
  };

  const toggleWishlist = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    if (onWishlistToggle) {
      onWishlistToggle(skin.id, newWishlistState);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Image du skin - Côté gauche */}
          <div className="lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 rounded-xl shadow-inner p-8 min-h-[600px]">
            <div className="relative flex flex-col items-center justify-center w-full">
              {skin.imageUrl ? (
                <img
                  src={skin.imageUrl}
                  alt={skin.name}
                  className="w-72 h-72 object-contain drop-shadow-2xl hover:scale-105 transition duration-300 bg-white/10 rounded-lg"
                />
              ) : (
                <div className="w-72 h-72 bg-purple-600/40 rounded-lg flex flex-col items-center justify-center shadow-xl">
                  <div className="w-28 h-28 bg-purple-400/40 rounded-full mb-4 flex items-center justify-center">
                    <div className="text-white text-xl font-semibold">{skin.name}</div>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Bloc droit principal avec détails et checkout */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">

              {/* Titre et bouton favoris, inclut nom du jeu */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{skin.name}</h1>
                  {skin.series && (
                    <span className="text-sm font-medium text-blue-500">{skin.series}</span>
                  )}
                  {skin.gameName && (
                    <div className="mt-1 text-sm text-gray-500 font-normal">{skin.gameName}</div>
                  )}
                </div>
                <button
                  onClick={toggleWishlist}
                  className={`rounded-md p-2 transition-colors ${isWishlisted ? 'bg-red-100 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              <p className="text-gray-500 text-base mb-4">{skin.description}</p>

              {/* Prix et checkout, tout compact */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(skin.price)}€</span>
                {skin.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(skin.originalPrice)}€</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold ml-1">
                      -{skin.discountPercentage || Math.round(((skin.originalPrice - skin.price) / skin.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Bloc bouton achat, peu arrondi */}
              <div className="mb-3">
                {useCurrentAccount() ? (
                  // Bouton "Acheter maintenant" (orange) - exactement le même que vous aviez déjà
                  <button
                    onClick={handlePurchase}
                    className="group w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-300 to-orange-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-4 transform group-hover:translate-y-0 group-hover:scale-105 transition-all duration-300 z-10">
                      <ShoppingCart
                        size={28}
                        className="transform group-hover:rotate-12 transition-transform duration-300"
                      />
                      <span className="text-xl font-semibold group-hover:tracking-wider transition-all duration-300">
                        Acheter maintenant
                      </span>
                    </div>

                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 w-6 h-full bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-1000%] transition-transform duration-1000 ease-in-out"></div>
                  </button>
                ) : (<FancyConnectButton />)}
              </div>
            </div>

            {/* Bloc infos secondaires, format fiche, peu arrondi */}
            <div className="bg-gray-50 rounded-md border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-lg">Détails du skin</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Star size={13} className="text-orange-400" />
                    Rareté :
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">{skin.rarity}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Première apparition :</span>
                  <span className="font-semibold text-gray-700">{skin.firstAppearance || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Description :</span>
                  <span className="text-gray-600 max-w-xs text-right text-sm">{skin.description}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Compatibilité :</span>
                  <span className="text-gray-700">Tous modes de jeu</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Accessoires inclus :</span>
                  <span className="text-gray-700 max-w-xs text-right text-sm">Emote "Nevermore", Sac à dos Raven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bouton retour, arrondi faible */}
      <button
        className="fixed left-12 bottom-8 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-md border border-gray-700 transition duration-200"
        onClick={() => router.back()}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Game</span>
      </button>

    </div>
  );
};

export default SkinPage;
