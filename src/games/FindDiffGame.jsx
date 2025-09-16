import { useState, useRef } from "react";
import CustomPopup from "../components/CustomPopup"; // 📌 팝업 불러오기

function FindDiffGame({ id, onClear, onExit }) {
  const answers = [
    { x: 0.5, y: 0.15 },
    { x: 0.63, y: 0.5 },
    { x: 0.3, y: 0.75 },
  ];

  const [found, setFound] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const imgRef = useRef(null);

  const handleClick = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    answers.forEach((ans, idx) => {
      if (found.includes(idx)) return;
      const dx = ans.x - clickX;
      const dy = ans.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.08) {
        const next = [...found, idx];
        setFound(next);
        if (next.length === answers.length) {
          setTimeout(() => {
            setShowPopup(true); // ✅ 팝업 띄우기
          }, 300);
        }
      }
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onClear(); // ✅ 닫을 때 클리어 처리
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border-2 border-red-400 rounded-md p-4 mb-4 text-center">
        <p className="font-semibold text-black">틀린 곳을 모두 찾아보세요!</p>
      </div>

      <p className="mt-3 font-bold text-sm text-black text-center">
        남은 틀린 그림 : {Math.max(0, answers.length - found.length)}
      </p>

      <div className="border-2 border-red-400 rounded-md p-4">
        <div className="mb-4 flex justify-center ">
          <img
            src="/true.png"
            alt="위 그림"
            className="w-[200px] rounded border"
          />
        </div>

        <div className="relative flex justify-center">
          <img
            ref={imgRef}
            src="/false.png"
            alt="아래 그림"
            className="w-[200px] rounded border cursor-pointer"
            onClick={handleClick}
          />

          {found.map((idx) => {
            const ans = answers[idx];
            return (
              <div
                key={idx}
                className="absolute border-4 border-red-500 rounded-full pointer-events-none"
                style={{
                  width: "30px",
                  height: "30px",
                  left: `calc(${ans.x * 100}% - 15px)`,
                  top: `calc(${ans.y * 100}% - 15px)`,
                }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* ✅ 커스텀 팝업 */}
      {showPopup && <CustomPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default FindDiffGame;
