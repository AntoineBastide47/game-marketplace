"use client";
import { useState } from "react";
import { Menu, X, Home, Gamepad2, Settings } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Rail étroit toujours visible (pousse le contenu) */}
      <aside className="fixed top-[64px] md:top-[68px] left-0 bottom-0 z-20 w-16 bg-zinc-900 text-white flex flex-col items-center py-4 space-y-6 border-r border-zinc-800">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="flex flex-col items-center gap-6 mt-4">
          <a href="/" className="p-2 rounded-md hover:bg-zinc-800">
            <Home className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-zinc-800">
            <Gamepad2 className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-zinc-800">
            <Settings className="h-5 w-5" />
          </a>
        </nav>
      </aside>

      {/* Overlay visuel mais non bloquant */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none" />
      )}

      {/* Sidebar élargie en overlay cliquable */}
      <aside
        className={`fixed top-[64px] md:top-[68px] left-0 bottom-0 z-50 bg-zinc-900 text-white w-64 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
          <span className="font-bold text-lg">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <Home className="h-5 w-5" />
            <span>Accueil</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <Gamepad2 className="h-5 w-5" />
            <span>Jeux</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres</span>
          </a>
        </nav>
      </aside>
    </>
  );
}