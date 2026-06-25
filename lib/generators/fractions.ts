import type { Question, Choice } from '@/types/question'
import { randomInt } from './index'

interface FractionDef {
  numerator: number
  denominator: number
  label: string
  // visual: array of emojis — filled ones (🔴) represent the numerator portion
  buildVisual: () => string[]
}

function buildPizzaVisual(numerator: number, denominator: number): string[] {
  // Use colored circles: 🔴 = filled slice, ⚪ = empty slice
  return [
    ...Array(numerator).fill('🔴'),
    ...Array(denominator - numerator).fill('⚪'),
  ]
}

const FRACTION_POOL: FractionDef[] = [
  { numerator: 1, denominator: 2, label: '1/2', buildVisual: () => buildPizzaVisual(1, 2) },
  { numerator: 1, denominator: 3, label: '1/3', buildVisual: () => buildPizzaVisual(1, 3) },
  { numerator: 2, denominator: 3, label: '2/3', buildVisual: () => buildPizzaVisual(2, 3) },
  { numerator: 1, denominator: 4, label: '1/4', buildVisual: () => buildPizzaVisual(1, 4) },
  { numerator: 3, denominator: 4, label: '3/4', buildVisual: () => buildPizzaVisual(3, 4) },
  { numerator: 1, denominator: 5, label: '1/5', buildVisual: () => buildPizzaVisual(1, 5) },
  { numerator: 2, denominator: 5, label: '2/5', buildVisual: () => buildPizzaVisual(2, 5) },
]

const DIFFICULTY_CONFIG = {
  1: { pool: FRACTION_POOL.slice(0, 3) },  // 1/2, 1/3, 2/3
  2: { pool: FRACTION_POOL.slice(0, 5) },  // + 1/4, 3/4
  3: { pool: FRACTION_POOL },               // all
} as const

function makeId(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function generateFractions(difficulty: 1 | 2 | 3 = 3): Question {
  const { pool } = DIFFICULTY_CONFIG[difficulty]
  const correct = pool[randomInt(0, pool.length - 1)]

  // 3 distractors — other fractions from pool
  const distractors = pool
    .filter(f => f.label !== correct.label)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allFractions = [correct, ...distractors].sort(() => Math.random() - 0.5)
  const choices: Choice[] = allFractions.map((f, i) => ({ id: `c-${i}`, label: f.label }))
  const correctId = choices.find(c => c.label === correct.label)!.id

  return {
    id: `fractions-${Date.now()}-${makeId()}`,
    topic: 'fractions',
    interactionMode: 'choice',
    prompt: 'Hình này biểu diễn phân số nào? 🍕',
    visualEmojis: correct.buildVisual(),
    choices,
    correctId,
    difficulty,
  }
}
