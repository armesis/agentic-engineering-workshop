import type { LeaderboardEntry } from './types'

interface LeaderboardProps {
  entry: LeaderboardEntry | null
}

function Leaderboard({ entry }: LeaderboardProps) {
  return (
    <section id="center">
      <h1>Leaderboard</h1>
      {entry ? (
        <>
          <p className="leaderboard-own-rank">#{entry.rank}</p>
          <p>{entry.score} points</p>
        </>
      ) : (
        <p>Waiting for standings…</p>
      )}
    </section>
  )
}

export default Leaderboard
