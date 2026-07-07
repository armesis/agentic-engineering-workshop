import { useState } from 'react'
import { socket } from './socket'
import { ANSWER_SHAPES } from './answerShapes'
import type { AnswerOption, Player, SubmitAnswerResult } from './types'

interface QuestionRoundProps {
  player: Player
}

function QuestionRound({ player }: QuestionRoundProps) {
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
      <div className="answer-grid" role="group" aria-label="Answer options">
        {(Object.keys(ANSWER_SHAPES) as AnswerOption[]).map((optionLetter) => {
          const shape = ANSWER_SHAPES[optionLetter]
          return (
            <button
              key={optionLetter}
              type="button"
              className={`answer-option answer-option-${optionLetter.toLowerCase()}`}
              disabled={answered}
              aria-label={shape.label}
              onClick={() => handleAnswer(optionLetter)}
            >
              {shape.glyph}
            </button>
          )
        })}
      </div>
      {answered && <p>Answer locked in!</p>}
    </section>
  )
}

export default QuestionRound
