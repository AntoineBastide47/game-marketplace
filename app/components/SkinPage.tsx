'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Wallet } from 'lucide-react';

// Définition du type Skin
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
    availability?: 'available' | 'unavailable' | 'coming_soon';
    discountPercentage?: number;
};

// Skin par défaut pour l'affichage initial
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
    availability: 'available',
    discountPercentage: 20
};

// Props pour le composant SkinPage
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
    const [isWalletConnected, setIsWalletConnected] = useState(false);

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

    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Image du skin - Côté gauche (POSITION FIXE) */}
                    <div className="lg:sticky lg:top-24 lg:self-start lg:w-1/2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 relative flex items-center justify-center">

                                {/* Affichage de l'image si disponible, sinon placeholder */}
                                {skin.imageUrl ? (
                                    <img
                                        src={skin.imageUrl}
                                        alt={skin.name}
                                        className="w-80 h-80 object-contain transform transition-transform hover:scale-105 duration-300"
                                    />
                                ) : (
                                    <div className="w-80 h-80 bg-white/10 rounded-lg border-2 border-white/20 flex flex-col items-center justify-center transform transition-transform hover:scale-105 duration-300">
                                        <div className="w-36 h-36 bg-white/20 rounded-full mb-4 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-28 h-28 bg-white/30 rounded-full flex items-center justify-center shadow-inner">
                                                <div className="text-white text-xl font-bold tracking-wider">{skin.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-white/90 text-center">
                                            <p className="text-sm mb-2 uppercase tracking-wider font-medium">Skin Fortnite</p>
                                            <p className="text-xs opacity-70">Image du personnage {skin.name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Badge de rareté */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                                    <Star size={14} fill="currentColor" />
                                    {skin.rarity}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations du skin - Côté droit */}
                    <div className="space-y-6 lg:w-1/2">
                        
                        {/* Nom du skin */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{skin.name}</h1>
                                <button
                                    onClick={toggleWishlist}
                                    className={`rounded-full p-2 transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                </button>
                            </div>
                            <p className="text-gray-600">{skin.description}</p>
                        </div>

                        {/* Prix avec badge animé */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
                            <div className="flex items-baseline gap-3 mb-2 relative z-10">
                                <span className="text-3xl font-bold text-gray-800">{formatPrice(skin.price)}€</span>
                                {skin.originalPrice && (
                                    <>
                                        <span className="text-lg text-gray-500 line-through">{formatPrice(skin.originalPrice)}€</span>
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                            -{skin.discountPercentage || Math.round(((skin.originalPrice - skin.price) / skin.originalPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 relative z-10">TVA incluse</p>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-tl from-orange-100 to-transparent rounded-full opacity-50"></div>
                        </div>

                        {/* Bouton Achat */}
                        {isWalletConnected ? (
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
                                <div className="absolute inset-0 w-6 h-full bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-1000%] transition-transform duration-1000 ease-in-out"></div>
                            </button>
                        ) : (
                            <button
                                onClick={handlePurchase}
                                className="group w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-4 transform group-hover:translate-y-0 group-hover:scale-105 transition-all duration-300 z-10">
                                    <Wallet
                                        size={28}
                                        className="transform group-hover:rotate-12 transition-transform duration-300"
                                    />
                                    <span className="text-xl font-semibold group-hover:tracking-wider transition-all duration-300">
                                        Connect your wallet
                                    </span>
                                </div>
                                <div className="absolute inset-0 w-6 h-full bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-1000%] transition-transform duration-1000 ease-in-out"></div>
                            </button>
                        )}

                        {/* Informations supplémentaires */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <span className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full inline-block"></span>
    Détails du skin
  </h3>
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Rareté :</span>
      <span className="font-medium text-purple-700">{skin.rarity}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Série :</span>
      <span className="font-medium text-blue-700">{skin.series || "-"}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Première apparition :</span>
      <span className="font-medium text-gray-700">{skin.firstAppearance || "-"}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Description :</span>
      <span className="font-medium text-gray-700">{skin.description}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Disponibilité :</span>
      {skin.availability === 'available' ? (
        <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Disponible maintenant
        </span>
      ) : skin.availability === 'coming_soon' ? (
        <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Bientôt disponible
        </span>
      ) : (
        <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Non disponible
        </span>
      )}
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Prix actuel :</span>
      <span className="font-bold text-gray-800">{formatPrice(skin.price)}€</span>
    </div>
    {skin.originalPrice && (
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Prix d'origine :</span>
        <span className="text-gray-500 line-through">{formatPrice(skin.originalPrice)}€</span>
      </div>
    )}
    {skin.discountPercentage && (
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Réduction :</span>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          -{skin.discountPercentage}%
        </span>
      </div>
    )}
  </div>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkinPage;
