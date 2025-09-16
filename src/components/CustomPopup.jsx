import React from "react";

function CustomPopup({
  message = "✅ 미션 클리어!",
  onClose,
  textOffset = 25, // 텍스트 y축 오프셋(px 단위)
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="relative p-4 text-center w-64 h-64 flex flex-col items-center -translate-y-8"
        style={{
          backgroundImage: "url('/panels/panel_altem.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* 텍스트 영역 */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ transform: `translateY(${textOffset}px)` }} // y축 조절
        >
          <p className="text-xl font-bold whitespace-pre-line text-white drop-shadow-md">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="mb-2">
          <button
            onClick={onClose}
            className="w-14 h-14 text-white font-bold"
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

export default CustomPopup;
