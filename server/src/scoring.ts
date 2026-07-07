import type { Question } from "./questionBank.js";

export interface AnswerSubmission {
  optionLetter: "A" | "B" | "C" | "D";
  submittedAtMs: number;
}

export const GRACE_WINDOW_MS = 300;
const MAX_POINTS = 1000;
const MIN_POINTS_RATIO = 0.5;

export interface ScoringContext {
  question: Question;
  questionStartedAtMs: number;
}

export function calculateScore(
  context: ScoringContext,
  submission: AnswerSubmission | null,
): number {
  if (!submission) {
    return 0;
  }

  const { question, questionStartedAtMs } = context;
  const timeLimitMs = question.timeLimitSeconds * 1000;
  const timeTakenMs = submission.submittedAtMs - questionStartedAtMs;

  if (submission.optionLetter !== question.correctOption) {
    return 0;
  }
  if (timeTakenMs > timeLimitMs + GRACE_WINDOW_MS) {
    return 0;
  }

  // The spec's own comment states the range is 500-1000; a correct answer
  // arriving inside the grace window but past the nominal deadline is clamped
  // to the deadline so it still floors at 500 rather than dipping under it.
  const clampedTimeTakenMs = Math.min(timeTakenMs, timeLimitMs);
  const base = MAX_POINTS * (1 - MIN_POINTS_RATIO * (clampedTimeTakenMs / timeLimitMs));
  return Math.round(base) * question.multiplier;
}

export type SubmitAnswerResult =
  | { ok: true; submission: AnswerSubmission }
  | { ok: false; error: string };

// The first tap locks in a Player's answer for a Question; later taps are ignored.
export function submitAnswer(
  existing: Record<string, AnswerSubmission>,
  playerId: string,
  submission: AnswerSubmission,
): SubmitAnswerResult {
  if (existing[playerId]) {
    return { ok: false, error: "Already answered" };
  }
  return { ok: true, submission };
}
