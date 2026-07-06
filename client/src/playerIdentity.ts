import type { Player } from './types'

const STORAGE_KEY = 'kahoot-clone:player'

export function savePlayerIdentity(player: Player): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player))
}

export function loadPlayerIdentity(): Player | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Player
  } catch {
    return null
  }
}

export function clearPlayerIdentity(): void {
  localStorage.removeItem(STORAGE_KEY)
}
