import { useState, useRef } from "react";
import CustomPopup from "../components/CustomPopup";

/**
 * 틀린그림찾기
 * - 클릭 좌표를 이미지 비율(0~1)로 환산
 * - 정답 반경 안에서만 "정답" 처리
 * - 원(마킹)은 "클릭한 정확한 좌표"에만 표시
 * - 오버레이는 이미지와 동일 크기의 래퍼(relative inline-block) 위에 올려 정확히 정렬
 */
function FindDiffGame({ id, onClear, onExit }) {
  /** -------------------- 튜닝 파라미터 -------------------- */
  const HIT_RADIUS = 0.08; // 정답 판정 반경 (비율 단위: 이미지 폭/높이에 대한 비율)
  const MARK_SIZE = 30; // 마킹 원 지름(px)
  const MARK_BORDER_WIDTH = 4; // 마킹 테두리 두께(px)

  /** -------------------- 정답 좌표(비율) -------------------- */
  // 모든 좌표는 (0~1) 범위의 비율 값. 이미지 크기 변경(반응형)에도 정확히 대응됨.
  const answers = [
    { x: 0.17, y: 0.4 },
    { x: 0.5, y: 0.55 },
    { x: 0.85, y: 0.45 },
  ];

  /** -------------------- 상태 -------------------- */
  const [found, setFound] = useState([]); // 맞춘 정답의 인덱스 배열
  const [marks, setMarks] = useState([]); // 표시할 원 좌표 목록 [{x, y, idx}]
  const [showPopup, setShowPopup] = useState(false);

  /** -------------------- ref -------------------- */
  const imgRef = useRef(null); // 클릭 좌표 계산용

  /** -------------------- 유틸 -------------------- */
  const dist2D = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  /** -------------------- 클릭 핸들러 -------------------- */
  const handleClick = (e) => {
    // 이미지의 렌더링 박스(스크린 좌표계) 가져오기
    const rect = imgRef.current.getBoundingClientRect();

    // 클릭 위치를 이미지 내부 비율 좌표(0~1)로 환산
    // - clientX/Y는 뷰포트 기준, rect.left/top은 이미지의 뷰포트 위치
    // - width/height로 나눠 비율화 -> 이미지 크기 변화에도 정확
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;
    const clickPt = { x: clickX, y: clickY };

    // 정답 판정: 아직 못맞춘 정답 중 반경(HIT_RADIUS) 안에 들어오면 성공
    for (let i = 0; i < answers.length; i++) {
      if (found.includes(i)) continue; // 이미 맞춘 정답은 패스

      const d = dist2D(answers[i], clickPt);
      if (d < HIT_RADIUS) {
        // 정답 처리: 해당 정답 인덱스를 found에 기록
        const nextFound = [...found, i];
        setFound(nextFound);

        // 마킹은 "정답 좌표"가 아니라 "사용자가 클릭한 정확한 좌표"에 생성
        setMarks((prev) => [...prev, { x: clickX, y: clickY, idx: i }]);

        // 모든 정답을 맞추면 팝업
        if (nextFound.length === answers.length) {
          setTimeout(() => setShowPopup(true), 300);
        }
        return; // 한 번의 클릭으로 여러 정답에 겹치지 않도록 종료
      }
    }

    // 정답이 아니면 아무것도 하지 않음 (오답 마킹 금지)
  };

  /** -------------------- 팝업 닫기 -------------------- */
  const handleClosePopup = () => {
    setShowPopup(false);
    onClear && onClear();
  };

  return (
    <div className="w-full space-y-6">
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
          className="text-white text-xl absolute"
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
          다른곳을 찾아라!
        </p>
      </div>

      {/* 남은 개수 */}
      <div
        className="text-white font-bold text-xl flex items-center justify-center mx-auto relative"
        style={{
          textShadow: `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000
      `,
        }}
      >
        남은 틀린 그림 : {Math.max(0, answers.length - found.length)}
      </div>

      {/* 보드 패널 */}
      <div
        className="p-8 space-y-8"
        style={{
          backgroundImage: "url('/panels/panel_frame_night.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* 정답(위) 예시 이미지 */}
        <div className="flex justify-center">
          <img
            src="/icons/diff_true.webp"
            alt="위 그림"
            className="w-[200px] h-auto"
          />
        </div>

        {/* 플레이(아래) 영역 */}
        <div className="flex justify-center">
          <div className="relative inline-block">
            <img
              ref={imgRef}
              src="/icons/diff_false.webp"
              alt="아래 그림"
              className="w-[200px] h-auto cursor-pointer select-none"
              onClick={handleClick}
              draggable={false}
            />

            {/* 정답일 때만 생성된 마킹 */}
            {marks.map((pt) => (
              <div
                key={pt.idx}
                className="absolute rounded-full pointer-events-none border-red-500"
                style={{
                  width: `${MARK_SIZE}px`,
                  height: `${MARK_SIZE}px`,
                  left: `${pt.x * 100}%`, // 이미지 비율 -> % 좌표
                  top: `${pt.y * 100}%`,
                  transform: "translate(-50%, -50%)", // 중심 정렬(좌상단 기준 보정 제거)
                  borderWidth: `${MARK_BORDER_WIDTH}px`,
                  borderStyle: "solid",
                  boxSizing: "border-box",
                }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* 클리어 팝업 */}
      {showPopup && <CustomPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default FindDiffGame;
