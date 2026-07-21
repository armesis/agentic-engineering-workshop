import { useEffect, useState } from 'react'
import { remainingMs } from './countdown'
import type { QuestionTimingView } from './types'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface CountdownRingProps {
  timing: QuestionTimingView
}

function CountdownRing({ timing }: CountdownRingProps) {
  const [remaining, setRemaining] = useState(() => remainingMs(timing.startedAtMs, timing.timeLimitSeconds))

  useEffect(() => {
    const tick = () => setRemaining(remainingMs(timing.startedAtMs, timing.timeLimitSeconds))
    tick()
    const interval = setInterval(tick, 100)
    return () => clearInterval(interval)
  }, [timing])

  const totalMs = timing.timeLimitSeconds * 1000
  const fraction = totalMs > 0 ? remaining / totalMs : 0
  const seconds = Math.ceil(remaining / 1000)

  return (
    <div className="countdown-ring" role="status" aria-label={`${seconds} seconds remaining`}>
      <svg viewBox="0 0 120 120">
        <circle className="countdown-ring-track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="countdown-ring-progress"
          cx="60"
          cy="60"
          r={RADIUS}
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: CIRCUMFERENCE * (1 - fraction),
          }}
        />
      </svg>
      <span className="countdown-ring-value" aria-hidden="true">
        {seconds}
      </span>
    </div>
  )
}

export default CountdownRing
