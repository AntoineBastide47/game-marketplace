export type Rarity =
  | "common"        // banal
  | "uncommon"      // un peu moins banal
  | "rare"          // ça commence à valoir le coup
  | "epic"          // pas tous les jours qu’on en croise
  | "legendary"     // objets de légende
  | "mythic"        // au-delà de la légende
  | "exotic"        // étrange et difficile à obtenir
  | "ancient"       // vestiges d’un autre temps
  | "divine"        // quasi sacré
  | "transcendent"; // carrément hors du monde connu



export interface MetaData {
  name: string;
  value: string;
}

export interface AssetMetaData {
  name: string;
  value: string;
  renderingMetaData: MetaData[];
}

export interface Asset {
  id: string;             // correspond à UID dans Move
  name: string;
  description: string;
  count: number;          // u64 → number
  price: number;          // u64 → number (EUR ou token, à clarifier)
  gameId: string;         // ID Move → string
  gameOwner: string;      // address Move → string (hex)
  metaData: AssetMetaData[];
}