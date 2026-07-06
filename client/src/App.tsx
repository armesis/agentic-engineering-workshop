import { useEffect, useState } from 'react'
import HostLogin from './HostLogin'
import HostScreen from './HostScreen'
import PlayerJoin from './PlayerJoin'
import WaitingRoom from './WaitingRoom'
import { socket } from './socket'
import { clearPlayerIdentity, loadPlayerIdentity } from './playerIdentity'
import type { Player, RejoinResult } from './types'
import './App.css'

const isPlayer = new URLSearchParams(window.location.search).get('role') === 'player'

function App() {
  return isPlayer ? <PlayerApp /> : <HostApp />
}

function HostApp() {
  const [authenticated, setAuthenticated] = useState(false)

  return authenticated ? (
    <HostScreen />
  ) : (
    <HostLogin onSuccess={() => setAuthenticated(true)} />
  )
}

function PlayerApp() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [checkingStoredIdentity, setCheckingStoredIdentity] = useState(true)

  useEffect(() => {
    const stored = loadPlayerIdentity()
    if (!stored) {
      setCheckingStoredIdentity(false)
      return
    }

    socket.emit('player:rejoin', { id: stored.id }, (result: RejoinResult) => {
      if (result.ok) {
        setPlayer(result.player)
      } else {
        clearPlayerIdentity()
      }
      setCheckingStoredIdentity(false)
    })
  }, [])

  if (checkingStoredIdentity) return null

  return player ? <WaitingRoom player={player} /> : <PlayerJoin onSuccess={setPlayer} />
}

export default App
