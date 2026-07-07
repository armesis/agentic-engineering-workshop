import { useState } from 'react'
import QuestionRound from './QuestionRound'
import Reveal from './Reveal'
import { useSocketEvent } from './useSocketEvent'
import type { GamePhase, Player, PlayerRevealResult } from './types'

interface GameProps {
  player: Player
  gamePhase: GamePhase
}

function Game({ player, gamePhase }: GameProps) {
  // Registered as soon as the Game mounts (i.e. once the Question phase
  // begins), so it's already listening well before the server later emits
  // this on entering Reveal - no race with the Reveal-phase render below.
  const [revealResult, setRevealResult] = useState<PlayerRevealResult | null>(null)
  useSocketEvent('player:reveal', setRevealResult)

  if (gamePhase === 'question') {
    return <QuestionRound player={player} />
  }

  if (gamePhase === 'reveal') {
    return <Reveal result={revealResult} />
  }

  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>The Game has started!</p>
    </section>
  )
}

export default Game
