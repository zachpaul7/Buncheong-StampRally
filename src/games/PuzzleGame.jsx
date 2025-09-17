import { useEffect, useMemo, useRef, useState } from "react";
import CustomPopup from "../components/CustomPopup";

function PuzzleGame({
  id,
  onClear,
  onExit,
  imageUrl = "/icons/ico_bottle.webp",
}) {
  const TILES = useMemo(() => {
    const arr = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        arr.push({
          i: row * 3 + col,
          pos: `${col * 50}% ${row * 50}%`,
        });
      }
    }
    return arr;
  }, []);

  const [angles, setAngles] = useState(Array(9).fill(0));
  const clearedRef = useRef(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const rand = () => [0, 90, 180, 270][Math.floor(Math.random() * 4)];
    let next = Array(9)
      .fill(0)
      .map(() => rand());
    if (next.every((d) => d === 0)) {
      next[Math.floor(Math.random() * 9)] = 90;
    }
    setAngles(next);
  }, []);

  const rotate = (idx) => {
    setAngles((prev) => {
      const next = [...prev];
      next[idx] = prev[idx] + 90;
      return next;
    });
  };

  useEffect(() => {
    const tid = setTimeout(() => {
      if (clearedRef.current) return;
      const solved = angles.every((deg) => deg % 360 === 0);
      if (solved) {
        clearedRef.current = true;
        setShowPopup(true);
      }
    }, 300);
    return () => clearTimeout(tid);
  }, [angles]);

  const handleClosePopup = () => {
    setShowPopup(false);
    onClear?.();
  };

  return (
    <div className="w-full space-y-12">
      {/* 제목 리본 */}
      <div
        className="mb-4 flex items-center justify-center mx-auto relative"
        style={{
          backgroundImage: "url('/panels/head_ribbon_shade_blue.webp')",
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
          도자기를 복원하라!
        </p>
      </div>

      <div
        className="mx-auto w-full max-w-sm p-4 mb-4"
        style={{
          backgroundImage: "url('/panels/panel_frame_night.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          minHeight: "170px",
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          {TILES.map(({ i, pos }) => (
            <button
              key={i}
              aria-label={`tile-${i + 1}`}
              onClick={() => rotate(i)}
              className="relative aspect-square rounded-md overflow-hidden bg-gray-100
                         hover:shadow transition-transform duration-300"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "300% 300%",
                backgroundPosition: pos,
                backgroundRepeat: "no-repeat",
                transform: `rotate(${angles[i]}deg)`,
                transformOrigin: "50% 50%",
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-base text-gray-700 font-bold text-center">
        각 타일을 클릭할 때마다 90°씩 회전합니다.
      </p>

      {showPopup && <CustomPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default PuzzleGame;
