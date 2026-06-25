import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

type Shape = 'rectangle' | 'square' | 'triangle'

const DIFFICULTY_CONFIG = {
  1: { shapes: ['square'] as Shape[], maxSide: 5, type: 'perimeter' as const },
  2: { shapes: ['square', 'rectangle'] as Shape[], maxSide: 10, type: 'perimeter' as const },
  3: { shapes: ['square', 'rectangle', 'triangle'] as Shape[], maxSide: 10, type: 'both' as const },
} as const

export function generateGeometry(difficulty: 1 | 2 | 3 = 3): Question {
  const { shapes, maxSide } = DIFFICULTY_CONFIG[difficulty]
  const shape = shapes[randomInt(0, shapes.length - 1)]
  const calcType = difficulty === 3 && Math.random() < 0.4 ? 'area' : 'perimeter'

  if (shape === 'square') {
    const side = randomInt(2, maxSide)
    const perimeter = 4 * side
    const area = side * side
    const correct = calcType === 'area' ? area : perimeter
    const prompt = calcType === 'area'
      ? `Hình vuông cạnh ${side} cm. Diện tích là bao nhiêu cm²?`
      : `Hình vuông cạnh ${side} cm. Chu vi là bao nhiêu cm?`
    return buildQuestion({
      topic: 'geometry',
      interactionMode: difficulty === 3 ? 'timeAttack' : 'choice',
      prompt,
      visualEmojis: ['🟦'],
      correct,
      distractors: generateDistractors(correct, correct + 20, 3),
      difficulty,
      timeLimit: difficulty === 3 ? 20 : undefined,
    })
  }

  if (shape === 'rectangle') {
    const w = randomInt(2, maxSide)
    const h = randomInt(2, maxSide)
    const perimeter = 2 * (w + h)
    const area = w * h
    const correct = calcType === 'area' ? area : perimeter
    const prompt = calcType === 'area'
      ? `Hình chữ nhật dài ${w} cm, rộng ${h} cm. Diện tích là bao nhiêu cm²?`
      : `Hình chữ nhật dài ${w} cm, rộng ${h} cm. Chu vi là bao nhiêu cm?`
    return buildQuestion({
      topic: 'geometry',
      interactionMode: difficulty === 3 ? 'timeAttack' : 'choice',
      prompt,
      visualEmojis: ['🟩'],
      correct,
      distractors: generateDistractors(correct, correct + 30, 3),
      difficulty,
      timeLimit: difficulty === 3 ? 20 : undefined,
    })
  }

  // triangle — perimeter only (all sides given)
  const a = randomInt(2, maxSide)
  const b = randomInt(2, maxSide)
  const c = randomInt(2, maxSide)
  const perimeter = a + b + c
  return buildQuestion({
    topic: 'geometry',
    interactionMode: 'choice',
    prompt: `Tam giác có 3 cạnh: ${a} cm, ${b} cm, ${c} cm. Chu vi là bao nhiêu cm?`,
    visualEmojis: ['🔺'],
    correct: perimeter,
    distractors: generateDistractors(perimeter, perimeter + 15, 3),
    difficulty,
  })
}
