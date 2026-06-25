import type { Question } from '@/types/question'
import { randomInt, generateDistractors, buildQuestion } from './index'

interface ShopItem {
  name: string
  emoji: string
  price: number
}

const ITEMS_EASY: ShopItem[] = [
  { name: 'cây bút', emoji: '✏️', price: 3 },
  { name: 'tẩy', emoji: '🧹', price: 2 },
  { name: 'thước', emoji: '📏', price: 5 },
  { name: 'kẹo', emoji: '🍬', price: 4 },
  { name: 'sticker', emoji: '⭐', price: 1 },
]

const ITEMS_HARD: ShopItem[] = [
  { name: 'sách tô màu', emoji: '📔', price: 12 },
  { name: 'hộp màu', emoji: '🎨', price: 25 },
  { name: 'bóng', emoji: '⚽', price: 18 },
  { name: 'gấu bông', emoji: '🧸', price: 30 },
  { name: 'đồng hồ đồ chơi', emoji: '⌚', price: 45 },
]

export function generateMoney(difficulty: 1 | 2 | 3 = 2): Question {
  const pool = difficulty <= 2 ? ITEMS_EASY : ITEMS_HARD
  const item = pool[randomInt(0, pool.length - 1)]

  if (difficulty === 1) {
    // "Bé có 10 đồng, mua 1 thứ giá X đồng. Còn lại bao nhiêu?"
    const budget = 10
    const change = budget - item.price
    return buildQuestion({
      topic: 'money',
      interactionMode: 'choice',
      prompt: `${item.emoji} Bé có 10 đồng. Mua ${item.name} giá ${item.price} đồng. Còn lại bao nhiêu?`,
      visualEmojis: Array(item.price).fill('🪙'),
      correct: change,
      distractors: generateDistractors(change, budget, 3),
      difficulty,
    })
  }

  if (difficulty === 2) {
    // Total cost of 2 items
    const item2 = pool.filter(i => i.name !== item.name)[randomInt(0, pool.length - 2)]
    const total = item.price + item2.price
    return buildQuestion({
      topic: 'money',
      interactionMode: 'choice',
      prompt: `${item.emoji} ${item.name} giá ${item.price} đồng, ${item2.emoji} ${item2.name} giá ${item2.price} đồng. Mua cả hai hết bao nhiêu?`,
      correct: total,
      distractors: generateDistractors(total, total + 20, 3),
      difficulty,
    })
  }

  // difficulty 3: change from larger budget
  const budget = Math.ceil(item.price / 10) * 10 + randomInt(1, 3) * 10
  const change = budget - item.price
  return buildQuestion({
    topic: 'money',
    interactionMode: 'choice',
    prompt: `${item.emoji} Mua ${item.name} giá ${item.price} đồng, trả ${budget} đồng. Được thối lại bao nhiêu?`,
    correct: change,
    distractors: generateDistractors(change, budget, 3),
    difficulty,
  })
}
