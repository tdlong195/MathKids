import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

// Generate equations of the form  (a + ?) = total  or  (total - a) = ?
const DIFFICULTY_CONFIG = {
  1: { maxTotal: 10 },
  2: { maxTotal: 20 },
  3: { maxTotal: 30 },
} as const

export function generateBalanceScale(difficulty: 1 | 2 | 3 = 1): Question {
  const { maxTotal } = DIFFICULTY_CONFIG[difficulty]
  const total = randomInt(3, maxTotal)
  const a = randomInt(1, total - 1)
  const missing = total - a   // the answer

  const isAddForm = Math.random() < 0.6
  const prompt = isAddForm
    ? `${a} + ? = ${total}`
    : `${total} - ${a} = ?`

  // visual: left side coins
  const visualEmojis = difficulty === 1 && total <= 10
    ? [...Array(a).fill('🟡'), ...Array(missing).fill('❓')]
    : undefined

  return buildQuestion({
    topic: 'balanceScale',
    interactionMode: 'balanceScale',
    prompt,
    visualEmojis,
    correct: missing,
    distractors: generateDistractors(missing, maxTotal, 3),
    difficulty,
    interactionData: { type: 'balanceScale', rightValue: total },
  })
}
