import QuestionRound from './QuestionRound'
import type { GamePhase, Player } from './types'

interface GameProps {
  player: Player
  gamePhase: GamePhase
}

function Game({ player, gamePhase }: GameProps) {
  if (gamePhase === 'question') {
    return <QuestionRound player={player} />
  }

  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>The Game has started!</p>
    </section>
  )
}

export default Game
