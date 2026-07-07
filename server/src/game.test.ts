import { describe, expect, it } from "vitest";
import {
  advanceQuestion,
  beginLeaderboard,
  beginReveal,
  canJoin,
  showFinalResults,
  startGame,
} from "./game.js";

describe("startGame", () => {
  it("starts the Game from the waiting phase, straight into the first Question", () => {
    const result = startGame("waiting");
    expect(result).toEqual({ ok: true, phase: "question" });
  });

  it("refuses to start the Game again once already started", () => {
    const result = startGame("question");
    expect(result).toEqual({ ok: false });
  });
});

describe("beginReveal", () => {
  it("enters Reveal once a Question is underway", () => {
    const result = beginReveal("question");
    expect(result).toEqual({ ok: true, phase: "reveal" });
  });

  it("refuses to enter Reveal from the waiting phase", () => {
    expect(beginReveal("waiting")).toEqual({ ok: false });
  });

  it("refuses to enter Reveal again once already in Reveal", () => {
    expect(beginReveal("reveal")).toEqual({ ok: false });
  });
});

describe("beginLeaderboard", () => {
  it("enters Leaderboard once Reveal is underway", () => {
    expect(beginLeaderboard("reveal")).toEqual({ ok: true, phase: "leaderboard" });
  });

  it("refuses to enter Leaderboard from the question phase", () => {
    expect(beginLeaderboard("question")).toEqual({ ok: false });
  });

  it("refuses to enter Leaderboard again once already in Leaderboard", () => {
    expect(beginLeaderboard("leaderboard")).toEqual({ ok: false });
  });
});

describe("advanceQuestion", () => {
  it("advances to the next Question when one remains in the Question Bank", () => {
    expect(advanceQuestion("leaderboard", true)).toEqual({ ok: true, phase: "question" });
  });

  it("refuses to advance when there is no next Question", () => {
    expect(advanceQuestion("leaderboard", false)).toEqual({ ok: false });
  });

  it("refuses to advance from outside the Leaderboard phase", () => {
    expect(advanceQuestion("reveal", true)).toEqual({ ok: false });
  });
});

describe("showFinalResults", () => {
  it("shows Final Results once Leaderboard is underway with no next Question", () => {
    expect(showFinalResults("leaderboard", false)).toEqual({ ok: true, phase: "final-results" });
  });

  it("refuses when a next Question remains", () => {
    expect(showFinalResults("leaderboard", true)).toEqual({ ok: false });
  });

  it("refuses from outside the Leaderboard phase", () => {
    expect(showFinalResults("reveal", false)).toEqual({ ok: false });
  });
});

describe("canJoin", () => {
  it("allows joining while the Game is waiting to start", () => {
    expect(canJoin("waiting")).toEqual({ ok: true });
  });

  it("blocks joining once the Game has started", () => {
    expect(canJoin("question")).toEqual({ ok: false, error: "Game already started" });
  });
});
