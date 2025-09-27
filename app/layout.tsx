import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sui dApp Starter",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body
        className="
          h-full min-h-screen w-full
          flex flex-col          /* colonne pleine hauteur */
          bg-white text-black 
          overflow-x-hidden
          antialiased
        "
      >
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">  {/* prend tout l’espace dispo */}
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}