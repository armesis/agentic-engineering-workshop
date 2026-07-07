import { useState } from 'react'
import QuestionRound from './QuestionRound'
import Reveal from './Reveal'
import Leaderboard from './Leaderboard'
import { useSocketEvent } from './useSocketEvent'
import type { GamePhase, LeaderboardEntry, Player, PlayerRevealResult } from './types'

interface GameProps {
  player: Player
  gamePhase: GamePhase
}

function Game({ player, gamePhase }: GameProps) {
  // Registered as soon as the Game mounts (i.e. once the Question phase
  // begins), so it's already listening well before the server later emits
  // these on entering Reveal/Leaderboard - no race with those phases' renders below.
  const [revealResult, setRevealResult] = useState<PlayerRevealResult | null>(null)
  const [leaderboardEntry, setLeaderboardEntry] = useState<LeaderboardEntry | null>(null)
  useSocketEvent('player:reveal', setRevealResult)
  useSocketEvent('player:leaderboard', setLeaderboardEntry)

  if (gamePhase === 'question') {
    return <QuestionRound player={player} />
  }

  if (gamePhase === 'reveal') {
    return <Reveal result={revealResult} />
  }

  if (gamePhase === 'leaderboard') {
    return <Leaderboard entry={leaderboardEntry} />
  }

  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>The Game has started!</p>
    </section>
  )
}

export default Game
