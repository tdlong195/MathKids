import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

const COUNTING_EMOJIS = ['🍎', '🌟', '🎈', '🦋', '🐶', '🍌', '🌸', '⭐', '🎵', '🦁']

const DIFFICULTY_CONFIG = {
  1: { max: 5 },
  2: { max: 10 },
  3: { max: 10 },
} as const

function buildCountingEmojis(count: number): string[] {
  const emoji = COUNTING_EMOJIS[randomInt(0, COUNTING_EMOJIS.length - 1)]
  return Array(count).fill(emoji)
}

export function generateCounting(difficulty: 1 | 2 | 3 = 1): Question {
  const { max } = DIFFICULTY_CONFIG[difficulty]
  const correct = randomInt(1, max)
  const distractors = generateDistractors(correct, max, 2) // 3 total choices for age 3-4

  return buildQuestion({
    topic: 'counting',
    interactionMode: 'tapCount',
    prompt: 'Có bao nhiêu cái?',
    visualEmojis: buildCountingEmojis(correct),
    correct,
    distractors,
    difficulty,
  })
}
