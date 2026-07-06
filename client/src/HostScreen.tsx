import { useEffect, useState } from 'react'
import { socket } from './socket'
import type { Player } from './types'

function HostScreen() {
  const [roster, setRoster] = useState<Player[]>([])

  useEffect(() => {
    function handleRosterUpdate(players: Player[]) {
      setRoster(players)
    }

    socket.on('roster:update', handleRosterUpdate)
    return () => {
      socket.off('roster:update', handleRosterUpdate)
    }
  }, [])

  return (
    <section id="center">
      <h1>Host Screen</h1>
      <p>{roster.length} Player{roster.length === 1 ? '' : 's'} joined</p>
      <ul className="roster">
        {roster.map((player) => (
          <li key={player.id}>
            <span>{player.avatar}</span>
            <span>{player.username}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default HostScreen
