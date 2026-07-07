import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { socket } from './socket'
import { useSocketEvent } from './useSocketEvent'
import type { GamePhase, Player } from './types'

function buildJoinUrl(host: string): string {
  const port = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${host}${port}/?role=player`
}

function HostScreen() {
  const [roster, setRoster] = useState<Player[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  // window.location.hostname may be "localhost", which other devices on the
  // network can't resolve; fetch the server's LAN address for the QR code instead.
  const [joinUrl, setJoinUrl] = useState(() => buildJoinUrl(window.location.hostname))

  useSocketEvent('roster:update', setRoster)
  useSocketEvent('game:phase', setGamePhase)

  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data: { host: string }) => setJoinUrl(buildJoinUrl(data.host)))
      .catch(() => {})
  }, [])

  function handlePlay() {
    socket.emit('game:play')
  }

  return (
    <section id="center">
      <h1>Host Screen</h1>
      {gamePhase === 'waiting' && <QRCodeSVG value={joinUrl} size={200} title="Scan to join" />}
      <p>{roster.length} Player{roster.length === 1 ? '' : 's'} joined</p>
      <ul className="roster">
        {roster.map((player) => (
          <li key={player.id}>
            <span>{player.avatar}</span>
            <span>{player.username}</span>
          </li>
        ))}
      </ul>
      {gamePhase === 'waiting' ? (
        <button onClick={handlePlay}>Play</button>
      ) : (
        <p>Game started</p>
      )}
    </section>
  )
}

export default HostScreen
