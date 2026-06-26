import { Question, DragDropData } from '@/types/question'

interface SortTask {
  zone1: { label: string; emoji: string }
  zone2: { label: string; emoji: string }
  items: Array<{ emoji: string; zoneId: string }>
}

const SORT_TASKS = {
  1: [
    {
      zone1: { label: 'Động vật 🐾', emoji: '🐾' },
      zone2: { label: 'Thực vật 🌿', emoji: '🌿' },
      items: [
        { emoji: '🐶', zoneId: 'zone1' },
        { emoji: '🌳', zoneId: 'zone2' },
        { emoji: '🐱', zoneId: 'zone1' },
        { emoji: '🌺', zoneId: 'zone2' },
      ],
    },
    {
      zone1: { label: 'Quả tươi 🍎', emoji: '🍎' },
      zone2: { label: 'Rau xanh 🥬', emoji: '🥬' },
      items: [
        { emoji: '🍎', zoneId: 'zone1' },
        { emoji: '🥬', zoneId: 'zone2' },
        { emoji: '🍌', zoneId: 'zone1' },
        { emoji: '🥕', zoneId: 'zone2' },
        { emoji: '🍊', zoneId: 'zone1' },
      ],
    },
  ],
  2: [
    {
      zone1: { label: 'Tròn 🔴', emoji: '🔴' },
      zone2: { label: 'Vuông 🟦', emoji: '🟦' },
      items: [
        { emoji: '🔴', zoneId: 'zone1' },
        { emoji: '🟦', zoneId: 'zone2' },
        { emoji: '🟠', zoneId: 'zone1' },
        { emoji: '🟪', zoneId: 'zone2' },
        { emoji: '🔵', zoneId: 'zone1' },
        { emoji: '🟨', zoneId: 'zone2' },
      ],
    },
    {
      zone1: { label: 'Nóng ☀️', emoji: '☀️' },
      zone2: { label: 'Lạnh ❄️', emoji: '❄️' },
      items: [
        { emoji: '🔥', zoneId: 'zone1' },
        { emoji: '❄️', zoneId: 'zone2' },
        { emoji: '☀️', zoneId: 'zone1' },
        { emoji: '⛄', zoneId: 'zone2' },
      ],
    },
  ],
  3: [
    {
      zone1: { label: 'Ăn được 🍽️', emoji: '🍽️' },
      zone2: { label: 'Mặc được 👕', emoji: '👕' },
      items: [
        { emoji: '🍕', zoneId: 'zone1' },
        { emoji: '👔', zoneId: 'zone2' },
        { emoji: '🍔', zoneId: 'zone1' },
        { emoji: '🧢', zoneId: 'zone2' },
        { emoji: '🥗', zoneId: 'zone1' },
        { emoji: '👗', zoneId: 'zone2' },
      ],
    },
    {
      zone1: { label: 'Trong nhà 🏠', emoji: '🏠' },
      zone2: { label: 'Ngoài trời 🌳', emoji: '🌳' },
      items: [
        { emoji: '🛋️', zoneId: 'zone1' },
        { emoji: '🌊', zoneId: 'zone2' },
        { emoji: '🛏️', zoneId: 'zone1' },
        { emoji: '⛰️', zoneId: 'zone2' },
        { emoji: '🪑', zoneId: 'zone1' },
      ],
    },
  ],
}

export function generateLogicSort(difficulty: 1 | 2 | 3): Question {
  const tasks = SORT_TASKS[difficulty]
  const task = tasks[Math.floor(Math.random() * tasks.length)]

  const dragItems = task.items.map(item => ({
    id: item.emoji,
    label: item.emoji,
    emoji: item.emoji,
  }))

  const dropZones = [
    { id: 'zone1', label: task.zone1.label },
    { id: 'zone2', label: task.zone2.label },
  ]

  const correctMapping: Record<string, string> = {}
  task.items.forEach(item => {
    correctMapping[item.emoji] = item.zoneId
  })

  const interactionData: DragDropData = {
    dragItems,
    dropZones,
    correctMapping,
  }

  return {
    id: `logicSort-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic: 'logicSort',
    interactionMode: 'dragDrop',
    prompt: 'Kéo từng vật vào nhóm đúng',
    choices: [], // not used in dragDrop mode
    correctId: '', // not used
    difficulty,
    interactionData,
  }
}
