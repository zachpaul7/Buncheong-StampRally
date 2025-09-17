import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useGameStore from "./store/useGameStore";
import { preloadImages } from "./utils/preloadImages"; // ✅ 빠진 부분 추가

import MainPage from "./pages/MainPage";
import MapPage from "./pages/MapPage";
import ScanPage from "./pages/ScanPage";
import GamePage from "./pages/GamePage";
import RewardPage from "./pages/RewardPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loadFromStorage = useGameStore((state) => state.loadFromStorage);

  useEffect(() => {
    preloadImages().then(() => {
      setIsLoading(false); // ✅ 로딩 끝
    });
  }, []);

  useEffect(() => {
    // 있어도 호출, 없어도 안전 (옵셔널 체이닝)
    useGameStore.getState().loadFromStorage?.();
  }, []);

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: "linear-gradient(to bottom, #00aff0, #a6daf0)", // 하늘색 → 연한 하늘색 그라데이션
        }}
      >
        <div className="text-white text-2xl font-bold animate-pulse">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/reward" element={<RewardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
