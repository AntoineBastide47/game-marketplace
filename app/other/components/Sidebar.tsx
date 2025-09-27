"use client";
import { useState } from "react";
import { Menu, X, Home, Gamepad2 } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const items = [
  { id: "home", label: "Home", href: (id: string) => "/", Icon: Home },
  { id: "games", label: "My Games", href: (id: string) => `/user/${id}`, Icon: Gamepad2 },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const account = useCurrentAccount()

  const asideW = open ? "16rem" : "4rem"; // w-64 vs w-16
  const labelW = open ? "12rem" : "0rem";
  const labelPad = open ? "0.75rem" : "0"; // équiv. px-3 quand ouvert

  return (
    <>
      <aside
        className="fixed top-[64px] md:top-[68px] left-0 bottom-0 z-40 bg-zinc-900 text-white border-r border-zinc-800 transition-[width] duration-300 ease-out contain-layout overflow-hidden"
        style={{ width: asideW }}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div
          className={`h-16 pt-2 flex items-center w-full border-b border-zinc-800 ${
            open ? "justify-between px-3" : "justify-start pl-3"
          }`}
        >
          {open && <span className="font-bold text-lg select-none">Menu</span>}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation: un seul lien par ligne (icône + label) */}
        <nav className="flex-1 py-4 w-full">
          <ul className="flex flex-col gap-2">
            {items.map(({ id, href, label, Icon }) => (
              <li key={id}>
                <a
                  href={href(account?.address || "")}
                  aria-label={label}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="group grid grid-cols-[4rem_1fr] items-center h-10 rounded-md
                             text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  {/* Colonne icône */}
                  <div className="flex items-center justify-center">
                    <Icon className="h-5 w-5 transition-colors group-hover:text-white" />
                  </div>

                  {/* Colonne label: conteneur à largeur animée + overflow hidden */}
                  <div
                    className="overflow-hidden transition-[width] duration-300 ease-out"
                    style={{ width: labelW }}
                  >
                    <span
                      className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis
                                 transition-[opacity,transform] duration-300 ease-out transform-gpu block"
                      style={{
                        paddingInlineStart: labelPad,
                        opacity: open ? 1 : 0,
                        transform: `translateX(${open ? "0px" : "-6px"})`,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay qui bloque les clics quand open, et ferme au clic */}
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