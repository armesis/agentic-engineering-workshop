import type { Player } from './types'

interface GameProps {
  player: Player
}

function Game({ player }: GameProps) {
  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>The Game has started!</p>
    </section>
  )
}

export default Game
