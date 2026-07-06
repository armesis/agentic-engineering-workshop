import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { socket } from './socket'
import type { Player } from './types'

function buildJoinUrl(host: string): string {
  const port = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${host}${port}/?role=player`
}

function HostScreen() {
  const [roster, setRoster] = useState<Player[]>([])
  // window.location.hostname may be "localhost", which other devices on the
  // network can't resolve; fetch the server's LAN address for the QR code instead.
  const [joinUrl, setJoinUrl] = useState(() => buildJoinUrl(window.location.hostname))

  useEffect(() => {
    function handleRosterUpdate(players: Player[]) {
      setRoster(players)
    }

    socket.on('roster:update', handleRosterUpdate)
    return () => {
      socket.off('roster:update', handleRosterUpdate)
    }
  }, [])

  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data: { host: string }) => setJoinUrl(buildJoinUrl(data.host)))
      .catch(() => {})
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
