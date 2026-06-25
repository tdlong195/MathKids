import type { Question } from '@/types/question'
import type { MemoryFlipData } from '@/types/question'
import { randomInt } from './index'

const DIFFICULTY_CONFIG = {
  1: { pairCount: 3, maxNumber: 5 },   // 6 cards, numbers 1-5
  2: { pairCount: 4, maxNumber: 8 },   // 8 cards, numbers 1-8
  3: { pairCount: 5, maxNumber: 10 },  // 10 cards, numbers 1-10
} as const

function makeId(): string {
  return Math.random().toString(36).slice(2, 7)
}

function sampleWithoutReplacement(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export function generateMemoryMatch(difficulty: 1 | 2 | 3 = 1): Question {
  const { pairCount, maxNumber } = DIFFICULTY_CONFIG[difficulty]
  const numbers = sampleWithoutReplacement(maxNumber, pairCount)

  // Each number becomes 2 cards sharing a pairId
  const pairs: MemoryFlipData['pairs'] = []
  for (const num of numbers) {
    const pairId = `pair-${num}`
    pairs.push({ id: `card-${makeId()}`, pairId, label: String(num) })
    pairs.push({ id: `card-${makeId()}`, pairId, label: String(num) })
  }

  // Shuffle card order
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }

  const interactionData: MemoryFlipData = { type: 'memoryFlip', pairs }

  return {
    id: `memoryMatch-${Date.now()}-${makeId()}`,
    topic: 'memoryMatch',
    interactionMode: 'memoryFlip',
    prompt: 'Lật thẻ tìm cặp giống nhau! 🧠',
    visualEmojis: undefined,
    choices: [],
    correctId: '',
    difficulty,
    interactionData,
  }
}
