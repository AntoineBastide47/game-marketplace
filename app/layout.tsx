import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
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
          flex flex-col
          bg-white text-black
          overflow-x-hidden
          antialiased
        "
      >
        <Providers>
          <Navbar />
          <div className="flex flex-1 w-full">
            {/* Sidebar fixe à gauche */}
            <Sidebar />
            {/* Contenu principal décalé et compensé par la navbar fixe */}
            <main className="flex-1 ml-16 pt-[64px] md:pt-[68px]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}