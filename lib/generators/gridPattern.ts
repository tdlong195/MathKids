import { Question, Choice } from '@/types/question'

const EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '💛']

function generate2x2Grid(difficulty: 1): string[] {
  const emojis = EMOJIS.slice(0, 2)
  return [
    emojis[0], emojis[1],
    emojis[1], emojis[0],
  ]
}

function generate3x3Grid(difficulty: 2 | 3): string[] {
  if (difficulty === 2) {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const row1 = [emoji, emoji, emoji]
    const row2 = [emoji, emoji, emoji]
    const row3 = [emoji, emoji, emoji]
    return [...row1, ...row2, ...row3]
  }

  const emojis = EMOJIS.slice(0, 3)
  const grid: string[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      grid.push(emojis[(row + col) % 3])
    }
  }
  return grid
}

export function generateGridPattern(difficulty: 1 | 2 | 3): Question {
  let grid: string[]
  let gridSize: 2 | 3
  let missingIdx: number

  if (difficulty === 1) {
    grid = generate2x2Grid(1)
    gridSize = 2
    missingIdx = Math.floor(Math.random() * 4)
  } else {
    grid = generate3x3Grid(difficulty as 2 | 3)
    gridSize = 3
    missingIdx = Math.floor(Math.random() * 9)
  }

  const correctAnswer = grid[missingIdx]
  const gridWithMissing = grid.map((emoji, idx) => (idx === missingIdx ? '❓' : emoji))

  const distractors: string[] = []
  for (const emoji of EMOJIS) {
    if (emoji !== correctAnswer && distractors.length < 3) {
      distractors.push(emoji)
    }
  }

  const choices: Choice[] = [
    { id: 'correct', label: correctAnswer },
    { id: 'd1', label: distractors[0] },
    { id: 'd2', label: distractors[1] },
    { id: 'd3', label: distractors[2] },
  ].sort(() => Math.random() - 0.5)

  const gridLabel = gridSize === 2 ? '2×2' : '3×3'
  return {
    id: `gridPattern-${Date.now()}`,
    topic: 'gridPattern',
    interactionMode: 'choice',
    prompt: `Ô ❓ trong lưới ${gridLabel} là gì?`,
    visualEmojis: gridWithMissing,
    choices,
    correctId: choices.find(c => c.label === correctAnswer)?.id || 'correct',
    difficulty,
  }
}
