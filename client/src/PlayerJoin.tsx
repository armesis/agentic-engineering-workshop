import { useState, type FormEvent } from 'react'
import { socket } from './socket'
import { savePlayerIdentity } from './playerIdentity'
import type { JoinResult, Player } from './types'

// No designed Avatar set exists yet; fall back to a preset emoji grid (see CONTEXT.md: Avatar).
const AVATARS = ['🦁', '🐯', '🐼', '🐨', '🦊', '🐸', '🐵', '🐶', '🐱', '🐰', '🐮', '🐷']

interface PlayerJoinProps {
  onSuccess: (player: Player) => void
}

function PlayerJoin({ onSuccess }: PlayerJoinProps) {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    socket.emit('player:join', { username, avatar }, (result: JoinResult) => {
      setSubmitting(false)
      if (result.ok) {
        savePlayerIdentity(result.player)
        onSuccess(result.player)
        return
      }
      setError(result.error)
    })
  }

  return (
    <section id="center">
      <h1>Join the Game</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          autoFocus
        />
        <div className="avatar-grid" role="radiogroup" aria-label="Avatar">
          {AVATARS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={option === avatar}
              className="avatar-option"
              onClick={() => setAvatar(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button type="submit" disabled={submitting || !username.trim()}>
          {submitting ? 'Joining…' : 'Join'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default PlayerJoin
