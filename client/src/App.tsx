import { useState } from 'react'
import HostLogin from './HostLogin'
import HostScreen from './HostScreen'
import PlayerJoin from './PlayerJoin'
import WaitingRoom from './WaitingRoom'
import type { Player } from './types'
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

  return player ? <WaitingRoom player={player} /> : <PlayerJoin onSuccess={setPlayer} />
}

export default App
