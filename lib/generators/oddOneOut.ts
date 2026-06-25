import { Question, Choice } from '@/types/question'

const CATEGORIES = {
  1: [
    { name: 'animals', items: ['🐶', '🐱', '🦁', '🐸'] },
    { name: 'fruits', items: ['🍎', '🍌', '🍊', '🍇'] },
    { name: 'vehicles', items: ['🚗', '🚙', '🚕', '✈️'] },
    { name: 'colors', items: ['🔴', '🟢', '🔵', '🟡'] },
  ],
  2: [
    { name: 'shapes', items: ['🔷', '🔶', '⬛', '🔺'] },
    { name: 'school', items: ['📚', '✏️', '🎒', '🎨'] },
    { name: 'food', items: ['🍕', '🍔', '🌮', '🍰'] },
    { name: 'emotions', items: ['😊', '😢', '😡', '😴'] },
  ],
  3: [
    { name: 'jobs', items: ['👨‍⚕️', '👨‍🎓', '👨‍🚒', '👨‍🌾'] },
    { name: 'nature', items: ['🌳', '🌺', '🌊', '🪨'] },
    { name: 'weather', items: ['☀️', '🌧️', '⛅', '🌬️'] },
    { name: 'sports', items: ['⚽', '🏀', '🎾', '🎪'] },
  ],
}

export function generateOddOneOut(difficulty: 1 | 2 | 3): Question {
  const categories = CATEGORIES[difficulty]
  const category = categories[Math.floor(Math.random() * categories.length)]

  const mainItems = category.items.slice(0, 3)
  let oddItem: string

  if (difficulty === 1) {
    const otherCategories = categories.filter(c => c.name !== category.name)
    const otherCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)]
    oddItem = otherCategory.items[0]
  } else {
    const otherCategories = CATEGORIES[difficulty === 2 ? 1 : 2]
    const otherCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)]
    oddItem = otherCategory.items[0]
  }

  const allItems = [...mainItems, oddItem]
  const shuffled = allItems.sort(() => Math.random() - 0.5)

  const choices: Choice[] = shuffled.map((emoji, i) => ({
    id: emoji === oddItem ? 'correct' : `d${i}`,
    label: emoji,
  }))

  return {
    id: `oddOneOut-${Date.now()}`,
    topic: 'oddOneOut',
    interactionMode: 'choice',
    prompt: 'Cái nào khác loại?',
    visualEmojis: shuffled,
    choices,
    correctId: choices.find(c => c.label === oddItem)?.id || 'correct',
    difficulty,
  }
}
