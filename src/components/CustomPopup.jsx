import React from "react";
import ReactDOM from "react-dom";

function CustomPopup({
  message = "✅ 미션 클리어!",
  onClose,
  textOffset = 25,
}) {
  const popup = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="relative p-4 text-center w-64 h-64 flex flex-col items-center"
        style={{
          backgroundImage: "url('/panels/panel_altem.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* 텍스트 영역 */}
        <div className="flex-1 flex items-center justify-center">
          <p
            className="text-xl font-bold whitespace-pre-line text-white drop-shadow-md"
            style={{ marginTop: `${textOffset}px` }} // ✅ marginTop으로 교체
          >
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="mb-2">
          <button
            onClick={onClose}
            className="w-14 h-14 text-white font-bold"
            style={{
              backgroundImage: "url('/icons/icon_big_checkmark.webp')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></button>
        </div>
      </div>
    </div>
  );

  // Portal로 body에 렌더링
  return ReactDOM.createPortal(popup, document.body);
}

export default CustomPopup;
