import type { PlayerRevealResult } from './types'

interface RevealProps {
  result: PlayerRevealResult | null
}

function Reveal({ result }: RevealProps) {
  return (
    <section id="center">
      <h1 className={result ? (result.correct ? 'reveal-correct' : 'reveal-incorrect') : ''}>
        {result ? (result.correct ? 'Correct!' : 'Incorrect') : ''}
      </h1>
      {result && <p>+{result.pointsEarned} points</p>}
    </section>
  )
}

export default Reveal
