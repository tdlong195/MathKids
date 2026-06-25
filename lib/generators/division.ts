import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const DIFFICULTY_CONFIG = {
  1: { tables: [2, 5, 10], maxMultiplier: 5 },
  2: { tables: [2, 3, 4, 5], maxMultiplier: 9 },
  3: { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxMultiplier: 9 },
} as const

export function generateDivision(difficulty: 1 | 2 | 3 = 2): Question {
  const { tables, maxMultiplier } = DIFFICULTY_CONFIG[difficulty]
  const divisor = tables[randomInt(0, tables.length - 1)]
  const quotient = randomInt(1, maxMultiplier)
  const dividend = divisor * quotient  // always exact division

  return buildQuestion({
    topic: 'division',
    interactionMode: 'choice',
    prompt: `${dividend} ÷ ${divisor} = ?`,
    correct: quotient,
    distractors: generateDistractors(quotient, maxMultiplier + 2, 3),
    difficulty,
  })
}
