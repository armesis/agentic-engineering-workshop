export type GamePhase = "waiting" | "question" | "reveal";

// The duration Reveal is defined to last; #11 (Leaderboard + full auto-advance
// loop) is what actually schedules leaving Reveal after this many ms.
export const REVEAL_DURATION_MS = 5000;

export type StartGameResult = { ok: true; phase: GamePhase } | { ok: false };

export function startGame(phase: GamePhase): StartGameResult {
  if (phase !== "waiting") {
    return { ok: false };
  }
  return { ok: true, phase: "question" };
}

export type BeginRevealResult = { ok: true; phase: GamePhase } | { ok: false };

export function beginReveal(phase: GamePhase): BeginRevealResult {
  if (phase !== "question") {
    return { ok: false };
  }
  return { ok: true, phase: "reveal" };
}

export type JoinGateResult = { ok: true } | { ok: false; error: string };

export function canJoin(phase: GamePhase): JoinGateResult {
  if (phase !== "waiting") {
    return { ok: false, error: "Game already started" };
  }
  return { ok: true };
}
