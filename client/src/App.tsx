import { useEffect, useState } from 'react'
import HostLogin from './HostLogin'
import HostScreen from './HostScreen'
import PlayerJoin from './PlayerJoin'
import WaitingRoom from './WaitingRoom'
import Game from './Game'
import { socket } from './socket'
import { clearPlayerIdentity, loadPlayerIdentity } from './playerIdentity'
import type { GamePhase, Player, QuestionTimingView, RejoinResult } from './types'
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
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  // The server sends the current phase right after connecting, but that arrives
  // over the wire — until it does, we don't yet know whether to show the join
  // form or "Game already started", so render nothing rather than guess wrong.
  const [checkingGamePhase, setCheckingGamePhase] = useState(true)
  const [questionTiming, setQuestionTiming] = useState<QuestionTimingView | null>(null)

  useEffect(() => {
    function handleGamePhase(phase: GamePhase) {
      setGamePhase(phase)
      setCheckingGamePhase(false)
    }

    // Subscribed here (always-mounted), not inside QuestionRound: the server
    // emits question:timing in the same tick as the game:phase change that
    // would mount QuestionRound, so a listener registered on mount would
    // reliably miss that first emission.
    socket.on('game:phase', handleGamePhase)
    socket.on('question:timing', setQuestionTiming)
    return () => {
      socket.off('game:phase', handleGamePhase)
      socket.off('question:timing', setQuestionTiming)
    }
  }, [])

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

  if (checkingStoredIdentity || checkingGamePhase) return null

  if (player) {
    return gamePhase === 'waiting' ? (
      <WaitingRoom player={player} />
    ) : (
      <Game player={player} gamePhase={gamePhase} questionTiming={questionTiming} />
    )
  }

  if (gamePhase !== 'waiting') {
    return (
      <section id="center">
        <h1>Game already started</h1>
        <p>Sorry, you can't join right now — the Game is already underway.</p>
      </section>
    )
  }

  return <PlayerJoin onSuccess={setPlayer} />
}

export default App
