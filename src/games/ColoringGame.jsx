import { useEffect, useRef, useState } from "react";
import CustomPopup from "../components/CustomPopup";

export default function ColoringGame({ onClear, onExit }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const maskDataRef = useRef(null);
  const paintedPixelsRef = useRef(new Set());

  const [totalMaskPixels, setTotalMaskPixels] = useState(0);
  const [painting, setPainting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const [color, setColor] = useState("rgba(255,255,255,1)");

  const brushSize = 15;
  const clearedRef = useRef(false);
  const prevPosRef = useRef(null);

  useEffect(() => {
    initCanvas();

    const canvas = canvasRef.current;
    const preventScroll = (e) => e.preventDefault();
    canvas.addEventListener("touchmove", preventScroll, { passive: false });

    window.addEventListener("resize", initCanvas);

    return () => {
      canvas.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  function initCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth = canvas.parentElement.offsetWidth - 16;
    canvas.width = parentWidth;
    canvas.height = parentWidth;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    ctxRef.current = context;

    const maskImg = new Image();
    maskImg.src = "/icons/ico_bottle_white.png";
    maskImg.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(maskImg, 0, 0, canvas.width, canvas.height);

      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      maskDataRef.current = imgData;

      drawOutline(context, imgData, canvas.width, canvas.height);

      let total = 0;
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] > 128) total++;
      }
      setTotalMaskPixels(total);

      paintedPixelsRef.current = new Set();
      setProgress(0);
      clearedRef.current = false;
      prevPosRef.current = null;
    };
  }

  function drawOutline(ctx, imgData, width, height) {
    const outlinePixels = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const a = imgData.data[i + 3];
        if (a > 128) {
          const neighbors = [
            ((y - 1) * width + x) * 4 + 3,
            ((y + 1) * width + x) * 4 + 3,
            (y * width + (x - 1)) * 4 + 3,
            (y * width + (x + 1)) * 4 + 3,
          ];
          if (neighbors.some((ni) => imgData.data[ni] <= 128)) {
            outlinePixels.push([x, y]);
          }
        }
      }
    }

    ctx.fillStyle = "black";
    outlinePixels.forEach(([x, y]) => {
      ctx.fillRect(x, y, 1, 1);
    });
  }

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX || e.nativeEvent.clientX;
      clientY = e.clientY || e.nativeEvent.clientY;
    }

    // ✅ 좌표 보정: rect 크기 대비 실제 캔버스 해상도 비율 적용
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return [
      (clientX - rect.left) * scaleX,
      (clientY - rect.top) * scaleY,
    ];
  }


  function startPainting(e) {
    setPainting(true);
    prevPosRef.current = getPos(e);
    paint(e);
  }

  function stopPainting() {
    setPainting(false);
    prevPosRef.current = null;
  }

  function paint(e) {
    if (!painting || !ctxRef.current || !maskDataRef.current) return;

    const [x, y] = getPos(e);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const maskData = maskDataRef.current;
    const newPainted = paintedPixelsRef.current;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const rgbaMatch = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)?\)/
    );
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) * 255 : 255;

    const radius = brushSize;

    const [x0, y0] = prevPosRef.current || [x, y];
    const dx = x - x0;
    const dy = y - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    for (let step = 0; step <= steps; step++) {
      const px = Math.floor(x0 + (dx * step) / steps);
      const py = Math.floor(y0 + (dy * step) / steps);

      for (let dy2 = -radius; dy2 <= radius; dy2++) {
        for (let dx2 = -radius; dx2 <= radius; dx2++) {
          const bx = px + dx2;
          const by = py + dy2;
          if (bx < 0 || by < 0 || bx >= canvas.width || by >= canvas.height)
            continue;

          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist > radius) continue;

          const idx = (by * canvas.width + bx) * 4;

          if (maskData.data[idx + 3] > 128) {
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = a;

            newPainted.add(`${bx},${by}`);
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    prevPosRef.current = [x, y];

    const pct = (newPainted.size / totalMaskPixels) * 100;
    setProgress(pct);

    if (pct >= 99 && !clearedRef.current) {
      clearedRef.current = true;
      setTimeout(() => {
        setShowPopup(true);
      }, 300);
    }

    drawOutline(ctx, maskData, canvas.width, canvas.height);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
    onClear?.();
  };

  return (
    <div className="w-full p-2 space-y-12">
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
          백토를 발라라!
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="w-4/5 h-auto touch-none mx-auto"   // ✅ CSS로 줄여서 표시 (예: 80%)
        onMouseDown={startPainting}
        onMouseUp={stopPainting}
        onMouseMove={paint}
        onTouchStart={startPainting}
        onTouchEnd={stopPainting}
        onTouchMove={paint}
      />

      <div className="p-2">
        {/* 진행도 프레임 */}
        <div
          className="w-full h-12 overflow-hidden flex items-center"
          style={{
            backgroundImage: "url('/panels/progress_bar_framedark.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          {/* 초록색 게이지 */}
          <div
            className="h-full bg-green-500 transition-all rounded-md duration-200"
            style={{
              width: `${progress}%`,
              marginTop: "-1px",
            }}
          />
        </div>

        {/* ✅ 퍼센트 텍스트 (프레임 바깥 아래쪽) */}
        <div
          className="mt-3 text-center text-xl font-semibold text-white"
          style={{
            textShadow: `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000
      `,
          }}
        >
          {progress.toFixed(0)}%
        </div>

        {/* 팝업 */}
        {showPopup && <CustomPopup onClose={handleClosePopup} />}
      </div>


    </div>
  );
}
