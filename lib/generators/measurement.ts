import type { Question } from '@/types/question'
import { randomInt, buildQuestion, generateDistractors } from './index'

// Simplified: comparison and estimation questions
// Difficulty 1: "cái nào dài hơn?" (visual comparison)
// Difficulty 2: estimate length in cm, choose closest
// Difficulty 3: convert between cm and m (basic)

interface ComparisonPair {
  labelA: string
  labelB: string
  cmA: number
  cmB: number
  emojiA: string
  emojiB: string
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  { labelA: 'bút chì', emojiA: '✏️', cmA: 15, labelB: 'thước kẻ', emojiB: '📏', cmB: 30 },
  { labelA: 'quả dâu', emojiA: '🍓', cmA: 3, labelB: 'quả dưa', emojiB: '🍉', cmB: 30 },
  { labelA: 'con kiến', emojiA: '🐜', cmA: 1, labelB: 'con rắn', emojiB: '🐍', cmB: 100 },
  { labelA: 'tay bé', emojiA: '🤚', cmA: 12, labelB: 'tay bố', emojiB: '🖐️', cmB: 20 },
  { labelA: 'đũa ăn', emojiA: '🥢', cmA: 23, labelB: 'cây gậy', emojiB: '🪄', cmB: 50 },
]

export function generateMeasurement(difficulty: 1 | 2 | 3 = 2): Question {
  if (difficulty === 1) {
    const pair = COMPARISON_PAIRS[randomInt(0, COMPARISON_PAIRS.length - 1)]
    const longerIsA = pair.cmA > pair.cmB

    return {
      id: `measurement-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      topic: 'measurement',
      interactionMode: 'choice',
      prompt: `Cái nào dài hơn?`,
      visualEmojis: [pair.emojiA, pair.emojiB],
      choices: [
        { id: 'a', label: pair.labelA },
        { id: 'b', label: pair.labelB },
      ],
      correctId: longerIsA ? 'a' : 'b',
      difficulty,
    }
  }

  if (difficulty === 2) {
    const pair = COMPARISON_PAIRS[randomInt(0, COMPARISON_PAIRS.length - 1)]
    const correct = pair.cmA
    return buildQuestion({
      topic: 'measurement',
      interactionMode: 'choice',
      prompt: `${pair.emojiA} ${pair.labelA} dài khoảng bao nhiêu cm?`,
      correct,
      distractors: generateDistractors(correct, correct * 3, 3),
      difficulty,
    })
  }

  // difficulty 3: basic unit conversion (cm → m rough)
  const cm = randomInt(1, 5) * 100
  const m = cm / 100
  return buildQuestion({
    topic: 'measurement',
    interactionMode: 'choice',
    prompt: `${cm} cm = ? m`,
    correct: m,
    distractors: generateDistractors(m, m + 5, 3),
    difficulty,
  })
}
