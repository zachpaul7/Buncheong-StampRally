import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";

function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [needsUserAction, setNeedsUserAction] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    startCamera().catch((err) => {
      console.warn("자동 실행 실패:", err.name, err.message);
      setNeedsUserAction(true);
    });

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    const video = videoRef.current;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 }, // ✅ 해상도 Full HD
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // iOS 전체화면 방지
      await video.play();
    } catch (err) {
      console.error("카메라 실행 실패:", err.name, err.message);
      if (err.name === "NotAllowedError") {
        setPermissionDenied(true);
      }
    }
  }

  function scanQRCode() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // 현재 비디오 프레임을 캡처
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        if (code.data.startsWith("game/")) {
          const gameId = code.data.split("/")[1];
          stopCamera();
          navigate(`/game/${gameId}`);
        } else {
          alert("올바르지 않은 QR 코드입니다.");
        }
      } else {
        alert("QR 코드를 인식하지 못했습니다. 다시 시도해주세요.");
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 space-y-6"
      style={{
        background: "linear-gradient(to bottom, #00aff0, #a6daf0)", // 하늘색 → 연한 하늘색 그라데이션
      }}>
      {/* 상단 헤더 */}
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-14 h-14 "
        >
          <img
            src="/icons/btn_back.png"
            alt="홈으로"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* 카메라 영상 */}
      <div className="relative w-full h-[50vh] border rounded-lg overflow-hidden shadow">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* 스캔 가이드 박스 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 border-4 border-red-500 rounded"></div>
        </div>
      </div>
      
      {/* 스캔 버튼 */}
      <div className="mt-4 text-center flex items-center justify-center">
        <button
          onClick={scanQRCode}
          className="w-20 h-20 text-white font-bold"
          style={{
            backgroundImage: "url('/icons/Camera - Blue.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
        </button>
      </div>

      <p className="text-base font-bold text-gray-800 text-center">
        촬영 버튼을 눌러 QR코드를 스캔하세요!
      </p>

      {/* 숨겨진 캔버스 (QR 분석용) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 권한 관련 안내 */}
      {needsUserAction && !permissionDenied && (
        <div className="mt-4 text-center">
          <button
            onClick={() => startCamera()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            카메라 시작
          </button>
        </div>
      )}

      {permissionDenied && (
        <div className="mt-4 text-center text-red-600">
          <p className="mb-2">카메라 권한이 거부되었습니다.</p>
          {isIOS ? (
            <p>⚙️ iOS 설정 → Safari → 카메라 접근 허용을 켜주세요.</p>
          ) : (
            <p>
              🔒 Android 크롬 주소창 왼쪽 자물쇠 아이콘 → 권한 → 카메라 → 허용
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanPage;
