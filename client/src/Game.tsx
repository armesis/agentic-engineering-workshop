import { useState } from 'react'
import QuestionRound from './QuestionRound'
import Reveal from './Reveal'
import Leaderboard from './Leaderboard'
import FinalResults from './FinalResults'
import { useSocketEvent } from './useSocketEvent'
import type { GamePhase, LeaderboardEntry, Player, PlayerRevealResult, QuestionTimingView } from './types'

interface GameProps {
  player: Player
  gamePhase: GamePhase
  questionTiming: QuestionTimingView | null
}

function Game({ player, gamePhase, questionTiming }: GameProps) {
  // Registered as soon as the Game mounts (i.e. once the Question phase
  // begins), so it's already listening well before the server later emits
  // these on entering Reveal/Leaderboard - no race with those phases' renders below.
  const [revealResult, setRevealResult] = useState<PlayerRevealResult | null>(null)
  const [leaderboardEntry, setLeaderboardEntry] = useState<LeaderboardEntry | null>(null)
  const [finalStandings, setFinalStandings] = useState<LeaderboardEntry[]>([])
  useSocketEvent('player:reveal', setRevealResult)
  useSocketEvent('player:leaderboard', setLeaderboardEntry)
  useSocketEvent('final-results:show', setFinalStandings)

  if (gamePhase === 'question') {
    return <QuestionRound player={player} timing={questionTiming} />
  }

  if (gamePhase === 'reveal') {
    return <Reveal result={revealResult} />
  }

  if (gamePhase === 'leaderboard') {
    return <Leaderboard entry={leaderboardEntry} />
  }

  if (gamePhase === 'final-results') {
    return <FinalResults standings={finalStandings} />
  }

  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>The Game has started!</p>
    </section>
  )
}

export default Game
