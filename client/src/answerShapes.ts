import type { AnswerOption } from './types'

// Kahoot-style shape/color coding (see CONTEXT.md: Question) - Player devices
// show only these 4 buttons, never the question text or options. Colors live
// in App.css (.answer-option-a/b/c/d) to keep styling out of component code.
export const ANSWER_SHAPES: Record<AnswerOption, { glyph: string; label: string }> = {
  A: { glyph: '▲', label: 'red triangle' },
  B: { glyph: '◆', label: 'blue diamond' },
  C: { glyph: '●', label: 'yellow circle' },
  D: { glyph: '■', label: 'green square' },
}
