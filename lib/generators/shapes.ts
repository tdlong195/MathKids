import type { Question, Choice } from '@/types/question'
import { randomInt } from './index'

interface ShapeDef {
  name: string
  emoji: string
  label: string
}

const SHAPES: ShapeDef[] = [
  { name: 'circle',    emoji: '⭕', label: 'Hình tròn' },
  { name: 'square',   emoji: '🟥', label: 'Hình vuông' },
  { name: 'triangle', emoji: '🔺', label: 'Tam giác' },
  { name: 'diamond',  emoji: '🔷', label: 'Hình thoi' },
]

const DIFFICULTY_CONFIG = {
  1: { shapeCount: 3 }, // circle, square, triangle
  2: { shapeCount: 4 }, // all 4 shapes
  3: { shapeCount: 4 },
} as const

export function generateShapes(difficulty: 1 | 2 | 3 = 1): Question {
  const { shapeCount } = DIFFICULTY_CONFIG[difficulty]
  const available = SHAPES.slice(0, shapeCount)
  const correctShape = available[randomInt(0, available.length - 1)]

  // Wrong choices: other shapes from available pool
  const distractors = available
    .filter(s => s.name !== correctShape.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)

  const allChoices: Choice[] = [correctShape, ...distractors]
    .sort(() => Math.random() - 0.5)
    .map((s, i) => ({ id: `c-${i}`, label: s.label }))

  const correctId = allChoices.find(c => c.label === correctShape.label)!.id

  return {
    id: `shapes-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: 'shapes',
    interactionMode: 'choice' as const,
    prompt: 'Đây là hình gì?',
    visualEmojis: [correctShape.emoji],
    choices: allChoices,
    correctId,
    difficulty,
  }
}
