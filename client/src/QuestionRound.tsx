import { useState } from 'react'
import { socket } from './socket'
import { ANSWER_SHAPES } from './answerShapes'
import CountdownRing from './CountdownRing'
import type { AnswerOption, Player, QuestionTimingView, SubmitAnswerResult } from './types'

interface QuestionRoundProps {
  player: Player
  timing: QuestionTimingView | null
}

function QuestionRound({ player, timing }: QuestionRoundProps) {
  const [answered, setAnswered] = useState(false)

  function handleAnswer(optionLetter: AnswerOption) {
    if (answered) return
    // Locks in on the first tap, before the server even acknowledges it.
    setAnswered(true)
    socket.emit(
      'player:answer',
      { playerId: player.id, optionLetter },
      (_result: SubmitAnswerResult) => {},
    )
  }

  return (
    <section id="center">
      {answered ? (
        timing && <CountdownRing timing={timing} />
      ) : (
        <div className="answer-grid" role="group" aria-label="Answer options">
          {(Object.keys(ANSWER_SHAPES) as AnswerOption[]).map((optionLetter) => {
            const shape = ANSWER_SHAPES[optionLetter]
            return (
              <button
                key={optionLetter}
                type="button"
                className={`answer-option answer-option-${optionLetter.toLowerCase()}`}
                aria-label={shape.label}
                onClick={() => handleAnswer(optionLetter)}
              >
                {shape.glyph}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default QuestionRound
