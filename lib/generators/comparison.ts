import type { Question, Choice } from '@/types/question'
import { randomInt } from './index'

const DIFFICULTY_CONFIG = {
  1: { max: 10 },
  2: { max: 20 },
  3: { max: 50 },
} as const

// Symbols presented as choices
const SYMBOLS: Choice[] = [
  { id: 'lt', label: '<' },
  { id: 'gt', label: '>' },
  { id: 'eq', label: '=' },
]

const VISUAL_EMOJIS = ['🍎', '🌟', '🎈', '🦋', '🐶']

export function generateComparison(difficulty: 1 | 2 | 3 = 1): Question {
  const { max } = DIFFICULTY_CONFIG[difficulty]

  const makeEqual = Math.random() < 0.2
  const a = randomInt(0, max)
  const b = makeEqual ? a : randomInt(0, max)

  let correctSymbolId: string
  if (a < b) correctSymbolId = 'lt'
  else if (a > b) correctSymbolId = 'gt'
  else correctSymbolId = 'eq'

  // For youngest group: show emoji groups so bé can visually count
  const emoji = VISUAL_EMOJIS[Math.floor(Math.random() * VISUAL_EMOJIS.length)]
  // Two different emoji types visually separate the groups without a separator
  // character that would receive the same animation treatment as real emoji items
  const visualEmojis = difficulty === 1 && a <= 5 && b <= 5
    ? [...Array(a).fill(emoji), ...Array(b).fill('⭐')]
    : undefined

  return {
    id: `comparison-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: 'comparison',
    interactionMode: 'choice',
    prompt: `${a}  ?  ${b}`,
    visualEmojis,
    choices: SYMBOLS,
    correctId: correctSymbolId,
    difficulty,
  }
}
