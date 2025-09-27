// app/constants/games.ts
import type { Game } from "@/types/game";
import type { GameItem } from "@/types/gameItem";

export const games: Game[] = [
  {
    id: 1,
    name: "Elder Blades",
    description:
      "RPG heroic-fantasy où dragons rancuniers et guildes louches se disputent des artefacts pas du tout maudits.",
    coverImage: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ad?q=80&w=1600",
    genres: ["RPG", "Action", "Fantasy"],
    releaseYear: 2025,
    developer: "Moonforge Studio",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Mystic Quest",
    description:
      "Aventure magique à énigmes où chaque rune est un puzzle, et chaque porte cache une autre porte.",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600",
    genres: ["Puzzle", "Aventure"],
    releaseYear: 2024,
    developer: "Arcana Works",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Cyber Hunt",
    description:
      "Shooter futuriste en néon où on hacke des drones pendant qu’ils essaient poliment de t’éliminer.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600",
    genres: ["Shooter", "Sci-Fi"],
    releaseYear: 2026,
    developer: "Vector9",
    rating: 4.4,
  },
  {
    id: 4,
    name: "Cyber Hunt",
    description:
      "Shooter futuriste en néon où on hacke des drones pendant qu’ils essaient poliment de t’éliminer.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600",
    genres: ["Shooter", "Sci-Fi"],
    releaseYear: 2026,
    developer: "Vector9",
    rating: 4.4,
  },
];

export const gameItemsByGameId: Record<number, GameItem[]> = {
  1: [
    { id: 101, name: "Dragon Slayer", image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Épée mythique qui aboie sur les wyvernes.", rarity: "legendary", price: 250 },
    { id: 102, name: "Iron Shield",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Bouclier solide, compatible avec les fuites stratégiques.", rarity: "common", price: 30 },
    { id: 103, name: "Runic Bow",     image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Arc gravé de runes, siffle quand tu tires.", rarity: "rare", price: 95 },
    { id: 104, name: "Ember Staff",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Bâton qui chauffe les mains et les trolls.", rarity: "legendary", price: 220 },
    { id: 105, name: "Frost Dagger",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Dague glacée pour gestes froids et rapides.", rarity: "rare", price: 72 },
    { id: 106, name: "Traveler Cloak",image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Cape confortable, +2 au style.", rarity: "common", price: 18 },
    { id: 107, name: "Wyvern Helm",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Casque orné d’écaille, léger comme un mensonge.", rarity: "rare", price: 110 },
    { id: 108, name: "Crystal Orb",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Voit l’avenir. Spoiler: tu dépenses trop.", rarity: "legendary", price: 280 },
    { id: 109, name: "Oak Shield",    image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Bouclier en chêne qui sent la forêt.", rarity: "common", price: 24 },
    { id: 110, name: "Thunder Hammer",image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Marteau qui gronde quand on bâille.", rarity: "legendary", price: 260 },
  ],
  2: [
    { id: 201, name: "Crystal Wand",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Baguette translucide, cliquetis satisfaisant.", rarity: "rare", price: 90 },
    { id: 202, name: "Rune Grimoire",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Livre de sorts, pages qui se tournent toutes seules.", rarity: "rare", price: 75 },
    { id: 203, name: "Moon Amulet",    image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Amulette argentée, protège des cauchemars.", rarity: "common", price: 22 },
    { id: 204, name: "Illusion Cape",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Cape d’illusion, disparaît quand on te regarde.", rarity: "rare", price: 68 },
    { id: 205, name: "Arcane Lens",    image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Lunettes qui révèlent glyphes et cernes.", rarity: "common", price: 19 },
    { id: 206, name: "Elder Scepter",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Sceptre cérémoniel, aussi lourd que l’ego.", rarity: "legendary", price: 230 },
    { id: 207, name: "Portal Key",     image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Clé multidimensionnelle, se perd ailleurs.", rarity: "rare", price: 120 },
    { id: 208, name: "Mirror Shard",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Renvoie les sorts et ton regard gêné.", rarity: "common", price: 28 },
    { id: 209, name: "Phoenix Feather",image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Plume tiède, rallume l’espoir.", rarity: "legendary", price: 310 },
    { id: 210, name: "Golem Pebble",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Caillou de golem. Oui, un caillou.", rarity: "common", price: 7 },
  ],
  3: [
    { id: 301, name: "Cyber Blade",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Katana ionique. Coupe les connexions instables.", rarity: "legendary", price: 300 },
    { id: 302, name: "Pulse Pistol",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Pistolet à impulsions, bruit satisfaisant.", rarity: "rare", price: 105 },
    { id: 303, name: "Drone Buddy",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Petit drone qui fait bip. Et pas que.", rarity: "rare", price: 140 },
    { id: 304, name: "Neon Visor",    image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Visière filtrante, +10 synthwave.", rarity: "common", price: 26 },
    { id: 305, name: "EMP Grenade",   image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Éteint les lumières et l’ambiance.", rarity: "rare", price: 65 },
    { id: 306, name: "Nano Armor",    image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Armure adaptative. Câlins non inclus.", rarity: "legendary", price: 340 },
    { id: 307, name: "Holo Emitter",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Projette des leurres moins jugeants.", rarity: "common", price: 33 },
    { id: 308, name: "Circuit Dagger",image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Lame imprimée, tient chaud l’hiver.", rarity: "rare", price: 88 },
    { id: 309, name: "Data Cube",     image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Cube mémoire, clignote pour faire sérieux.", rarity: "common", price: 15 },
    { id: 310, name: "Quantum Core",  image: "https://i.pinimg.com/236x/9c/ea/20/9cea208ff40f65050baafeb875836d2f.jpg", description: "Cœur quantique instable. Comme le lundi.", rarity: "legendary", price: 420 },
  ],
};