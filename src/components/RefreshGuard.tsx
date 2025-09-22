// src/components/RefreshGuard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type GuardConfig = {
  shortWindowMs: number;
  shortLimit: number;
  shortCooldownMs: number;
  longWindowMs: number;
  longLimit: number;
};

const DEFAULT_CFG: GuardConfig = {
  shortWindowMs: 10 * 60 * 1000, // 10분
  shortLimit: 100, // 100회
  shortCooldownMs: 30 * 60 * 1000, // 30분
  longWindowMs: 24 * 60 * 60 * 1000, // 24시간
  longLimit: 1000, // 1000회
};

const KEY_VISITS = "rf_visits_v1";
const KEY_BLOCK_UNTIL = "rf_block_until_v1";

function now() {
  return Date.now();
}
function load<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(k: string, v: any) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}
function pushVisit(t: number) {
  const arr = load<number[]>(KEY_VISITS, []);
  arr.push(t);
  if (arr.length > 5000) arr.splice(0, arr.length - 5000);
  save(KEY_VISITS, arr);
  return arr;
}
function pruneInWindow(arr: number[], windowMs: number) {
  const threshold = now() - windowMs;
  return arr.filter((ts) => ts >= threshold);
}
function makeMsg(until: number) {
  const remain = Math.max(0, until - now());
  const mm = Math.floor(remain / 60000);
  const ss = Math.floor((remain % 60000) / 1000);
  return `새로고침 과도 사용이 감지되었습니다.\n남은 대기시간: ${mm}분 ${ss}초`;
}

export default function RefreshGuard({
  cfg = DEFAULT_CFG,
}: {
  cfg?: GuardConfig;
}) {
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const blockUntil = load<number | null>(KEY_BLOCK_UNTIL, null);
    if (blockUntil && blockUntil > now()) {
      setBlockedMsg(makeMsg(blockUntil));
      navigate("/index.html"); // ✅ 이미 블락 중이면 홈으로
      return;
    } else if (blockUntil) {
      save(KEY_BLOCK_UNTIL, null);
    }

    let visits = pushVisit(now());
    const shortArr = pruneInWindow(visits, cfg.shortWindowMs);
    const longArr = pruneInWindow(visits, cfg.longWindowMs);

    const keepMinTs = Math.min(
      now() - cfg.longWindowMs,
      now() - cfg.shortWindowMs
    );
    visits = visits.filter((ts) => ts >= keepMinTs);
    save(KEY_VISITS, visits);

    let until: number | null = null;
    if (shortArr.length > cfg.shortLimit) {
      until = now() + cfg.shortCooldownMs;
    }
    if (longArr.length > cfg.longLimit) {
      until = now() + cfg.longWindowMs;
    }
    if (until) {
      save(KEY_BLOCK_UNTIL, until);
      setBlockedMsg(makeMsg(until));
      navigate("/index.html"); // ✅ 차단 시 홈으로 리다이렉트
    }
  }, [cfg, navigate]);

  if (!blockedMsg) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
      }}
    >
      <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>
          이용이 일시 제한되었습니다
        </h1>
        <p style={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>{blockedMsg}</p>
      </div>
    </div>
  );
}
