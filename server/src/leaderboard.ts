import type { Player } from "./roster.js";

export const LEADERBOARD_SIZE = 5;

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
}

// Ranks the full roster by score, highest first; ties keep roster order
// (Array#sort is stable) rather than sharing a rank number.
export function buildLeaderboard(roster: Player[]): LeaderboardEntry[] {
  return [...roster]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      playerId: player.id,
      username: player.username,
      avatar: player.avatar,
      score: player.score,
      rank: index + 1,
    }));
}

export function topStandings(standings: LeaderboardEntry[]): LeaderboardEntry[] {
  return standings.slice(0, LEADERBOARD_SIZE);
}

export function findEntry(standings: LeaderboardEntry[], playerId: string): LeaderboardEntry | null {
  return standings.find((entry) => entry.playerId === playerId) ?? null;
}
