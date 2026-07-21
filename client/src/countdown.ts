export function remainingMs(startedAtMs: number, timeLimitSeconds: number): number {
  const deadline = startedAtMs + timeLimitSeconds * 1000
  return Math.max(0, deadline - Date.now())
}

export function remainingSeconds(startedAtMs: number, timeLimitSeconds: number): number {
  return Math.ceil(remainingMs(startedAtMs, timeLimitSeconds) / 1000)
}
