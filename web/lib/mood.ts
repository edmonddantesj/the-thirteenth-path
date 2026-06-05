// MOODBOARD_SPEC_V0.1 §1 — 아크 적응형 무드(무드=척추). 아크 넘으면 바탕 무드 자체가 바뀜.
// 색은 발광 아닌 *배어나옴*(no glossy). teal=아카이브 잔존 전용 의미색.
import type { ArcId } from "./content";

export interface MoodTokens {
  bg: string;
  bg2: string;
  ink: string;
  inkDim: string;
  accent: string; // 의미색(서장 teal=아카이브 잔존 / 하즈란 모래빛)
  line: string;
}

export const MOOD: Record<ArcId, MoodTokens> = {
  // 서장 소각된 이름 — 차가운 재·누아르·끊긴 좌표
  seojang: { bg: "#0E0F12", bg2: "#15171C", ink: "#D8D4CC", inkDim: "#8A8780", accent: "#3FB6A8", line: "#26282E" },
  // 하즈란 — 마른 열·변방·황혼(냉→온 첫 발)
  hazran: { bg: "#1A1410", bg2: "#221A14", ink: "#E8DBC8", inkDim: "#9A8E7C", accent: "#C9A36B", line: "#2E2620" },
};

// CSS 커스텀 프로퍼티 문자열(인라인 style 주입용) — 무드를 한 곳에서 척추로 흘림.
export function moodVars(arc: ArcId): Record<string, string> {
  const t = MOOD[arc];
  return {
    "--bg": t.bg,
    "--bg2": t.bg2,
    "--ink": t.ink,
    "--ink-dim": t.inkDim,
    "--accent": t.accent,
    "--line": t.line,
  };
}
