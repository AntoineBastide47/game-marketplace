// app/types/game.ts
export type Rarity = "common" | "rare" | "legendary";

export type Game = {
  id: string;
  owner: string;
  name: string;
  description: string;
  imageUrl: string | null;
  pageUrl: string | null;
};

