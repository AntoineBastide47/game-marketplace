'use client'
import Navbar from "./other/components/Navbar";
import Sidebar from "./other/components/Sidebar";
import Overview from "./page.tsx (Overview)";
import GamePage from "./game/[id]/page.tsx (Game Page)";
import SkinPage from "./game/[id]/[skin]/page.tsx (Skin Page)";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNetworkVariable } from "./networkConfig";
import { SuiClient } from "@mysten/sui/client";
import MyGames from "./user/[id]/page.tsx (Browse Games)";

export default function App() {
  const nodeUrl = useNetworkVariable("nodeUrl")
  const client = new SuiClient({ url: nodeUrl })

  return (
    <BrowserRouter>
      <Navbar />
      <Sidebar />
      <main className="flex-1 ml-16">
        <Routes>
          <Route path="/" element={<Overview client={client} />} />
          <Route path="/game/:id" element={<GamePage client={client} />} />
          <Route path="/game/:id/:skin" element={<SkinPage />} />
          <Route path="/user/:id" element={<MyGames client={client} />} />
          {/*<Route path="/my-games/edit/:id" />*/}
        </Routes>
      </main>
    </BrowserRouter>
  );
}