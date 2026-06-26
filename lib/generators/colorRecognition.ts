import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

interface ColorItem {
  name: string
  emoji: string
  color: string
}

const colorItems: ColorItem[] = [
  { name: 'táo', emoji: '🍎', color: 'đỏ' },
  { name: 'chuối', emoji: '🍌', color: 'vàng' },
  { name: 'cam', emoji: '🍊', color: 'cam' },
  { name: 'nho', emoji: '🍇', color: 'tím' },
  { name: 'rùa', emoji: '🐢', color: 'xanh lá' },
  { name: 'biển', emoji: '🌊', color: 'xanh dương' },
  { name: 'hoa hướng dương', emoji: '🌻', color: 'vàng' },
  { name: 'hoa hồng', emoji: '🌹', color: 'đỏ' },
  { name: 'vẹt', emoji: '🦜', color: 'xanh lá' },
  { name: 'bươm bướm', emoji: '🦋', color: 'xanh dương' },
]

export function generateColorRecognition(difficulty: 1 | 2 | 3): Question {
  const targetItem = colorItems[randomInt(0, colorItems.length - 1)]

  const otherItems = colorItems
    .filter(item => item.color !== targetItem.color)

  // Ensure at least 2 different-color items + shuffle to avoid picking same color
  const selectedOthers = []
  for (let i = 0; i < Math.min(3, otherItems.length); i++) {
    selectedOthers.push(otherItems[randomInt(0, otherItems.length - 1)])
  }

  const params = {
    topic: 'colorRecognition',
    interactionMode: 'choice' as const,
    prompt: `Tìm vật có màu ${targetItem.color}!`,
    visualEmojis: [targetItem.emoji],
    correct: targetItem.emoji,
    distractors: selectedOthers.map(item => item.emoji),
    difficulty,
  }

  return buildQuestion(params)
}
