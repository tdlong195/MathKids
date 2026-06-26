import type { Question } from '@/types/question'
import { buildQuestion } from './index'
import { randomInt } from './index'

export function generateSubitizing(difficulty: 1 | 2 | 3): Question {
  let itemCount: number
  let displayDuration: number

  if (difficulty === 1) {
    itemCount = randomInt(2, 5)
    displayDuration = 1200
  } else if (difficulty === 2) {
    itemCount = randomInt(3, 7)
    displayDuration = 1000
  } else {
    itemCount = randomInt(4, 9)
    displayDuration = 800
  }

  const emojis = ['🎈', '⭐', '🎁', '🍎', '🌟', '🎀', '🧸', '🎊', '🎉']
  const selectedEmoji = emojis[randomInt(0, emojis.length - 1)]
  const visualEmojis = Array(itemCount).fill(selectedEmoji)

  const candidates = [itemCount - 2, itemCount - 1, itemCount + 1, itemCount + 2]
    .filter(n => n > 0 && n <= 10 && n !== itemCount)

  const distractors = candidates.slice(0, 2)
  if (distractors.length < 2) {
    const remaining = [itemCount - 3, itemCount + 3].filter(n => n > 0 && n <= 10 && n !== itemCount)
    distractors.push(...remaining)
  }

  const params = {
    topic: 'subitizing',
    interactionMode: 'choice' as const,
    prompt: `Chớp mắt 1 giây. Có mấy ${selectedEmoji}?`,
    visualEmojis,
    correct: itemCount,
    distractors: distractors.slice(0, 2),
    difficulty,
    timeLimit: displayDuration + 3000,
  }

  return buildQuestion(params)
}
