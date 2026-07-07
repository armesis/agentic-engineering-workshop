import type { LeaderboardEntry } from './types'

interface FinalResultsProps {
  standings: LeaderboardEntry[]
}

// Left-to-right podium order (2nd, 1st, 3rd) with the animation staggered to
// reveal 3rd, then 2nd, then 1st last - see .podium-rank-1/-2/-3 in
// App.css for the delays that build suspense toward the winner.
const PODIUM_RANKS = [2, 1, 3]

function FinalResults({ standings }: FinalResultsProps) {
  const podium = PODIUM_RANKS.map((rank) => standings.find((entry) => entry.rank === rank)).filter(
    (entry): entry is LeaderboardEntry => entry !== undefined,
  )
  const rest = standings.filter((entry) => entry.rank > 3)

  return (
    <section id="center">
      <h1>Final Results</h1>
      <div className="podium">
        {podium.map((entry) => (
          <div key={entry.playerId} className={`podium-place podium-rank-${entry.rank}`}>
            <span className="podium-avatar">{entry.avatar}</span>
            <span className="podium-username">{entry.username}</span>
            <span className="podium-score">{entry.score}</span>
            <span className="podium-bar">{entry.rank}</span>
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <ol className="leaderboard-standings">
          {rest.map((entry) => (
            <li key={entry.playerId}>
              <span className="leaderboard-rank">{entry.rank}</span>
              <span>{entry.avatar}</span>
              <span className="leaderboard-username">{entry.username}</span>
              <span className="leaderboard-score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default FinalResults
