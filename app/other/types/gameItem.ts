import type { Rarity } from "./game";

export interface GameItem {
  id: number;
  name: string;
  image: string;         // emoji ou URL d’image
  description: string;
  rarity: Rarity;
  price: number;         // EUR
}