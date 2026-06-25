import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const DIFFICULTY_CONFIG = {
  1: { maxSum: 5 },
  2: { maxSum: 20 },
  3: { maxSum: 30 },
} as const

const HINT_EMOJIS = ['🍎', '🌟', '🎈', '🦋', '🐶', '🍌', '🌸', '⭐', '🎵', '🦁']

export function generateAddition(difficulty: 1 | 2 | 3 = 1): Question {
  const { maxSum } = DIFFICULTY_CONFIG[difficulty]
  const a = randomInt(0, maxSum)
  const b = randomInt(0, maxSum - a)
  const correct = a + b

  // Visual hint only for easier difficulties
  const emoji = HINT_EMOJIS[randomInt(0, HINT_EMOJIS.length - 1)]
  const visualEmojis = difficulty <= 1 && correct <= 10
    ? Array(correct).fill(emoji)
    : undefined

  return buildQuestion({
    topic: 'addition',
    prompt: `${a} + ${b} = ?`,
    visualEmojis,
    correct,
    distractors: generateDistractors(correct, maxSum + 3, 3),
    difficulty,
  })
}
