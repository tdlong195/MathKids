import type { Question, Choice } from '@/types/question'
import { randomInt } from './index'

interface FracPair {
  a: { n: number; d: number; label: string }
  b: { n: number; d: number; label: string }
  // which is larger: 'a' | 'b' | 'equal'
  answer: 'a' | 'b' | 'equal'
}

function frac(n: number, d: number): { n: number; d: number; label: string } {
  return { n, d, label: `${n}/${d}` }
}

// Curated pairs ordered by difficulty
const PAIRS_EASY: FracPair[] = [
  { a: frac(1, 2), b: frac(1, 4), answer: 'a' },
  { a: frac(1, 3), b: frac(1, 2), answer: 'b' },
  { a: frac(3, 4), b: frac(1, 4), answer: 'a' },
  { a: frac(2, 3), b: frac(1, 3), answer: 'a' },
  { a: frac(1, 2), b: frac(2, 4), answer: 'equal' },
]

const PAIRS_HARD: FracPair[] = [
  { a: frac(2, 3), b: frac(3, 4), answer: 'b' },
  { a: frac(3, 5), b: frac(2, 3), answer: 'b' },
  { a: frac(4, 5), b: frac(3, 4), answer: 'a' },
  { a: frac(2, 5), b: frac(1, 3), answer: 'a' },
  { a: frac(3, 6), b: frac(1, 2), answer: 'equal' },
]

function makeId(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function generateFractionCompare(difficulty: 1 | 2 | 3 = 3): Question {
  const pool = difficulty <= 2 ? PAIRS_EASY : PAIRS_HARD
  const pair = pool[randomInt(0, pool.length - 1)]

  const choices: Choice[] = [
    { id: 'a', label: pair.a.label },
    { id: 'b', label: pair.b.label },
    { id: 'eq', label: 'Bằng nhau' },
  ]

  const correctId = pair.answer === 'equal' ? 'eq' : pair.answer

  // visual: bar comparison using colored blocks
  // a-fraction: 🟦 filled, ⬜ empty; b-fraction: 🟥 filled, ⬜ empty (separator: |)
  const aFilled = Array(pair.a.n).fill('🟦').concat(Array(pair.a.d - pair.a.n).fill('⬜'))
  const bFilled = Array(pair.b.n).fill('🟥').concat(Array(pair.b.d - pair.b.n).fill('⬜'))
  const visualEmojis = [...aFilled, '➖', ...bFilled]

  return {
    id: `fractionCompare-${Date.now()}-${makeId()}`,
    topic: 'fractionCompare',
    interactionMode: 'choice',
    prompt: `${pair.a.label}  so với  ${pair.b.label} — phân số nào lớn hơn?`,
    visualEmojis,
    choices,
    correctId,
    difficulty,
  }
}
