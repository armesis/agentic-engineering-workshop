import { describe, expect, it } from "vitest";
import { canJoin, startGame } from "./game.js";

describe("startGame", () => {
  it("starts the Game from the waiting phase", () => {
    const result = startGame("waiting");
    expect(result).toEqual({ ok: true, phase: "started" });
  });

  it("refuses to start the Game again once already started", () => {
    const result = startGame("started");
    expect(result).toEqual({ ok: false });
  });
});

describe("canJoin", () => {
  it("allows joining while the Game is waiting to start", () => {
    expect(canJoin("waiting")).toEqual({ ok: true });
  });

  it("blocks joining once the Game has started", () => {
    expect(canJoin("started")).toEqual({ ok: false, error: "Game already started" });
  });
});
