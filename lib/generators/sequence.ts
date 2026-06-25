import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const DIFFICULTY_CONFIG = {
  1: { max: 10, step: 1 },
  2: { max: 20, step: 1 },
  3: { max: 30, step: 2 },
} as const

export function generateSequence(difficulty: 1 | 2 | 3 = 1): Question {
  const { max, step } = DIFFICULTY_CONFIG[difficulty]

  // Build a sequence of 4 numbers with one missing
  // e.g. 3, 4, ?, 6  — missing index is always position 2 (middle-ish)
  const start = randomInt(0, max - step * 3)
  const nums = [start, start + step, start + step * 2, start + step * 3]

  // Pick which position to hide (index 1, 2, or 3 — never first)
  const missingIndex = randomInt(1, 3)
  const correct = nums[missingIndex]

  const visible = nums.map((n, i) => (i === missingIndex ? '?' : String(n)))
  const prompt = visible.join('  —  ')

  return buildQuestion({
    topic: 'sequence',
    interactionMode: 'dragDrop',
    prompt,
    correct,
    distractors: generateDistractors(correct, max + step, 3),
    difficulty,
  })
}
