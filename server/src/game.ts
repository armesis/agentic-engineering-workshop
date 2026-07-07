export type GamePhase = "waiting" | "started";

export type StartGameResult = { ok: true; phase: GamePhase } | { ok: false };

export function startGame(phase: GamePhase): StartGameResult {
  if (phase !== "waiting") {
    return { ok: false };
  }
  return { ok: true, phase: "started" };
}

export type JoinGateResult = { ok: true } | { ok: false; error: string };

export function canJoin(phase: GamePhase): JoinGateResult {
  if (phase !== "waiting") {
    return { ok: false, error: "Game already started" };
  }
  return { ok: true };
}
