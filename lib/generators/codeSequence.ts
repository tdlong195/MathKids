import { Question, OrderingData } from '@/types/question'

interface Sequence {
  title: string
  steps: Array<{ emoji: string; label: string }>
}

const SEQUENCES = {
  2: [
    {
      title: 'Đánh răng',
      steps: [
        { emoji: '🪥', label: 'Lấy bàn chải' },
        { emoji: '⚪', label: 'Bơm kem đánh răng' },
        { emoji: '😁', label: 'Chải răng' },
        { emoji: '💧', label: 'Súc miệng' },
      ],
    },
    {
      title: 'Rửa tay',
      steps: [
        { emoji: '💧', label: 'Bật vòi nước' },
        { emoji: '🧼', label: 'Lấy xà phòng' },
        { emoji: '🤲', label: 'Chà tay' },
        { emoji: '🌊', label: 'Rửa sạch' },
      ],
    },
    {
      title: 'Ăn cơm',
      steps: [
        { emoji: '🍚', label: 'Múc cơm' },
        { emoji: '🍜', label: 'Múc nước' },
        { emoji: '🥄', label: 'Lấy muỗng' },
        { emoji: '😋', label: 'Ăn' },
      ],
    },
  ],
  3: [
    {
      title: 'Chuẩn bị học bài',
      steps: [
        { emoji: '🚪', label: 'Mở cửa phòng' },
        { emoji: '🪑', label: 'Kéo ghế ngồi' },
        { emoji: '📚', label: 'Lấy sách' },
        { emoji: '✏️', label: 'Lấy bút' },
        { emoji: '📖', label: 'Mở sách' },
      ],
    },
    {
      title: 'Trồng cây',
      steps: [
        { emoji: '🌱', label: 'Lấy hạt' },
        { emoji: '🪴', label: 'Lấy chậu' },
        { emoji: '🌍', label: 'Đổ đất' },
        { emoji: '😊', label: 'Bỏ hạt vào' },
        { emoji: '💧', label: 'Tưới nước' },
      ],
    },
    {
      title: 'Làm bánh',
      steps: [
        { emoji: '🥄', label: 'Lấy bột' },
        { emoji: '🥛', label: 'Đổ sữa' },
        { emoji: '🥚', label: 'Đánh trứng' },
        { emoji: '🍳', label: 'Nướng' },
        { emoji: '🎂', label: 'Hoàn thành' },
      ],
    },
  ],
}

export function generateCodeSequence(difficulty: 2 | 3): Question {
  const sequences = SEQUENCES[difficulty]
  const sequence = sequences[Math.floor(Math.random() * sequences.length)]

  const shuffled = sequence.steps
    .map((step, idx) => ({
      id: step.label,
      emoji: step.emoji,
      sizeRank: idx + 1,
    }))
    .sort(() => Math.random() - 0.5)

  const interactionData: OrderingData = {
    items: shuffled,
    direction: 'asc',
  }

  return {
    id: `codeSequence-${Date.now()}`,
    topic: 'codeSequence',
    interactionMode: 'ordering',
    prompt: `Sắp xếp các bước: ${sequence.title}`,
    choices: [],
    correctId: '',
    difficulty,
    interactionData,
  }
}
