// app/types/game.ts
export type Rarity = "common" | "rare" | "legendary";

export interface Game {
  id: number;
  name: string;
  description: string;
  coverImage: string;   // URL d’image
  bannerImage?: string;
  genres?: string[];
  releaseYear?: number;
  developer?: string;
  rating?: number;      // 0..5
  gameLink?: string;  // URL vers le jeu
}

