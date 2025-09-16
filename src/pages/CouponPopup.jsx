import { useEffect, useState } from "react";

function CouponPopup({ onClose }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    const hint = navigator.userAgent;
    const raw = `${date}-${hint}`;
    const hash = btoa(unescape(encodeURIComponent(raw))).slice(0, 10);
    setCode(`${date}-${hash}`);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="relative p-4 text-center w-72 h-80 flex flex-col items-center -translate-y-8"
        style={{
          backgroundImage: "url('/panels/panel_altem.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* 텍스트 영역 */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{ transform: `translateY(32px)` }}
        >
          <h2 className="text-xl font-bold mb-1 text-white drop-shadow-md">
            미션 완료!
          </h2>
          <p className="text-gray-200 mb-2">검증 코드</p>
          <p className="text-2xl font-mono text-yellow-300 mb-4 drop-shadow-md">
            {code}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="mb-2">
          <button
            onClick={onClose}
            className="w-14 h-14"
            style={{
              backgroundImage: "url('/icons/icon_big_checkmark.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default CouponPopup;
