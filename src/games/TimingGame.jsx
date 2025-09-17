import { useEffect, useRef, useState } from "react";
import CustomPopup from "../components/CustomPopup";

/**
 * 타이밍 맞추기 게임
 * - STOP 누르는 순간 🔥 위치 고정 (paused)
 * - 목표 범위면 onClear(), 아니면 팝업 → 닫으면 재개
 */
function TimingGame({
  id,
  onClear,
  onExit,
  furnaceImg = "/icons/ico_firedoom.webp",
}) {
  const [pos, setPos] = useState(0); // 0~100 (%)
  const dirRef = useRef(1); // 1: →, -1: ←
  const rafRef = useRef(null);

  // ✅ 랜덤 속도 함수 (60~100)
  const randomSpeed = (min = 60, max = 100) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const [speed, setSpeed] = useState(() => randomSpeed()); // 시작 속도 랜덤
  const [paused, setPaused] = useState(false); // 🔥 이동 일시정지
  const [popupMsg, setPopupMsg] = useState(null); // ✅ 팝업 메시지

  // 목표 구간
  const target = useRef({ start: 42, end: 58 });

  // 왕복 애니메이션 (paused면 루프 중단)
  useEffect(() => {
    if (paused) return;
    let last = performance.now();

    const loop = (t) => {
      const dt = (t - last) / 1000;
      last = t;

      setPos((p) => {
        let next = p + dirRef.current * speed * dt;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        }
        if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, paused]);

  // STOP: 멈추고 판정 → 성공: 클리어, 실패: 재개
  const stop = () => {
    if (paused) return;
    setPaused(true);

    const { start, end } = target.current;
    const ok = pos >= start && pos <= end;

    if (ok) {
      // ✅ 성공 → 300ms 딜레이 후 팝업
      setTimeout(() => {
        setPopupMsg("✅ 정확한 타이밍!");
      }, 300);
    } else {
      // 실패는 즉시
      setPopupMsg("🔁 다시 도전해보세요!");
    }
  };

  const handleClosePopup = () => {
    if (popupMsg?.includes("타이밍")) {
      // ✅ 성공
      setPopupMsg(null);
      onClear?.();
    } else {
      // ❌ 실패 → 새 랜덤 속도로 재시작
      setPopupMsg(null);
      setSpeed(randomSpeed(70, 110)); // 실패 후 속도 랜덤 (범위 다르게 조정 가능)
      setPaused(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      stop();
    }
  };

  return (
    <div className="w-full outline-none" tabIndex={0} onKeyDown={onKeyDown}>
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
          도자기를 꺼내라!
        </p>
      </div>

      {/* 2) 가마 이미지 */}
      <div className="py-6 px-12">
        <div className="w-full max-w-sm mx-auto">
          <img
            src={furnaceImg}
            alt="가마"
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "";
              e.currentTarget.classList.add("bg-gray-300");
            }}
          />
        </div>
      </div>

      {/* 3) 게이지 + STOP */}
      <div className="px-6">
        <div className="relative w-full max-w-sm mx-auto h-8 bg-slate-900 rounded-full shadow-inner">
          <div className="absolute inset-1 rounded-full bg-slate-700/70" />
          <div
            className="absolute top-0.5 bottom-0.5 bg-yellow-600/70 rounded"
            style={{
              left: `${target.current.start}%`,
              width: `${target.current.end - target.current.start}%`,
            }}
          />
          {/* 🔥 아이콘 */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-5xl pb-2">
              🔥
            </div>
          </div>
        </div>

        <p className="my-2 text-sm text-gray-800 font-bold text-center">
          알맞은 순간에 버튼을 눌러 도자기를 꺼내세요!
        </p>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={stop}
            className="p-8"
            style={{
              backgroundImage: `url('/icons/icon_big_checkmark.webp')`,
              backgroundSize: "100% 100%",
              aspectRatio: "1/1.1",
            }}
          ></button>
        </div>
      </div>

      {/* ✅ CustomPopup */}
      {popupMsg && (
        <CustomPopup message={popupMsg} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default TimingGame;
