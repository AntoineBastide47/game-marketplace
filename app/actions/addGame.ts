// app/actions/addGame.ts
"use server";

import { promises as fs } from "fs";
import path from "path";

type NewGameInput = {
  name?: string;
  description?: string;
  coverImage?: string;
  gameLink?: string;
};

const GAMES_FILE = path.join(process.cwd(), "app", "constants", "games.ts");

// check URL minimaliste: https://...
function isUrl(s: string) {
  return /^https?:\/\/.+/i.test(s);
}

export async function addGameAction(input: NewGameInput) {
  const name = String(input?.name ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const coverImage = String(input?.coverImage ?? "").trim();
  const gameLink = String(input?.gameLink ?? "").trim();

  if (!name) throw new Error("Le nom est requis");
  if (!description) throw new Error("La description est requise");
  if (coverImage && !isUrl(coverImage)) throw new Error("Cover image doit être une URL valide");
  if (gameLink && !isUrl(gameLink)) throw new Error("Game link doit être une URL valide");

  let source = await fs.readFile(GAMES_FILE, "utf8");

  // Récupérer le tableau games tel que défini dans ton fichier
  const gamesArrayRegex = /export\s+const\s+games\s*:\s*Game\[\]\s*=\s*(\[[\s\S]*?\]);/m;
  const match = source.match(gamesArrayRegex);
  if (!match) throw new Error("Impossible de trouver le tableau 'games' dans games.ts");

  const arrayText = match[1];
  const parseArray = new Function(`return (${arrayText})`);
  const games = parseArray();

  if (!Array.isArray(games)) throw new Error("Le contenu de 'games' n'est pas un tableau");

  // Id suivant
  const maxId = games.reduce((m: number, g: any) => Math.max(m, Number(g?.id) || 0), 0);
  const newId = maxId + 1;

  const entry: any = {
    id: newId,
    name,
    description,
    ...(coverImage ? { coverImage } : {}),
    ...(gameLink ? { gameLink } : {}),
  };

  const updated = [...games, entry];

  const prettyArray = JSON.stringify(updated, null, 2);
  const newSource = source.replace(
    gamesArrayRegex,
    `export const games: Game[] = ${prettyArray};`
  );

  await fs.writeFile(GAMES_FILE, newSource, "utf8");

  return { ok: true, id: newId };
}