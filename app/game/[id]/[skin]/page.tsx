'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Wallet, Calendar, Trophy, ArrowLeft, Info } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";



import { SuiClient } from '@mysten/sui/client';

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

type SkinPageProps = {
  skin?: Skin;
  onPurchase?: (skinId: string) => void;
};

const tx = new Transaction();

const buySkin = (skinId: string, packageId: string, signAndExecute: any, suiClient: any) => async () => {
  const res = await suiClient.getObject({ skinId, options: { showContent: true } });
  tx.moveCall({
    
    target: `${packageId}::asset::mint_to`,
    arguments: [tx.pure.string(res), suiClient, tx.pure.u64(1)],
  });
  return ""
}


const SkinPage = ({
  skin = DEFAULT_SKIN,
  onPurchase = (id) => alert(`Achat de "${id}" pour ${skin.price}€`)
}: SkinPageProps) => {
  const account = useCurrentAccount();
  const router = useRouter();
  const client = useSuiClient();
  const { gameId } = useParams<{ id: string }>();
  const { skinId } = useParams<{ skin: string }>();

  const formatPrice = (price: number) => price.toFixed(2).replace('.', ',');

  const getRarityStyle = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'légendaire': return 'bg-yellow-300 text-yellow-900 border-yellow-500';
      case 'épique': return 'bg-purple-300 text-purple-900 border-purple-500';
      case 'rare': return 'bg-blue-300 text-blue-900 border-blue-500';
      default: return 'bg-gray-300 text-gray-900 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="w-full max-w-[1400px] flex flex-row shadow-xl rounded-xl overflow-hidden border border-gray-200 bg-white">
        {/* Partie gauche */}
        <div className="flex-1 flex flex-col justify-center items-center py-14 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="w-full flex items-center justify-center flex-1">
            {skin.imageUrl ? (
              <img src={skin.imageUrl} alt={skin.name}
                className="w-[370px] h-[370px] object-contain rounded-xl border border-gray-300 shadow-sm bg-white" />
            ) : (
              <div className="w-[370px] h-[370px] flex items-center justify-center text-gray-300 bg-gray-100 rounded-xl border border-gray-200">
                <span className="text-7xl">🎮</span>
              </div>
            )}
          </div>
          <button
            className="mt-8 px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 hover:bg-blue-100 text-blue-700 font-semibold shadow transition"
            onClick={() => router.push('/boutique')}
          >
            <ArrowLeft size={22} /> Retour à la boutique
          </button>
        </div>
        {/* Partie droite */}
        <div className="flex-1 flex flex-col h-full px-12 py-14">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{skin.name}</h1>
              <div className="flex gap-7 text-base text-gray-500 mb-2">
                {skin.series && <span className="flex items-center gap-2"><Trophy size={18} /> {skin.series}</span>}
                {skin.gameName && <span>{skin.gameName}</span>}
                {skin.firstAppearance && <span className="flex items-center gap-2"><Calendar size={18} /> {skin.firstAppearance}</span>}
              </div>
              <span className={`inline-block px-4 py-2 font-bold text-sm uppercase tracking-widest mb-5 border ${getRarityStyle(skin.rarity)} rounded-md`}>
                {skin.rarity}
              </span>
              <p className="text-gray-700 mb-6 text-lg leading-7">{skin.description}</p>
              <div className="bg-blue-50 border border-blue-200 px-7 py-6 mb-7 flex items-center gap-7 rounded-lg shadow-sm">
                <span className="text-4xl font-extrabold text-blue-700">{formatPrice(skin.price)} €</span>
                {skin.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">{formatPrice(skin.originalPrice)} €</span>
                    <span className="px-3 py-2 text-sm font-semibold bg-red-500 text-white ml-4 rounded-lg shadow">
                      -{skin.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              <div className="mb-7">
                {account ? (
                  <button
                    onClick={() => onPurchase(skin.id)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={19} onClick={buySkin(skin.id, "", "",client)}/> Acheter maintenant
                  </button>
                ) : (
                  <button
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-8 text-lg rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Wallet size={19} /> Connecte ton wallet
                  </button>
                )}
              </div>
              <hr className="my-6 border-gray-200" />
              <div className="rounded-2xl shadow bg-gradient-to-r from-white via-blue-50 to-pink-50 px-7 py-6 mt-8">
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-700 mb-5">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                  Détails du skin
                </h3>
                <div className="flex flex-col gap-3 text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-40">Rareté:</span>
                    <span className="px-3 py-1 text-sm rounded-xl font-semibold bg-yellow-100 text-yellow-700 shadow-sm">{skin.rarity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-40">Série:</span>
                    <span className="px-3 py-1 text-sm rounded-xl font-semibold bg-blue-100 text-blue-400 shadow-sm">{skin.series}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-40">Première apparition:</span>
                    <span className="px-3 py-1 text-sm rounded-xl font-semibold bg-gray-100 text-gray-400 shadow-sm">{skin.firstAppearance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-40">Disponibilité:</span>
                    <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-xl font-semibold bg-green-100 text-green-700 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      {skin.availability === 'available' ? 'Disponible maintenant' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinPage;
