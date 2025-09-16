import { useParams, useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import QuizGame from "../games/QuizGame";
import PuzzleGame from "../games/PuzzleGame";
import FindDiffGame from "../games/FindDiffGame";
import TapGame from "../games/TapGame";
import TimingGame from "../games/TimingGame";
import ColoringGame from "../games/ColoringGame";
import DragDropGame from "../games/DragDropGame";

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clearGame = useGameStore((s) => s.clearGame);
  const gameId = Number(id);

  const goHome = () => navigate("/");

  // ✅ 클리어: store에 기록(1-based) → 홈
  const onClear = () => {
    clearGame(gameId);
    navigate("/");
  };

  const gameProps = { id: gameId, onExit: goHome, onClear };

  const renderGame = () => {
    switch (gameId) {
      case 1:
        return <QuizGame {...gameProps} />;
      case 2:
        return <PuzzleGame {...gameProps} />;
      case 3:
        return <FindDiffGame {...gameProps} />;
      case 4:
        return <TapGame {...gameProps} />;
      case 5:
        return <TimingGame {...gameProps} />;
      case 6:
        return <ColoringGame {...gameProps} />;
      case 7:
        return <DragDropGame {...gameProps} />;
      default:
        return <p className="text-red-600">잘못된 게임 ID</p>;
    }
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto px-4"
      style={{
        background: "linear-gradient(to bottom, #00aff0, #a6daf0)", // 하늘색 → 연한 하늘색 그라데이션
      }}
    >
      {/* 상단 영역 */}
      <div className="flex items-center justify-end mb-8">
        <button
          onClick={goHome}
          className="w-14 h-14 transition-transform"
        >
          <img
            src="/icons/btn_back.png"
            alt="홈으로"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* 게임 렌더링 */}
      <div>{renderGame()}</div>
    </div>
  );
}

export default GamePage;
