import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

export function generateOneMoreLess(difficulty: 1 | 2 | 3): Question {
  let startNum: number
  let isMore: boolean

  if (difficulty === 1) {
    startNum = randomInt(2, 8)
  } else if (difficulty === 2) {
    startNum = randomInt(3, 15)
  } else {
    startNum = randomInt(5, 18)
  }

  isMore = Math.random() > 0.5

  const resultNum = isMore ? startNum + 1 : startNum - 1
  const emojis = ['🍎', '🎈', '⭐', '🧸', '🍪', '🎁']
  const selectedEmoji = emojis[randomInt(0, emojis.length - 1)]

  const visualEmojis = Array(startNum).fill(selectedEmoji)

  const candidates = [resultNum - 2, resultNum - 1, resultNum + 1, resultNum + 2]
    .filter(n => n > 0 && n <= 20 && n !== resultNum)

  const distractors = candidates.slice(0, 2)
  if (distractors.length < 2) {
    const remaining = [resultNum - 3, resultNum + 3].filter(n => n > 0 && n <= 20)
    distractors.push(...remaining)
  }

  const action = isMore ? 'thêm 1' : 'bớt đi 1'
  const prompt = `Có ${startNum} ${selectedEmoji}. ${action}. Bây giờ có mấy?`

  const params = {
    topic: 'oneMoreLess',
    interactionMode: 'choice' as const,
    prompt,
    visualEmojis,
    correct: resultNum,
    distractors: distractors.slice(0, 2),
    difficulty,
  }

  return buildQuestion(params)
}
