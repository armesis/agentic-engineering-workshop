import { describe, expect, it } from "vitest";
import { beginReveal, canJoin, startGame } from "./game.js";

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

describe("canJoin", () => {
  it("allows joining while the Game is waiting to start", () => {
    expect(canJoin("waiting")).toEqual({ ok: true });
  });

  it("blocks joining once the Game has started", () => {
    expect(canJoin("question")).toEqual({ ok: false, error: "Game already started" });
  });
});
