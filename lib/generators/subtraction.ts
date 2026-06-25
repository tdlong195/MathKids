import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const DIFFICULTY_CONFIG = {
  1: { maxMinuend: 5 },
  2: { maxMinuend: 20 },
  3: { maxMinuend: 30 },
} as const

const HINT_EMOJIS = ['🍎', '🌟', '🎈', '🦋', '🐶', '🍌', '🌸', '⭐', '🎵', '🦁']

export function generateSubtraction(difficulty: 1 | 2 | 3 = 1): Question {
  const { maxMinuend } = DIFFICULTY_CONFIG[difficulty]
  const a = randomInt(1, maxMinuend)
  const b = randomInt(0, a) // result is always >= 0
  const correct = a - b

  const emoji = HINT_EMOJIS[randomInt(0, HINT_EMOJIS.length - 1)]
  const visualEmojis = difficulty <= 1 && a <= 10
    ? Array(a).fill(emoji)
    : undefined

  return buildQuestion({
    topic: 'subtraction',
    prompt: `${a} - ${b} = ?`,
    visualEmojis,
    correct,
    distractors: generateDistractors(correct, maxMinuend, 3),
    difficulty,
  })
}
