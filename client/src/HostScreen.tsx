import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { socket } from './socket'
import { useSocketEvent } from './useSocketEvent'
import { remainingSeconds } from './countdown'
import HostLeaderboard from './HostLeaderboard'
import FinalResults from './FinalResults'
import type {
  AnswerOption,
  GamePhase,
  HostQuestionView,
  HostRevealView,
  LeaderboardEntry,
  Player,
} from './types'

function buildJoinUrl(host: string): string {
  const port = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${host}${port}/?role=player`
}

function HostScreen() {
  const [roster, setRoster] = useState<Player[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  const [currentQuestion, setCurrentQuestion] = useState<HostQuestionView | null>(null)
  const [revealView, setRevealView] = useState<HostRevealView | null>(null)
  const [standings, setStandings] = useState<LeaderboardEntry[]>([])
  const [finalStandings, setFinalStandings] = useState<LeaderboardEntry[]>([])
  const [countdown, setCountdown] = useState(0)
  // window.location.hostname may be "localhost", which other devices on the
  // network can't resolve; fetch the server's LAN address for the QR code instead.
  const [joinUrl, setJoinUrl] = useState(() => buildJoinUrl(window.location.hostname))

  useSocketEvent('roster:update', setRoster)
  useSocketEvent('game:phase', setGamePhase)
  useSocketEvent('question:show', setCurrentQuestion)
  useSocketEvent('question:reveal', setRevealView)
  useSocketEvent('leaderboard:show', setStandings)
  useSocketEvent('final-results:show', setFinalStandings)

  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data: { host: string }) => setJoinUrl(buildJoinUrl(data.host)))
      .catch(() => {})
  }, [])

  // Joins the server's "host" room so question:show reaches this screen -
  // Players never join that room and never receive question content. Rejoin
  // on every (re)connect, since room membership doesn't survive a reconnect.
  useEffect(() => {
    function joinHostRoom() {
      socket.emit('host:connect')
    }
    joinHostRoom()
    socket.on('connect', joinHostRoom)
    return () => {
      socket.off('connect', joinHostRoom)
    }
  }, [])

  useEffect(() => {
    if (!currentQuestion) return
    const tick = () => setCountdown(remainingSeconds(currentQuestion.startedAtMs, currentQuestion.timeLimitSeconds))
    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [currentQuestion])

  function handlePlay() {
    socket.emit('game:play')
  }

  const showLobbyCards = gamePhase === 'waiting' && roster.length <= 10

  return (
    <section id="center">
      {gamePhase === 'waiting' && (
        <div className="qr-frame">
          <span className="qr-frame-label">Scan to join</span>
          <div className="qr-frame-inner">
            <QRCodeSVG value={joinUrl} size={320} title="Scan to join" />
          </div>
        </div>
      )}
      <p>{roster.length} Player{roster.length === 1 ? '' : 's'} joined</p>
      {showLobbyCards ? (
        <ul className="roster-lobby">
          {roster.map((player) => (
            <li key={player.id} className="lobby-card">
              <span className="lobby-card-avatar">{player.avatar}</span>
              <span className="lobby-card-username">{player.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="roster">
          {roster.map((player) => (
            <li key={player.id}>
              <span>{player.avatar}</span>
              <span>{player.username}</span>
            </li>
          ))}
        </ul>
      )}
      {gamePhase === 'waiting' && <button onClick={handlePlay}>Play</button>}
      {(gamePhase === 'question' || gamePhase === 'reveal') && currentQuestion && (
        <div className="question-view">
          {gamePhase === 'question' && <p className="countdown">{countdown}</p>}
          <h2>{currentQuestion.question}</h2>
          <ul className="question-options">
            {(
              [
                ['A', currentQuestion.optionA],
                ['B', currentQuestion.optionB],
                ['C', currentQuestion.optionC],
                ['D', currentQuestion.optionD],
              ] as [AnswerOption, string][]
            ).map(([optionLetter, text]) => (
              <li key={optionLetter} className={revealView?.correctOption === optionLetter ? 'correct' : undefined}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {gamePhase === 'leaderboard' && <HostLeaderboard standings={standings} />}
      {gamePhase === 'final-results' && <FinalResults standings={finalStandings} />}
    </section>
  )
}

export default HostScreen
