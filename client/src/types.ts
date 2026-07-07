export interface Player {
  id: string
  username: string
  avatar: string
}

export type JoinResult = { ok: true; player: Player } | { ok: false; error: string }
export type RejoinResult = { ok: true; player: Player } | { ok: false }
export type GamePhase = 'waiting' | 'started'
