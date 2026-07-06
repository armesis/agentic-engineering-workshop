import { describe, expect, it } from "vitest";
import { joinRoster, reattachPlayer, type Player } from "./roster.js";

describe("joinRoster", () => {
  it("admits a Player with a unique username", () => {
    const result = joinRoster([], { id: "a", username: "Ahmed", avatar: "🦁" });
    expect(result).toEqual({
      ok: true,
      player: { id: "a", username: "Ahmed", avatar: "🦁" },
    });
  });

  it("rejects a duplicate username without altering it", () => {
    const roster: Player[] = [{ id: "a", username: "Ahmed", avatar: "🦁" }];
    const result = joinRoster(roster, { id: "b", username: "Ahmed", avatar: "🐼" });
    expect(result).toEqual({ ok: false, error: "Username is already taken" });
  });

  it("rejects a duplicate username case-insensitively", () => {
    const roster: Player[] = [{ id: "a", username: "Ahmed", avatar: "🦁" }];
    const result = joinRoster(roster, { id: "b", username: "AHMED", avatar: "🐼" });
    expect(result.ok).toBe(false);
  });

  it("allows duplicate avatars across different Players", () => {
    const roster: Player[] = [{ id: "a", username: "Ahmed", avatar: "🦁" }];
    const result = joinRoster(roster, { id: "b", username: "Sam", avatar: "🦁" });
    expect(result).toEqual({
      ok: true,
      player: { id: "b", username: "Sam", avatar: "🦁" },
    });
  });

  it("rejects a blank username", () => {
    const result = joinRoster([], { id: "a", username: "   ", avatar: "🦁" });
    expect(result).toEqual({ ok: false, error: "Username is required" });
  });

  it("trims whitespace from the username", () => {
    const result = joinRoster([], { id: "a", username: "  Ahmed  ", avatar: "🦁" });
    expect(result).toEqual({
      ok: true,
      player: { id: "a", username: "Ahmed", avatar: "🦁" },
    });
  });
});

describe("reattachPlayer", () => {
  it("reattaches a Player whose id is still on the roster", () => {
    const roster: Player[] = [{ id: "a", username: "Ahmed", avatar: "🦁" }];
    const result = reattachPlayer(roster, "a");
    expect(result).toEqual({
      ok: true,
      player: { id: "a", username: "Ahmed", avatar: "🦁" },
    });
  });

  it("declines to reattach an id that isn't on the roster", () => {
    const roster: Player[] = [{ id: "a", username: "Ahmed", avatar: "🦁" }];
    const result = reattachPlayer(roster, "unknown-id");
    expect(result).toEqual({ ok: false });
  });

  it("declines to reattach against an empty roster (e.g. after a server restart)", () => {
    const result = reattachPlayer([], "a");
    expect(result).toEqual({ ok: false });
  });
});
