import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { socket } from './socket'
import type { Player } from './types'

const joinUrl = `${window.location.origin}/?role=player`

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
      <QRCodeSVG value={joinUrl} size={200} title="Scan to join" />
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
