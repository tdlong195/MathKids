import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

interface ProblemTemplate {
  build: (a: number, b: number) => { prompt: string; correct: number; emojis?: string[] }
  maxA: number
  maxB: number
  emoji: string
}

const CHARACTERS = ['An', 'Bình', 'Cúc', 'Dũng', 'Em']
const ANIMALS = [
  { name: 'con vịt', emoji: '🦆' },
  { name: 'con cá', emoji: '🐟' },
  { name: 'con bướm', emoji: '🦋' },
  { name: 'con chim', emoji: '🐦' },
  { name: 'con thỏ', emoji: '🐰' },
]
const ITEMS = [
  { name: 'quả táo', emoji: '🍎' },
  { name: 'cái kẹo', emoji: '🍬' },
  { name: 'bông hoa', emoji: '🌸' },
  { name: 'quyển sách', emoji: '📚' },
  { name: 'cái bánh', emoji: '🎂' },
]

const DIFFICULTY_CONFIG = {
  1: { maxSum: 10, maxMinuend: 10 },
  2: { maxSum: 20, maxMinuend: 20 },
  3: { maxSum: 50, maxMinuend: 50 },
} as const

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

export function generateWordProblem(difficulty: 1 | 2 | 3 = 1): Question {
  const { maxSum, maxMinuend } = DIFFICULTY_CONFIG[difficulty]
  const isAddition = Math.random() < 0.5
  const name = pick(CHARACTERS)
  const subject = Math.random() < 0.5 ? pick(ANIMALS) : pick(ITEMS)

  let prompt: string
  let correct: number
  let visualEmojis: string[] | undefined

  if (isAddition) {
    const a = randomInt(1, maxSum - 1)
    const b = randomInt(1, maxSum - a)
    correct = a + b
    prompt = `${name} có ${a} ${subject.name}, được tặng thêm ${b} ${subject.name} nữa. Bây giờ có tất cả mấy ${subject.name}?`
    if (difficulty === 1 && correct <= 10) {
      visualEmojis = Array(correct).fill(subject.emoji)
    }
  } else {
    const a = randomInt(2, maxMinuend)
    const b = randomInt(1, a - 1)
    correct = a - b
    prompt = `${name} có ${a} ${subject.name}, cho đi ${b} ${subject.name}. Còn lại mấy ${subject.name}?`
    if (difficulty === 1 && a <= 10) {
      visualEmojis = Array(a).fill(subject.emoji)
    }
  }

  return buildQuestion({
    topic: 'wordProblem',
    interactionMode: 'choice',
    prompt,
    visualEmojis,
    correct,
    distractors: generateDistractors(correct, maxSum + 5, 3),
    difficulty,
  })
}
