'use client'
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import GamePage from "./components/GamePage";
import SkinPage from "./components/SkinPage";
import type { Game } from "./types/game";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Sidebar />
      <main className="flex-1 ml-16">
        <div className="h-[64px] md:h-[68px]" aria-hidden />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/game/:id/skins" element={<SkinPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}