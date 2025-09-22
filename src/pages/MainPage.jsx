import { Link, useNavigate } from "react-router-dom";
import { FaUndo } from "react-icons/fa";
import useGameStore from "../store/useGameStore";
import { useState } from "react";
import CouponPopup from "./CouponPopup";

// 🔑 좌표 중심 계산 함수
const getCenter = (points) => {
  const coords = points.split(" ").map((p) => p.split(",").map(Number));
  const sum = coords.reduce((acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }), {
    x: 0,
    y: 0,
  });
  return { x: sum.x / coords.length, y: sum.y / coords.length };
};

function MainPage() {
  const navigate = useNavigate();
  const clearedPieces = useGameStore((s) => s.clearedPieces);
  const resetGame = useGameStore((s) => s.resetGame);

  const [rewardClaimed, setRewardClaimed] = useState(
    localStorage.getItem("rewardClaimed") === "true"
  );
  const [showCoupon, setShowCoupon] = useState(false);

  // 퍼즐 조각 정의 (각 조각 사이 1% 갭)
  const pieces = [
    // 1행
    { id: 1, points: "0,0 49.5,0 49.5,32.5 0,32.5" },
    { id: 2, points: "50.5,0 100,0 100,32.5 50.5,32.5" },

    // 2행
    { id: 3, points: "0,33.5 32.5,33.5 32.5,67.5 0,67.5" },
    { id: 4, points: "33.5,33.5 65.5,33.5 65.5,67.5 33.5,67.5" },
    { id: 5, points: "66.5,33.5 100,33.5 100,67.5 66.5,67.5" },

    // 3행
    { id: 6, points: "0,68.5 49.5,68.5 49.5,100 0,100" },
    { id: 7, points: "50.5,68.5 100,68.5 100,100 50.5,100" },
  ];

  const allCleared = clearedPieces.length === pieces.length;

  // 퍼즐 클릭 시
  const handleClick = (id) => navigate(`/index.html?to=/game/${id}`);

  // ✅ 초기화 시 쿠폰 기록도 삭제
  const handleReset = () => {
    resetGame();
    localStorage.removeItem("rewardClaimed");
    setRewardClaimed(false);
    setShowCoupon(false);
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundImage: "url('/panels/Panel_BackGround_Blue.webp')", // 원하는 이미지 경로
        backgroundSize: "cover", // 화면 꽉 채우기
        backgroundPosition: "center", // 가운데 정렬
        backgroundRepeat: "no-repeat", // 반복 방지
      }}
    >
      {/* 퍼즐 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md aspect-square relative mb-6 -mt-16">
          {/* 지도 (바탕) */}
          <img
            src="/icons/ico_map.webp"
            alt="map"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 덮개 조각 (마스킹 PNG + clipPath) */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {pieces.map(
              (p) =>
                !clearedPieces.includes(p.id) && (
                  <clipPath id={`clip-${p.id}`} key={`clip-${p.id}`}>
                    <polygon points={p.points} />
                  </clipPath>
                )
            )}

            {pieces.map(
              (p) =>
                !clearedPieces.includes(p.id) && (
                  <image
                    key={`mask-${p.id}`}
                    href="/icons/ico_map_black.webp" // 전체 마스킹 이미지
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    clipPath={`url(#clip-${p.id})`}
                    onClick={() => handleClick(p.id)}
                  />
                )
            )}
          </svg>

          {/* 자물쇠 이미지 */}
          {pieces.map((p) => {
            if (clearedPieces.includes(p.id)) return null;
            const { x, y } = getCenter(p.points);
            return (
              <img
                key={`lock-${p.id}`}
                src="/icons/icon_big_lock.webp" // 🔒 자물쇠 이미지 경로
                alt="잠금"
                className="absolute w-6 h-6 pointer-events-none"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        {/* 버튼 영역 (지도 + QR 스캔 + 쿠폰) */}
        <div className="flex gap-6 w-full max-w-md justify-center my-4">
          {/* 지도 버튼 */}
          <Link
            to="/index.html?to=/map"
            className="w-16 h-16 flex items-center justify-center"
            style={{
              backgroundImage: "url('/icons/btn_hex_green.webp')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* QR 스캔 버튼 */}
          <Link
            to="/index.html?to=/scan"
            className="w-32 h-16 flex items-center justify-center text-white font-bold"
            style={{
              backgroundImage: "url('/icons/btn_rectangle_pressed_blue.webp')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></Link>

          {/* 쿠폰 버튼 (완료/보기 통합) */}
          {allCleared && (
            <button
              onClick={() =>
                rewardClaimed
                  ? setShowCoupon(true)
                  : navigate("/index.html?to=/reward")
              }
              className="w-16 h-16 flex items-center justify-center text-white font-bold"
              style={{
                backgroundImage: "url('/icons/btn_ticket.webp')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></button>
          )}
        </div>

        {/* 개발용 초기화 버튼 (필요 없으면 주석 처리 or 삭제) import.meta.env.DEV  */}
        {true && (
          <div className="mt-2">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded flex items-center justify-center gap-2"
            >
              <FaUndo /> 초기화
            </button>
          </div>
        )}
      </div>

      {/* 쿠폰 팝업 */}
      {showCoupon && <CouponPopup onClose={() => setShowCoupon(false)} />}
    </div>
  );
}

export default MainPage;
