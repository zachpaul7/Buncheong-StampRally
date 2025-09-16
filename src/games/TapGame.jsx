import { useState, useRef, useEffect } from "react";
import CustomPopup from "../components/CustomPopup";

function TapGame({ id, onClear, onExit }) {
  const GOAL = 100;
  const STEP = 5;
  const BAR_TRANSITION_MS = 200;

  const [progress, setProgress] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const lockedRef = useRef(false);
  const timerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleTap = (e) => {
    e.preventDefault();
    if (lockedRef.current) return;

    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 150);

    setProgress((prev) => Math.min(prev + STEP, GOAL));
  };

  useEffect(() => {
    if (progress < GOAL || lockedRef.current) return;

    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      setShowPopup(true);
    }, BAR_TRANSITION_MS);

    return () => clearTimeout(timerRef.current);
  }, [progress]);

  const handleClosePopup = () => {
    setShowPopup(false);
    onClear?.();
  };

  return (
    <div className="w-full space-y-6">
      {/* 제목 리본 */}
      <div
        className="mb-4 flex items-center justify-center mx-auto relative"
        style={{
          backgroundImage: "url('/panels/head_ribbon_shade_blue.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "70%",
          aspectRatio: "4/1",
        }}
      >
        <p
          className="text-white text-xl absolute"
          style={{
            color: "white",
            fontWeight: "bold",
            top: "17%",
            textShadow: `
              -1px -1px 0 #3e5bb7,  
              1px -1px 0 #3e5bb7,
              -1px  2px 0 #3e5bb7,
              1px  2px 0 #3e5bb7
            `,
          }}
        >
          흙을 반죽하라!
        </p>
      </div>

      <div
        className="p-4 flex items-center justify-center select-none"
        onPointerDown={handleTap}
        role="button"
        aria-label="knead-clay"
      >
        <img
          src="/icons/ico_sand.png"
          alt="점토"
          className={`w-[80%] h-[80%] p-4 object-contain pointer-events-none transition-transform duration-150 ${isTapped ? "scale-110" : "scale-100"
            }`}
        />
      </div>

      <div className="p-2">
        <div
          className="w-full h-12 overflow-hidden flex items-center"
          style={{
            backgroundImage: "url('/panels/progress_bar_framedark.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="h-full bg-green-500 transition-all rounded-md duration-200"
            style={{
              width: `${progress}%`,
              marginTop: "-1px",
            }}
          />

        </div>
        <div className="mt-3 text-center text-xl font-semibold text-white"
          style={{
            textShadow: `
                -1px -1px 0 #000,  
                1px -1px 0 #000,
                -1px  1px 0 #000,
                1px  1px 0 #000
              `
          }}> {progress}% </div>
        {showPopup && <CustomPopup onClose={handleClosePopup} />}
      </div>

    </div>

  );
}

export default TapGame;
