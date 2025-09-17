import { useMemo, useState } from "react";
import CustomPopup from "../components/CustomPopup";

const QUIZ_BANK = {
  1: [
    {
      q: "분청사기를 만들 때 필요 없는 것은?",
      choices: [
        { text: "가마도구" },
        { text: "불" },
        { text: "화강암" },
        { text: "물레" },
      ],
      answer: 2,
    },
    {
      q: "분장 바탕색에 쓰이는 재료는?",
      choices: [
        { text: "분장 백토" },
        { text: "먹물" },
        { text: "석회수" },
        { text: "수채화 물감" },
      ],
      answer: 0,
    },
    {
      q: "도자기 소성 온도대는?",
      choices: [
        { text: "500~700℃" },
        { text: "800~1000℃" },
        { text: "1200~1300℃" },
        { text: "1400~1500℃" },
      ],
      answer: 2,
    },
  ],
};

function QuizGame({ id, onClear, onExit }) {
  const questions = useMemo(() => QUIZ_BANK[id] || [], [id]);
  const [idx, setIdx] = useState(0);
  const [popupMsg, setPopupMsg] = useState(null);

  const handleAnswer = (i, e) => {
    const curr = questions[idx];
    if (!curr) return;
    e.currentTarget.blur();

    if (i !== curr.answer) {
      setPopupMsg("❌ 오답! \n다시 시도해보세요!");
      return;
    }

    const last = idx === questions.length - 1;
    if (last) {
      setPopupMsg("✅ 미션 클리어!");
    } else {
      setIdx((n) => n + 1);
    }
  };

  const handleClosePopup = () => {
    if (popupMsg?.includes("클리어")) {
      setPopupMsg(null);
      onClear?.();
    } else {
      setPopupMsg(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center bg-transparent">
        등록된 문제가 없습니다.
        <div className="mt-4 text-center">
          <button
            onClick={onExit}
            className="px-3 py-2 bg-gray-400 text-white rounded"
          >
            나가기
          </button>
        </div>
      </div>
    );
  }

  const q = questions[idx];

  return (
    <div className="w-full flex flex-col items-center bg-transparent">
      {/* 문제 패널 */}
      <div
        className="w-full max-w-md relative flex flex-col items-center justify-center mb-6"
        style={{
          backgroundImage: "url('/panels/panel_framehead_night.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          minHeight: "150px",
        }}
      >
        {/* 진행도 리본 (반응형) */}
        <div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
          style={{
            backgroundImage: "url('/panels/head_ribbon_shade_blue.webp')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            width: "60%",
            aspectRatio: "4/1",
          }}
        >
          <span
            className="text-white font-bold text-xl drop-shadow absolute left-1/2"
            style={{
              top: "35%",
              transform: "translate(-50%, -50%)",
              textShadow: `
                -1px -1px 0 #000,  
                1px -1px 0 #000,
                -1px  1px 0 #000,
                1px  1px 0 #000
              `,
            }}
          >
            {idx + 1} / {questions.length}
          </span>
        </div>

        {/* 문제 텍스트 */}
        <div
          className="absolute w-full px-6 text-center"
          style={{
            top: "57%",
            transform: "translateY(-50%)",
          }}
        >
          <span
            className="text-white font-semibold text-lg leading-snug drop-shadow"
            style={{
              textShadow: `
                -2px -2px 0 #3e5bb7,  
                2px -2px 0 #3e5bb7,
                -2px  2px 0 #3e5bb7,
                2px  2px 0 #3e5bb7
              `,
            }}
          >
            {q.q}
          </span>
        </div>
      </div>

      {/* 선택지 패널 */}
      <div
        className="flex flex-col gap-4 w-full max-w-md py-8 px-4 bg-transparent"
        style={{
          backgroundImage: "url('/panels/panel_frame_night.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {q.choices.map((c, i) => (
          <button
            key={i}
            onClick={(e) => handleAnswer(i, e)}
            className="relative w-full h-16 flex items-center justify-center text-lg font-medium text-gray-800 bg-transparent"
            style={{
              backgroundImage: "url('/panels/btn_rectangle_silver.webp')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            {c.text && (
              <span
                className="text-gray-700 font-bold text-lg drop-shadow absolute left-1/2 transform -translate-x-1/2"
                style={{
                  top: "45%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {c.text}
              </span>
            )}
            {c.img && (
              <img
                src={c.img}
                alt={`choice-${i}`}
                className="max-h-12 object-contain"
              />
            )}
          </button>
        ))}
      </div>

      {popupMsg && (
        <CustomPopup message={popupMsg} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default QuizGame;
