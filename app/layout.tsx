import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

// Utilise l'API Metadata du App Router
export const metadata: Metadata = {
  title: "Sui dApp Starter",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full"> 
      <body
        className="
          h-full min-h-screen 
          bg-white text-black 
          overflow-x-hidden
          antialiased
        "
      >
        <Providers>
          {/* Si Navbar a des bordures/ombres noires, nettoie-le aussi */}
          <Navbar />
          {/* Pas de wrapper avec width fixe: laisse les pages gérer leur layout */}
          {children}
        </Providers>
      </body>
    </html>
  );
}