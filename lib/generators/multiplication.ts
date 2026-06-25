import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

// difficulty 1: ×2, ×5, ×10 only   difficulty 2: ×2–×5   difficulty 3: ×2–×9
const DIFFICULTY_CONFIG = {
  1: { tables: [2, 5, 10], maxMultiplier: 5 },
  2: { tables: [2, 3, 4, 5], maxMultiplier: 9 },
  3: { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxMultiplier: 9 },
} as const

export function generateMultiplication(difficulty: 1 | 2 | 3 = 2): Question {
  const { tables, maxMultiplier } = DIFFICULTY_CONFIG[difficulty]
  const tableNum = tables[randomInt(0, tables.length - 1)]
  const multiplier = randomInt(1, maxMultiplier)
  const correct = tableNum * multiplier

  // Occasionally flip order for variety
  const [a, b] = Math.random() < 0.5 ? [tableNum, multiplier] : [multiplier, tableNum]

  return buildQuestion({
    topic: 'multiplication',
    interactionMode: difficulty === 3 ? 'ballShoot' : 'choice',
    prompt: `${a} × ${b} = ?`,
    correct,
    distractors: generateDistractors(correct, correct + 15, 3),
    difficulty,
  })
}
