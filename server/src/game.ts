export type GamePhase = "waiting" | "question" | "reveal" | "leaderboard" | "final-results";

export const REVEAL_DURATION_MS = 5000;
export const LEADERBOARD_DURATION_MS = 5000;

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

export type BeginLeaderboardResult = { ok: true; phase: GamePhase } | { ok: false };

export function beginLeaderboard(phase: GamePhase): BeginLeaderboardResult {
  if (phase !== "reveal") {
    return { ok: false };
  }
  return { ok: true, phase: "leaderboard" };
}

export type AdvanceQuestionResult = { ok: true; phase: GamePhase } | { ok: false };

// Refuses when there's no next Question - showFinalResults handles that
// transition instead.
export function advanceQuestion(phase: GamePhase, hasNextQuestion: boolean): AdvanceQuestionResult {
  if (phase !== "leaderboard" || !hasNextQuestion) {
    return { ok: false };
  }
  return { ok: true, phase: "question" };
}

export type ShowFinalResultsResult = { ok: true; phase: GamePhase } | { ok: false };

export function showFinalResults(phase: GamePhase, hasNextQuestion: boolean): ShowFinalResultsResult {
  if (phase !== "leaderboard" || hasNextQuestion) {
    return { ok: false };
  }
  return { ok: true, phase: "final-results" };
}

export type JoinGateResult = { ok: true } | { ok: false; error: string };

export function canJoin(phase: GamePhase): JoinGateResult {
  if (phase !== "waiting") {
    return { ok: false, error: "Game already started" };
  }
  return { ok: true };
}
