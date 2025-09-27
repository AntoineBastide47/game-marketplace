"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { Search } from "lucide-react";

// Header normal (non fixe), reste en haut du flux sans suivre le scroll
// Layout: gauche (logo+nom), centre (recherche, flex-1), droite (wallet, largeur fixe)

export default function Navbar() {
  return (
    <header className="w-full bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-3 md:px-6 py-3">
        <div className="min-h-14 flex items-center gap-3 md:gap-4">
          {/* Gauche: Logo + Nom */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="https://assets.crypto.ro/logos/sui-sui-logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-full bg-white/10"
            />
            <Link
              href="/"
              className="font-semibold tracking-wide text-white text-base md:text-lg"
              aria-label="Accueil GAME-MARKETPLACE"
            >
              GAME-MARKETPLACE
            </Link>
          </div>

          {/* Centre: Recherche pleine largeur */}
          <div className="flex-1 min-w-0">
            <form action="/search" className="relative w-full" suppressHydrationWarning>
              <input
                name="q"
                type="search"
                inputMode="search"
                placeholder="Rechercher un jeu (ex. Eldoria, NovaStrike)…"
                aria-label="Rechercher un jeu"
                className="h-10 md:h-11 w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400/40"
                autoComplete="off"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            </form>
          </div>

          {/* Droite: Wallet largeur fixe */}
          <div className="w-48 md:w-56 shrink-0">
            <ConnectButton>
              <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white text-slate-900 px-3 py-2 text-sm hover:bg-white/90 transition select-none overflow-hidden">
                <span className="truncate">Connect Wallet</span>
              </div>
            </ConnectButton>
          </div>
        </div>
      </div>
    </header>
  );
}
