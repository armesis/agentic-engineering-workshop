import { useLayoutEffect, useRef } from 'react'
import type { LeaderboardEntry } from './types'

interface HostLeaderboardProps {
  standings: LeaderboardEntry[]
}

// FLIP technique: before the reorder, each row remembers its screen
// position; after React re-renders in the new order, we jump each row back
// to its old position with a transform, then transition it to zero - which
// reads as the row sliding smoothly into its new rank.
function HostLeaderboard({ standings }: HostLeaderboardProps) {
  const rowRefs = useRef(new Map<string, HTMLLIElement>())
  const previousTops = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    for (const [playerId, row] of rowRefs.current) {
      const previousTop = previousTops.current.get(playerId)
      const newTop = row.getBoundingClientRect().top
      if (previousTop !== undefined && previousTop !== newTop) {
        row.style.transition = 'none'
        row.style.transform = `translateY(${previousTop - newTop}px)`
        requestAnimationFrame(() => {
          row.style.transition = 'transform 0.5s ease'
          row.style.transform = ''
        })
      }
    }
    for (const [playerId, row] of rowRefs.current) {
      previousTops.current.set(playerId, row.getBoundingClientRect().top)
    }
  }, [standings])

  return (
    <ol className="leaderboard-standings">
      {standings.map((entry) => (
        <li
          key={entry.playerId}
          ref={(row) => {
            if (row) rowRefs.current.set(entry.playerId, row)
            else rowRefs.current.delete(entry.playerId)
          }}
        >
          <span className="leaderboard-rank">{entry.rank}</span>
          <span>{entry.avatar}</span>
          <span className="leaderboard-username">{entry.username}</span>
          <span className="leaderboard-score">{entry.score}</span>
        </li>
      ))}
    </ol>
  )
}

export default HostLeaderboard
