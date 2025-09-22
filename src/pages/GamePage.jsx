import useGameStore from "../store/useGameStore";
import QuizGame from "../games/QuizGame";
import PuzzleGame from "../games/PuzzleGame";
import FindDiffGame from "../games/FindDiffGame";
import TapGame from "../games/TapGame";
import TimingGame from "../games/TimingGame";
import ColoringGame from "../games/ColoringGame";
import DragDropGame from "../games/DragDropGame";

function GamePage({ id }) {
  const clearGame = useGameStore((s) => s.clearGame);
  const gameId = Number(id);

  // ✅ 클리어 후 홈 이동
  const onClear = () => {
    clearGame(gameId);
    window.location.href = "/index.html"; // 쿼리 없이 홈으로
  };

  const goHome = () => (window.location.href = "/index.html");

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
        background: "linear-gradient(to bottom, #00aff0, #a6daf0)",
      }}
    >
      <div className="flex items-center justify-end mb-4">
        <button onClick={goHome} className="w-14 h-14 transition-transform">
          <img
            src="/icons/btn_back.webp"
            alt="홈으로"
            className="w-full h-full object-contain"
          />
        </button>
      </div>
      <div>{renderGame()}</div>
    </div>
  );
}

export default GamePage;
