import { Question, Choice } from '@/types/question'

const EMOJI_SETS = {
  colors: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🦊', '🐸'],
  objects: ['🍎', '🍌', '🍊', '💎', '💛', '⭐'],
}

type PatternType = 'cyclic' | 'alternating'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomEmojis(count: number): string[] {
  const allEmojis = Object.values(EMOJI_SETS).flat()
  const selected = new Set<string>()
  while (selected.size < count) {
    selected.add(allEmojis[randomInt(0, allEmojis.length - 1)])
  }
  return Array.from(selected)
}

function getDistractors(correctEmoji: string, usedEmojis: string[]): string[] {
  const allEmojis = Object.values(EMOJI_SETS)
    .flat()
    .filter(e => !usedEmojis.includes(e))
  const distractors = new Set<string>()
  let attempts = 30
  while (distractors.size < 3 && attempts > 0) {
    attempts--
    const idx = randomInt(0, allEmojis.length - 1)
    distractors.add(allEmojis[idx])
  }
  return Array.from(distractors)
}

// Pattern Type 1: Cyclic (🔴🔵🔴🔵🔴🔵...)
function generateCyclic(emojis: string[], length: number): string[] {
  const pattern: string[] = []
  for (let i = 0; i < length; i++) {
    pattern.push(emojis[i % emojis.length])
  }
  return pattern
}

// Pattern Type 2: Alternating with increasing frequency (🔴 🔵🔵 🔴 🔵🔵...)
function generateAlternating(emojis: string[], length: number): string[] {
  const pattern: string[] = []
  let idx = 0
  let count = 1
  while (pattern.length < length) {
    for (let i = 0; i < count && pattern.length < length; i++) {
      pattern.push(emojis[idx % emojis.length])
    }
    idx++
    if (idx % 2 === 0) count++
  }
  return pattern
}

export function generatePatternSeq(difficulty: 1 | 2 | 3): Question {
  const patternTypes: PatternType[] = ['cyclic', 'alternating']
  const selectedType = patternTypes[randomInt(0, patternTypes.length - 1)]

  let emojis: string[]
  let pattern: string[]
  let patternLength: number

  if (difficulty === 1) {
    emojis = getRandomEmojis(2)
    patternLength = 6
  } else if (difficulty === 2) {
    emojis = getRandomEmojis(3)
    patternLength = 9
  } else {
    emojis = getRandomEmojis(4)
    patternLength = 12
  }

  // Generate pattern based on type
  switch (selectedType) {
    case 'cyclic':
      pattern = generateCyclic(emojis, patternLength)
      break
    case 'alternating':
      pattern = generateAlternating(emojis, patternLength)
      break
  }

  const correctEmoji = pattern[0]
  const distractors = getDistractors(correctEmoji, [...pattern])

  const choices: Choice[] = [
    { id: 'correct', label: correctEmoji },
    { id: 'd1', label: distractors[0] },
    { id: 'd2', label: distractors[1] },
    { id: 'd3', label: distractors[2] },
  ].sort(() => Math.random() - 0.5)

  return {
    id: `patternSeq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic: 'patternSeq',
    interactionMode: 'choice',
    prompt: 'Ô ❓ là gì?',
    visualEmojis: [...pattern, '❓'],
    choices,
    correctId: choices.find(c => c.label === correctEmoji)?.id || 'correct',
    difficulty,
  }
}
