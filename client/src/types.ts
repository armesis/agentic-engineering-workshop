export interface Player {
  id: string
  username: string
  avatar: string
  score: number
}

export type JoinResult = { ok: true; player: Player } | { ok: false; error: string }
export type RejoinResult = { ok: true; player: Player } | { ok: false }
export type GamePhase = 'waiting' | 'question'

export type AnswerOption = 'A' | 'B' | 'C' | 'D'

export interface HostQuestionView {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  timeLimitSeconds: number
  startedAtMs: number
}

export type SubmitAnswerResult =
  | { ok: true; submission: { optionLetter: AnswerOption; submittedAtMs: number } }
  | { ok: false; error: string }
