"use client";
import { useState } from "react";
import { Menu, X, Home, Gamepad2, Settings } from "lucide-react";

const items = [
  { id: "home", label: "Accueil", href: "/", Icon: Home },
  { id: "games", label: "Jeux", href: "#", Icon: Gamepad2 },
  { id: "settings", label: "Paramètres", href: "#", Icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Rail étroit TOUJOURS présent. On n'a qu'un seul aside qui **s'élargit**.
          Pas de duplication des icônes, donc aucune téléportation. */}
      <aside
        className={
          `fixed top-[64px] md:top-[68px] left-0 bottom-0 z-50 bg-zinc-900 text-white border-r border-zinc-800
           flex flex-col transition-[width] duration-300 ease-out ${open ? "w-64" : "w-16"}`
        }
        aria-label="Barre latérale"
      >
        {/* Header de la sidebar */}
        <div className="h-16 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Titre qui apparaît sans pop brutal */}
          <div
            className={
              `ml-2 overflow-hidden transition-all duration-200 ${open ? "opacity-100" : "opacity-0"}`
            }
          >
            <span className="font-bold text-lg select-none">Menu</span>
          </div>
        </div>

        {/* Nav: mêmes éléments pour états ouvert/fermé. Les labels s'élargissent en douceur. */}
        <nav className="flex-1 py-4 space-y-1">
          {items.map(({ id, href, Icon, label }) => (
            <a
              key={id}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              <Icon className="h-5 w-5 shrink-0" />

              {/* Conteneur label: on anime largeur max + opacité + légère translation */}
              <span
                className={
                  `whitespace-nowrap overflow-hidden select-none
                   transition-[max-width,opacity,transform] duration-300 ease-out
                   ${open ? "max-w-[180px] opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-1"}`
                }
              >
                {label}
              </span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay visuel non bloquant (purement décoratif) */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}
