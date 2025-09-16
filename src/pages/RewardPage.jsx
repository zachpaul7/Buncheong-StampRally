import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import CouponPopup from "./CouponPopup"; // ✅ 쿠폰 팝업 import

function RewardPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const streamRef = useRef(null);

  const [needsUserAction, setNeedsUserAction] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [code, setCode] = useState(null); // ✅ 쿠폰 코드 상태

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
      setNeedsUserAction(false);
      setPermissionDenied(false);
    } catch (err) {
      console.error("카메라 실행 실패:", err.name, err.message);
      if (err.name === "NotAllowedError") {
        setPermissionDenied(true);
      }
      throw err;
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 📸 카메라 화면
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 📸 오버레이 합성
      if (overlay) {
        const size = Math.min(canvas.width, canvas.height) / 2;
        const x = canvas.width / 2 - size / 2;
        const y = canvas.height / 2 - size / 2;
        ctx.globalAlpha = 1.0;
        ctx.drawImage(overlay, x, y, size, size);
      }

      const imageData = canvas.toDataURL("image/png");
      setPhoto(imageData);

      // 👉 저장 처리
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        if (isIOS) {
          // iOS → 새 탭으로 열기
          const newTab = window.open();
          if (newTab) {
            newTab.document.write(
              `<img src="${imageData}" style="width:100%;height:auto;" />`
            );
          } else {
            alert("팝업 차단을 해제해주세요.");
          }
        } else {
          // ✅ Android/PC → 다운로드
          const link = document.createElement("a");
          const date = new Date().toISOString().replace(/[:.]/g, "-");
          link.href = url;
          link.download = `reward-${date}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");

      // ✅ 쿠폰 코드 생성
      const date = new Date().toISOString().split("T")[0];
      const hint = navigator.userAgent;
      const raw = `${date}-${hint}`;
      const hash = btoa(unescape(encodeURIComponent(raw))).slice(0, 10);
      const finalCode = `${date}-${hash}`;

      // 👉 500ms 지연 후 팝업 열기
      setTimeout(() => {
        setCode(finalCode);
        localStorage.setItem("rewardClaimed", "true");
      }, 500);
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 space-y-4"
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
      
      {/* 카메라 + 오버레이 */}
      <div className="relative w-full h-[55vh] border rounded-lg overflow-hidden shadow">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        <img
          ref={overlayRef}
          src="/icons/ico_bottle_white.png"
          alt="보상 오버레이"
          className="absolute inset-0 w-40 h-40 m-auto pointer-events-none"
        />
      </div>

      {/* 촬영 버튼 */}
      <div className="mt-4 text-center">
        <button
          onClick={capturePhoto}
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
        카메라 위에 표시된 캐릭터와 함께 
        <br />촬영 버튼을 눌러 저장하세요.
      </p>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 수동 실행 버튼 */}
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

      {/* 권한 거부 안내 */}
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

      {/* ✅ 쿠폰 팝업 */}
      {code && <CouponPopup code={code} onClose={() => navigate("/")} />}
    </div>
  );
}

export default RewardPage;
