import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

export function generateNumberBonds(difficulty: 1 | 2 | 3): Question {
  let wholeNum: number

  if (difficulty === 1) {
    wholeNum = randomInt(3, 5)
  } else if (difficulty === 2) {
    wholeNum = randomInt(5, 8)
  } else {
    wholeNum = randomInt(8, 10)
  }

  const part1 = randomInt(1, wholeNum - 1)
  const part2 = wholeNum - part1

  const emojis = ['🍎', '🎈', '⭐', '🧸', '🍪', '🎁']
  const selectedEmoji = emojis[randomInt(0, emojis.length - 1)]

  const prompt = `${wholeNum} = ${part1} + ?`

  const distractors = [part2 - 1, part2 + 1].filter(n => n > 0 && n <= 10 && n !== part2)

  const params = {
    topic: 'numberBonds',
    interactionMode: 'choice' as const,
    prompt,
    visualEmojis: Array(wholeNum).fill(selectedEmoji),
    correct: part2,
    distractors,
    difficulty,
  }

  return buildQuestion(params)
}
