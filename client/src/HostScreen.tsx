import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { socket } from './socket'
import { useSocketEvent } from './useSocketEvent'
import type { AnswerOption, GamePhase, HostQuestionView, HostRevealView, Player } from './types'

function buildJoinUrl(host: string): string {
  const port = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${host}${port}/?role=player`
}

function remainingSeconds(question: HostQuestionView): number {
  const deadline = question.startedAtMs + question.timeLimitSeconds * 1000
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
}

function HostScreen() {
  const [roster, setRoster] = useState<Player[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  const [currentQuestion, setCurrentQuestion] = useState<HostQuestionView | null>(null)
  const [revealView, setRevealView] = useState<HostRevealView | null>(null)
  const [countdown, setCountdown] = useState(0)
  // window.location.hostname may be "localhost", which other devices on the
  // network can't resolve; fetch the server's LAN address for the QR code instead.
  const [joinUrl, setJoinUrl] = useState(() => buildJoinUrl(window.location.hostname))

  useSocketEvent('roster:update', setRoster)
  useSocketEvent('game:phase', setGamePhase)
  useSocketEvent('question:show', setCurrentQuestion)
  useSocketEvent('question:reveal', setRevealView)

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
    setCountdown(remainingSeconds(currentQuestion))
    const interval = setInterval(() => setCountdown(remainingSeconds(currentQuestion)), 250)
    return () => clearInterval(interval)
  }, [currentQuestion])

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
    </section>
  )
}

export default HostScreen
