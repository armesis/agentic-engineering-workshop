import { describe, expect, it } from "vitest";
import { buildLeaderboard, findEntry, topStandings } from "./leaderboard.js";
import type { Player } from "./roster.js";

const roster: Player[] = [
  { id: "p1", username: "Alice", avatar: "🦊", score: 500 },
  { id: "p2", username: "Bob", avatar: "🐼", score: 1500 },
  { id: "p3", username: "Cleo", avatar: "🐙", score: 900 },
];

describe("buildLeaderboard", () => {
  it("ranks Players by score, highest first", () => {
    const standings = buildLeaderboard(roster);
    expect(standings.map((entry) => entry.playerId)).toEqual(["p2", "p3", "p1"]);
    expect(standings.map((entry) => entry.rank)).toEqual([1, 2, 3]);
  });

  it("carries each Player's username, avatar, and score into their entry", () => {
    const standings = buildLeaderboard(roster);
    expect(standings[0]).toEqual({ playerId: "p2", username: "Bob", avatar: "🐼", score: 1500, rank: 1 });
  });

  it("breaks ties by keeping roster order", () => {
    const tied: Player[] = [
      { id: "p1", username: "Alice", avatar: "🦊", score: 100 },
      { id: "p2", username: "Bob", avatar: "🐼", score: 100 },
    ];
    const standings = buildLeaderboard(tied);
    expect(standings.map((entry) => entry.playerId)).toEqual(["p1", "p2"]);
    expect(standings.map((entry) => entry.rank)).toEqual([1, 2]);
  });

  it("returns an empty list for an empty roster", () => {
    expect(buildLeaderboard([])).toEqual([]);
  });
});

describe("topStandings", () => {
  it("keeps only the top 5 entries", () => {
    const bigRoster: Player[] = Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      username: `Player${i}`,
      avatar: "🦊",
      score: i,
    }));
    const standings = buildLeaderboard(bigRoster);
    expect(topStandings(standings)).toHaveLength(5);
    expect(topStandings(standings).map((entry) => entry.rank)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns fewer than 5 entries when the roster is smaller", () => {
    const standings = buildLeaderboard(roster);
    expect(topStandings(standings)).toHaveLength(3);
  });
});

describe("findEntry", () => {
  it("finds a Player's entry regardless of rank", () => {
    const standings = buildLeaderboard(roster);
    expect(findEntry(standings, "p1")).toEqual({
      playerId: "p1",
      username: "Alice",
      avatar: "🦊",
      score: 500,
      rank: 3,
    });
  });

  it("returns null when the Player isn't in the standings", () => {
    const standings = buildLeaderboard(roster);
    expect(findEntry(standings, "missing")).toBeNull();
  });
});
