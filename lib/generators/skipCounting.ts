import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

export function generateSkipCounting(difficulty: 1 | 2 | 3): Question {
  let skip: number
  let sequenceLength: number

  if (difficulty === 1) {
    skip = 2
    sequenceLength = 3
  } else if (difficulty === 2) {
    skip = [2, 5][randomInt(0, 1)]
    sequenceLength = 4
  } else {
    skip = [2, 5, 10][randomInt(0, 2)]
    sequenceLength = 5
  }

  const startNum = skip
  const sequence: number[] = []

  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(startNum + i * skip)
  }

  const correctAnswer = sequence[sequenceLength - 1]
  const nextNum = correctAnswer + skip

  const distractors = [
    nextNum - skip,
    nextNum + skip,
    nextNum - 1,
    nextNum + 1,
  ].filter(n => n > 0 && n !== nextNum && !sequence.includes(n))

  const sequenceStr = sequence.join(', ')
  const prompt = `Đếm nhảy ${skip}: ${sequenceStr}, ?`

  const params = {
    topic: 'skipCounting',
    interactionMode: 'choice' as const,
    prompt,
    correct: nextNum,
    distractors: distractors.slice(0, 2),
    difficulty,
  }

  return buildQuestion(params)
}
