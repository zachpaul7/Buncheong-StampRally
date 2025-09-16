import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useGameStore from "./store/useGameStore";
import MainPage from "./pages/MainPage";
import MapPage from "./pages/MapPage";
import ScanPage from "./pages/ScanPage";
import GamePage from "./pages/GamePage";
import RewardPage from "./pages/RewardPage";

function App() {
  const loadFromStorage = useGameStore((state) => state.loadFromStorage);

  useEffect(() => {
    // 있어도 호출, 없어도 안전 (옵셔널 체이닝)
    useGameStore.getState().loadFromStorage?.();
  }, []);

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
