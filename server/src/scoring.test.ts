import { describe, expect, it } from "vitest";
import { GRACE_WINDOW_MS, calculateScore, submitAnswer } from "./scoring.js";
import type { Question } from "./questionBank.js";

const question: Question = {
  question: "What is 2+2?",
  optionA: "3",
  optionB: "4",
  optionC: "5",
  optionD: "6",
  correctOption: "B",
  timeLimitSeconds: 20,
  multiplier: 1,
};

describe("calculateScore", () => {
  it("awards close to the max 1000 points for an instant correct answer", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 0 },
    );
    expect(score).toBe(1000);
  });

  it("awards close to the min 500 points for a correct answer at the deadline", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 20_000 },
    );
    expect(score).toBe(500);
  });

  it("scales linearly between 500 and 1000 by how quickly the correct answer arrived", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 10_000 },
    );
    expect(score).toBe(750);
  });

  it("scores 0 for a wrong answer, however fast", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "A", submittedAtMs: 0 },
    );
    expect(score).toBe(0);
  });

  it("scores 0 for a correct answer arriving after the grace window", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 20_000 + GRACE_WINDOW_MS + 1 },
    );
    expect(score).toBe(0);
  });

  it("still scores a correct answer arriving inside the grace window", () => {
    const score = calculateScore(
      { question, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 20_000 + GRACE_WINDOW_MS },
    );
    expect(score).toBe(500);
  });

  it("scales the final score by the Question's multiplier", () => {
    const score = calculateScore(
      { question: { ...question, multiplier: 3 }, questionStartedAtMs: 0 },
      { optionLetter: "B", submittedAtMs: 0 },
    );
    expect(score).toBe(3000);
  });

  it("scores 0 when there is no submission at all", () => {
    const score = calculateScore({ question, questionStartedAtMs: 0 }, null);
    expect(score).toBe(0);
  });
});

describe("submitAnswer", () => {
  it("accepts a Player's first answer", () => {
    const result = submitAnswer({}, "p1", { optionLetter: "B", submittedAtMs: 100 });
    expect(result).toEqual({
      ok: true,
      submission: { optionLetter: "B", submittedAtMs: 100 },
    });
  });

  it("locks in the first answer, rejecting a second tap", () => {
    const existing = { p1: { optionLetter: "B" as const, submittedAtMs: 100 } };
    const result = submitAnswer(existing, "p1", { optionLetter: "A", submittedAtMs: 200 });
    expect(result).toEqual({ ok: false, error: "Already answered" });
  });

  it("tracks different Players' answers independently", () => {
    const existing = { p1: { optionLetter: "B" as const, submittedAtMs: 100 } };
    const result = submitAnswer(existing, "p2", { optionLetter: "C", submittedAtMs: 150 });
    expect(result).toEqual({
      ok: true,
      submission: { optionLetter: "C", submittedAtMs: 150 },
    });
  });
});
