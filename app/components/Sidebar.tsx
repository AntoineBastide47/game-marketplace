"use client";
import { useState } from "react";
import { Menu, X, Home, Gamepad2 } from "lucide-react";

const items = [
  { id: "home", label: "Home", href: "/", Icon: Home },
  { id: "games", label: "My Games", href: "#", Icon: Gamepad2 },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // Largeur de la colonne label animée en CSS. 0rem fermé, 12rem ouvert.
  const labelCol = open ? "12rem" : "0rem";
  const asideW = open ? "16rem" : "4rem"; // w-64 vs w-16

  return (
    <>
      <aside
        className="fixed top-[64px] md:top-[68px] left-0 bottom-0 z-40 bg-zinc-900 text-white border-r border-zinc-800 transition-[width] duration-300 ease-out contain-layout"
        style={{ width: asideW }}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center w-full border-b border-zinc-800 ${
            open ? "justify-between px-3" : "justify-start pl-3"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {open && <span className="font-bold text-lg">Menu</span>}
        </div>

        {/* Navigation: grille 2 colonnes. Colonne 1 = icône (4rem). Colonne 2 = label (animée). */}
        <nav
          className="flex-1 py-4 w-full transition-[grid-template-columns] duration-300 ease-out"
          style={{ display: "grid", gridTemplateColumns: `4rem ${labelCol}` }}
        >
          {/* Colonne icônes */}
          <ul className="flex flex-col items-center gap-2">
            {items.map(({ id, href, Icon }) => (
              <li key={id} className="w-16">
                <a
                  href={href}
                  className="flex h-10 items-center justify-center rounded-md text-zinc-200 hover:bg-zinc-800 transition-colors"
                  aria-label={id}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>

          {/* Colonne labels */}
          <ul className="flex flex-col gap-2 pr-3 overflow-hidden">
            {items.map(({ id, href, label }) => (
              <li key={`label-${id}`} className="h-10">
                <a
                  href={href}
                  tabIndex={open ? 0 : -1}
                  className="flex h-10 items-center rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800 px-3
                             whitespace-nowrap overflow-hidden text-ellipsis
                             transition-[opacity,transform] duration-300 ease-out transform-gpu"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: `translateX(${open ? "0px" : "-6px"})`,
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay qui BLOQUE les clics quand open, et ferme au clic */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden
      />
    </>
  );
}