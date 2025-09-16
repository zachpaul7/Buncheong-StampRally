import { useState, useRef } from "react";
import CustomPopup from "../components/CustomPopup";

function DragDropGame({ id, onClear, onExit }) {
  const items = ["log1", "log2", "log3", "log4"];
  const [placed, setPlaced] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 더블탭 감지용 ref
  const lastTappedRef = useRef({ item: null, time: 0 });

  const handleTouchStart = (item) => {
    if (placed.includes(item)) return;

    const now = Date.now();
    if (
      lastTappedRef.current.item === item &&
      now - lastTappedRef.current.time < 400 // 400ms 안에 다시 터치
    ) {
      // ✅ 더블탭 → 바로 투입 처리
      const next = [...placed, item];
      setPlaced(next);

      if (next.length === items.length) {
        setTimeout(() => {
          setShowPopup(true);
        }, 300);
      }
    } else {
      // 일반 드래그 시작
      setDragging(item);
    }

    lastTappedRef.current = { item, time: now };
  };

  const handleTouchEnd = (e) => {
    if (!dragging) return;

    const dropZone = e.currentTarget.getBoundingClientRect();
    const touch = e.changedTouches[0];

    if (
      touch.clientX >= dropZone.left &&
      touch.clientX <= dropZone.right &&
      touch.clientY >= dropZone.top &&
      touch.clientY <= dropZone.bottom
    ) {
      if (!placed.includes(dragging)) {
        const next = [...placed, dragging];
        setPlaced(next);

        if (next.length === items.length) {
          setTimeout(() => {
            setShowPopup(true);
          }, 300);
        }
      }
    }

    setDragging(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onClear?.();
  };

  return (
    <div className="w-full p-3 space-y-4">
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
          className="text-white text-lg absolute"
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
          소나무 장작을 넣어라!
        </p>
      </div>

      <div
        onTouchEnd={handleTouchEnd}
        className="relative py-6 px-12 flex items-center justify-center overflow-hidden"
      >
        <img
          src="/icons/ico_firedoom.png"
          alt="furnace"
          className="object-cover w-full h-full"
        />

      </div>

      <div className="text-white font-bold text-xl flex items-center justify-center mx-auto relative pb-6"
        style={{
          textShadow: `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000
      `,
        }}>
        장작 {placed.length}개 투입됨
      </div>

      <div className="relative flex flex-wrap gap-2 justify-center">
        {items.map((item) => (
          <img
            key={item}
            src="/log.png"
            alt={item}
            draggable={false}
            onTouchStart={() => handleTouchStart(item)}
            className={`w-16 h-16 object-contain cursor-pointer ${placed.includes(item)
                ? "opacity-30 cursor-not-allowed"
                : "hover:opacity-80"
              }`}
          />
        ))}
      </div>

      {showPopup && <CustomPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default DragDropGame;
