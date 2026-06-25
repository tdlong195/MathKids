import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const QUANTITY_EMOJIS = ['🍎', '🌟', '🎈', '🦋', '🐶', '🍌', '🌸', '⭐', '🐱', '🦁']

const DIFFICULTY_CONFIG = {
  1: { max: 5 },
  2: { max: 10 },
  3: { max: 10 },
} as const

export function generateQuantityMatch(difficulty: 1 | 2 | 3 = 1): Question {
  const { max } = DIFFICULTY_CONFIG[difficulty]
  const correct = randomInt(1, max)
  const emoji = QUANTITY_EMOJIS[randomInt(0, QUANTITY_EMOJIS.length - 1)]

  return buildQuestion({
    topic: 'quantityMatch',
    interactionMode: 'dragDrop',
    prompt: 'Kéo số đúng vào nhóm này!',
    visualEmojis: Array(correct).fill(emoji),
    correct,
    distractors: generateDistractors(correct, max, 2),
    difficulty,
  })
}
