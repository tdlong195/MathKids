import type { Question } from '@/types/question'
import { randomInt } from './index'

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

  const otherItems = colorItems.filter(item => item.color !== targetItem.color)
  const shuffled = [...otherItems].sort(() => Math.random() - 0.5)
  const selectedOthers = shuffled.slice(0, 3)

  const allChoices = [targetItem, ...selectedOthers].sort(() => Math.random() - 0.5)
  const choices = allChoices.map((item, i) => ({ id: `c-${i}`, label: item.emoji }))
  const correctId = choices.find(c => c.label === targetItem.emoji)!.id

  return {
    id: `colorRecognition-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: 'colorRecognition',
    interactionMode: 'choice',
    prompt: `Tìm vật có màu ${targetItem.color}!`,
    visualEmojis: [targetItem.emoji],
    choices,
    correctId,
    difficulty,
  }
}
