export interface Player {
  id: string;
  username: string;
  avatar: string;
}

export type JoinResult =
  | { ok: true; player: Player }
  | { ok: false; error: string };

export function joinRoster(
  roster: Player[],
  candidate: { id: string; username: string; avatar: string },
): JoinResult {
  const username = candidate.username?.trim() ?? "";
  const avatar = candidate.avatar?.trim() ?? "";

  if (!username) {
    return { ok: false, error: "Username is required" };
  }
  if (!avatar) {
    return { ok: false, error: "Avatar is required" };
  }
  if (roster.some((p) => p.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Username is already taken" };
  }

  return { ok: true, player: { id: candidate.id, username, avatar } };
}
