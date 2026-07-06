import type { Player } from './types'

interface WaitingRoomProps {
  player: Player
}

function WaitingRoom({ player }: WaitingRoomProps) {
  return (
    <section id="center">
      <h1>{player.avatar} {player.username}</h1>
      <p>You're in! Waiting for the Host to start the Game…</p>
    </section>
  )
}

export default WaitingRoom
