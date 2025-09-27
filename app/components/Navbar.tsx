"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { Search, Wallet } from "lucide-react";

// Header FIXE translucide, reste en haut au scroll
// Layout: gauche (logo+nom, shrink-0) / centre (recherche, flex-1) / droite (wallet, largeur fixe)
// Un spacer est rendu sous le header pour ne pas recouvrir le contenu

export default function Navbar() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
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
                  autoComplete="off"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore
                  className="h-10 md:h-11 w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              </form>
            </div>

            {/* Droite: Wallet largeur fixe */}
            <div className="w-48 md:w-56 shrink-0">
              <button
                className="group w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-4 transform group-hover:translate-y-0 group-hover:scale-105 transition-all duration-300 z-10">
                  <Wallet
                    size={20}
                    className="transform group-hover:rotate-12 transition-transform duration-300"
                  />
                  <span className="text-l font-semibold group-hover:tracking-wider transition-all duration-300">
                    Connect your wallet
                  </span>
                </div>

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 w-6 h-full bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-1000%] transition-transform duration-1000 ease-in-out"></div>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer pour compenser la hauteur du header fixe */}
      <div aria-hidden className="h-[64px] md:h-[68px]"></div>
    </>
  );
}