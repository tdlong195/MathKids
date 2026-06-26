import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

export function generateTwoDigitDecompose(difficulty: 1 | 2 | 3): Question {
  let twoDigitNum: number

  if (difficulty === 1) {
    twoDigitNum = randomInt(10, 15)
  } else if (difficulty === 2) {
    twoDigitNum = randomInt(15, 25)
  } else {
    twoDigitNum = randomInt(20, 30)
  }

  const tens = Math.floor(twoDigitNum / 10)
  const ones = twoDigitNum % 10

  const askForTens = Math.random() > 0.5

  const prompt = askForTens
    ? `${twoDigitNum} = ? chục + ${ones} đơn vị`
    : `${twoDigitNum} = ${tens} chục + ? đơn vị`

  const correct = askForTens ? tens : ones

  const distractors = [correct - 1, correct + 1, correct - 2, correct + 2]
    .filter(n => n >= 0 && n <= 10 && n !== correct)
    .slice(0, 2)

  const params = {
    topic: 'twoDigitDecompose',
    interactionMode: 'choice' as const,
    prompt,
    correct,
    distractors,
    difficulty,
  }

  return buildQuestion(params)
}
