'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Wallet, Calendar, Trophy, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/networkConfig";



import { SuiClient } from '@mysten/sui/client';
import { FancyConnectButton } from '@/other/components/Navbar';
import { Asset } from '@/other/types/asset';

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
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
  series: 'Nevermore',
  firstAppearance: 'Saison 3',
  gameName: 'Fortnite',
  availability: 'available',
  discountPercentage: 20,
};

type SkinPageProps = {
  skin?: Skin;
  onPurchase?: (skinId: string) => void;
};

const tx = new Transaction();

const buySkin = (skinId: string, packageId: string, gameId: string, suiClient: any) => async () => {
  const res = await suiClient.getObject({ skinId, options: { showContent: true } });
  tx.moveCall({
    target: `${packageId}::asset::mint_to`,
    arguments: [gameId, tx.pure.string(res), suiClient, tx.pure.u64(1)],
  });
  return '';
};

export default function SkinPage() {
  const account = useCurrentAccount();
  const router = useRouter();
  const client = useSuiClient();
  const gameId = useParams<{ id: string }>();
  const skinId = useParams<{ skin: string }>();
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const tx = new Transaction();
  const [submitting, setSubmitting] = React.useState(false);
  const [asset, setAsset] = useState<Asset | null>(null)
  const assetId = useParams<{ skin: string }>()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (!assetId.skin) throw new Error("Paramètre id manquant");
        const id = assetId.skin
        const res = await client.getObject({ id, options: { showContent: true } });
        const content: any = res?.data?.content;
        if (content?.dataType === "moveObject" && content?.fields) {
          const fields = content.fields;
          const loaded: Asset = {
            id: assetId.skin,
            owner: fields.owner as string,
            name: fields.name,
            description: fields.description,
            imageUrl: fields.imageUrl,
            count: fields.count,
            price: fields.price,
            gameId: fields.gameId,
            gameOwner: fields.gameOwner,
            metaData: [],
            renderingMetaData: [],
          };
          if (alive) setAsset(loaded);
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
  }, [client, assetId]);

  function purchase() {
    setSubmitting(true)

    tx.moveCall({
      target: `${packageId}::asset::mint_to`,
      arguments: [
        tx.object(gameId.id),
        tx.object(skinId.skin),
        tx.pure.address(account!.address)
      ],
    } as any);

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await client.waitForTransaction({
            digest,
            options: { showEffects: true },
          })

          router.push(`/dashboard/${account?.address || ""}`) // TODO: change to dashboard
          setSubmitting(false)
        },
        onError: () => setSubmitting(false),
      }
    );
  }

  const formatPrice = (price: number) => Number(price).toFixed(2).replace('.', ',');

  if (loading || !asset) return <div className="p-6">Loading...</div>;
  const unavailable = submitting || asset.count === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="w-full max-w-[1400px] flex flex-row shadow-xl rounded-xl overflow-hidden border border-gray-200 bg-white">
        {/* Partie gauche */}
        <div className="flex-1 flex flex-col justify-center items-center py-14 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="relative w-full h-full flex-1 flex items-center justify-center">
            {asset.imageUrl ? (
              <Image
                src={asset.imageUrl}
                alt={asset.name}
                fill
                unoptimized
                className="object-contain p-6"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 rounded-xl border border-gray-200">
                <span className="text-7xl">🎮</span>
              </div>
            )}
          </div>
          <button
            className="mt-8 px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 hover:bg-blue-100 text-blue-700 font-semibold shadow transition"
            onClick={() => router.push(`/game/${gameId.id}`)}
          >
            <ArrowLeft size={22} /> Back
          </button>
        </div>

        {/* Partie droite */}
        <div className="flex-1 flex flex-col h-full px-12 py-14">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{asset.name}</h1>

              {/*
              <div className="flex gap-7 text-base text-gray-500 mb-2">
                {skin.series && (
                  <span className="flex items-center gap-2">
                    <Trophy size={18} /> {skin.series}
                  </span>
                )}
                {skin.gameName && <span>{skin.gameName}</span>}
                {asset.firstAppearance && (
                  <span className="flex items-center gap-2">
                    <Calendar size={18} /> {skin.firstAppearance}
                  </span>
                )}
              </div>
               */}

              {/* Badge de rareté retiré */}

              <p className="text-gray-700 mb-6 text-lg leading-7">{asset.description}</p>

              {/* Prix centré en ligne */}
              <div className="bg-blue-50 border border-blue-200 px-7 py-6 mb-7 flex items-center justify-center gap-6 rounded-lg shadow-sm">
                <span className="text-4xl font-extrabold text-blue-700">
                  {formatPrice(asset.price)} SUI
                </span>
                {/*
                {asset.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(asset.price)} SUI
                    </span>
                    <span className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg shadow">
                      -15%
                    </span>
                  </>
                )}
                */}
              </div>

              <div className="mb-7">
                {account ? (
                  <button
                    onClick={purchase}
                    className="group w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
                    disabled={submitting || asset.count == 0}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-300 to-orange-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-4 transform group-hover:translate-y-0 group-hover:scale-105 transition-all duration-300 z-10">
                      <ShoppingCart
                        size={28}
                        className="transform group-hover:rotate-12 transition-transform duration-300"
                      />
                      <span className="text-xl font-semibold group-hover:tracking-wider transition-all duration-300">
                        Buy Now
                      </span>
                    </div>

                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 w-6 h-full bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-1000%] transition-transform duration-1000 ease-in-out"></div>
                  </button>
                ) : (<FancyConnectButton />)}
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Carte des détails */}
              <div className="rounded-2xl shadow bg-gradient-to-r from-white via-blue-50 to-pink-50 px-7 py-6 mt-8">
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-700 mb-5">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                  Details
                </h3>

                <div className="flex flex-col gap-3 text-base">
                  {/* Rareté */}
                  <div className="flex items-center">
                    <span className="text-gray-500 w-48">Rarity:</span>
                    <span className="ml-auto px-4 py-1.5 text-sm rounded-full font-semibold bg-yellow-100 text-yellow-700 shadow-sm">
                      Legendary
                    </span>
                  </div>

                  {/* Série */}
                  <div className="flex items-center">
                    <span className="text-gray-500 w-48">Series:</span>
                    <span className="ml-auto px-4 py-1.5 text-sm rounded-full font-semibold bg-blue-100 text-blue-500 shadow-sm">
                      Nevermore
                    </span>
                  </div>

                  {/* Première apparition */}
                  <div className="flex items-center">
                    <span className="text-gray-500 w-48">First Appearance:</span>
                    <span className="ml-auto px-4 py-1.5 text-sm rounded-full font-semibold bg-gray-100 text-gray-500 shadow-sm">
                      Season 3
                    </span>
                  </div>

                  {/* Disponibilité */}
                  <div className="flex items-center">
                    <span className="text-gray-500 w-48">Availability:</span>
                    <span className="ml-auto flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-semibold bg-green-100 text-green-700 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {asset.count > 0 ? 'Now Available' : 'Unavailable'}
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
