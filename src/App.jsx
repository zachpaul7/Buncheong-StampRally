// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import useGameStore from "./store/useGameStore";
import { preloadImages } from "./utils/preloadImages";

import MainPage from "./pages/MainPage";
import MapPage from "./pages/MapPage";
import ScanPage from "./pages/ScanPage";
import GamePage from "./pages/GamePage";
import RewardPage from "./pages/RewardPage";
import RefreshGuard from "./components/RefreshGuard";

function QueryRouter() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const to = params.get("to");

  if (!to) return <MainPage />;

  if (to.startsWith("/game/")) {
    return <GamePage id={to.replace("/game/", "")} />;
  }
  if (to === "/map") return <MapPage />;
  if (to === "/scan") return <ScanPage />;
  if (to === "/reward") return <RewardPage />;

  return <MainPage />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      useGameStore.getState().loadFromStorage?.();
      await preloadImages();
      setIsLoading(false);
    }
    init();
  }, []);

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: "linear-gradient(to bottom, #00aff0, #a6daf0)",
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
      <RefreshGuard />
      <Routes>
        <Route path="/index.html" element={<QueryRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
