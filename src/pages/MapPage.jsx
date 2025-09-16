import { useNavigate } from "react-router-dom";

function MapPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen max-w-md mx-auto px-4 space-y-4"
      style={{
        background: "linear-gradient(to bottom, #00aff0, #a6daf0)", // 하늘색 → 연한 하늘색 그라데이션
      }}
    >
      {/* 상단 헤더 */}
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-14 h-14"
        >
          <img
            src="/icons/btn_back.png"
            alt="홈으로"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow-md">
          행사장 지도
        </h2>
        <p className="text-white text-sm mb-6 drop-shadow-md">
          아래 QR 위치를 찾아 미션을 수행하세요.
        </p>
        <img
          src="/icons/ico_map.png"
          alt="행사장 지도"
          className="w-full"
          style={{ maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}

export default MapPage;
