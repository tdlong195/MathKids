import type { Question } from '@/types/question'
import type { OrderingData } from '@/types/question'
import { randomInt } from './index'

const SIZE_SETS = [
  [
    { emoji: '🐭', label: 'chuột' },
    { emoji: '🐱', label: 'mèo' },
    { emoji: '🦁', label: 'sư tử' },
  ],
  [
    { emoji: '🌱', label: 'mầm' },
    { emoji: '🌿', label: 'cây' },
    { emoji: '🌳', label: 'cây to' },
  ],
  [
    { emoji: '🐣', label: 'gà con' },
    { emoji: '🐔', label: 'gà mái' },
    { emoji: '🦅', label: 'đại bàng' },
  ],
  [
    { emoji: '🍓', label: 'dâu' },
    { emoji: '🍎', label: 'táo' },
    { emoji: '🎃', label: 'bí ngô' },
  ],
  [
    { emoji: '🐛', label: 'sâu' },
    { emoji: '🐸', label: 'ếch' },
    { emoji: '🐊', label: 'cá sấu' },
  ],
]

function makeId(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function generateSizeOrdering(difficulty: 1 | 2 | 3 = 1): Question {
  const set = SIZE_SETS[randomInt(0, SIZE_SETS.length - 1)]
  // direction: asc = small→big; difficulty 3 may reverse
  const direction = difficulty === 3 && Math.random() < 0.4 ? 'desc' : 'asc'
  const promptDir = direction === 'asc' ? 'nhỏ đến to' : 'to đến nhỏ'

  const items = set.map((s, i) => ({
    id: `item-${makeId()}`,
    emoji: s.emoji,
    sizeRank: i + 1,  // 1 = smallest
  }))

  // Shuffle display order
  const shuffled = [...items].sort(() => Math.random() - 0.5)

  const interactionData: OrderingData = {
    type: 'ordering',
    items: shuffled,
    direction,
  }

  return {
    id: `sizeOrdering-${Date.now()}-${makeId()}`,
    topic: 'sizeOrdering',
    interactionMode: 'ordering',
    prompt: `Sắp xếp từ ${promptDir} nhé! 🎯`,
    visualEmojis: undefined,
    choices: [],
    correctId: '',
    difficulty,
    interactionData,
  }
}
