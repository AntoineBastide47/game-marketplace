'use client'
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import GamePage from "./components/GamePage";
import SkinPage from "./components/SkinPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNetworkVariable } from "./networkConfig";
import { SuiClient } from "@mysten/sui/client";

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
        </Routes>
      </main>
    </BrowserRouter>
  );
}