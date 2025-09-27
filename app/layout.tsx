import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "./providers";
import { SuiClientProvider } from "./other/contexts/SuiClientContext";
import Navbar from "./other/components/Navbar";
import Sidebar from "./other/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Marketplace",
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
          <SuiClientProvider>
            <Navbar />
            <Sidebar />
            <main className="flex-1 ml-16">
              {children}
            </main>
          </SuiClientProvider>
        </Providers>
      </body>
    </html>
  );
}