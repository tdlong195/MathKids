import { Question, Choice } from '@/types/question'

interface Analogy {
  a: string
  aRel: string
  b: string
  bRel: string
  distractors: string[]
}

const ANALOGIES = {
  1: [
    { a: '🐶', aRel: 'sủa', b: '🐱', bRel: 'kêu', distractors: ['ăn', 'ngủ', 'chạy'] },
    { a: '🍕', aRel: 'ăn', b: '💧', bRel: 'uống', distractors: ['nấu', 'mua', 'làm'] },
    { a: '🌙', aRel: 'đêm', b: '☀️', bRel: 'ngày', distractors: ['sáng', 'tối', 'chiều'] },
    { a: '📚', aRel: 'đọc', b: '🖊️', bRel: 'viết', distractors: ['vẽ', 'xóa', 'ghi'] },
  ],
  2: [
    { a: '🐦', aRel: 'bay', b: '🐟', bRel: 'bơi', distractors: ['chạy', 'bò', 'nhảy'] },
    { a: '❄️', aRel: 'lạnh', b: '🔥', bRel: 'nóng', distractors: ['ấm', 'khô', 'ẩm'] },
    { a: '🥕', aRel: 'cắn', b: '🍲', bRel: 'uống', distractors: ['ăn', 'nếm', 'chuốc'] },
    { a: '👂', aRel: 'nghe', b: '👁️', bRel: 'nhìn', distractors: ['thấy', 'xem', 'chú ý'] },
    { a: '🚗', aRel: 'chạy', b: '🚂', bRel: 'chạy', distractors: ['đi', 'lăn', 'trượt'] },
  ],
  3: [
    { a: '👶', aRel: 'mẹ', b: '🐔', bRel: 'gà mẹ', distractors: ['gà cựu', 'gà mái', 'gà trống'] },
    { a: '🌱', aRel: 'cây', b: '⭐', bRel: 'sao', distractors: ['mặt trăng', 'thiên hà', 'vũ trụ'] },
    { a: '🍏', aRel: 'đỏ', b: '🍌', bRel: 'vàng', distractors: ['xanh', 'cam', 'tím'] },
    { a: '🏠', aRel: 'người', b: '🦊', bRel: 'chó', distractors: ['mèo', 'thỏ', 'gấu'] },
    { a: '✂️', aRel: 'cắt', b: '🪡', bRel: 'may', distractors: ['khâu', 'sợi', 'vải'] },
  ],
}

export function generateAnalogies(difficulty: 1 | 2 | 3): Question {
  const analogies = ANALOGIES[difficulty]
  const analogy = analogies[Math.floor(Math.random() * analogies.length)]

  const choices: Choice[] = [
    { id: 'correct', label: analogy.bRel },
    { id: 'd1', label: analogy.distractors[0] },
    { id: 'd2', label: analogy.distractors[1] },
    { id: 'd3', label: analogy.distractors[2] },
  ].sort(() => Math.random() - 0.5)

  return {
    id: `analogyThinking-${Date.now()}`,
    topic: 'analogyThinking',
    interactionMode: 'choice',
    prompt: `${analogy.a} ${analogy.aRel}, ${analogy.b} ...?`,
    visualEmojis: [analogy.a, analogy.b],
    choices,
    correctId: choices.find(c => c.label === analogy.bRel)?.id || 'correct',
    difficulty,
  }
}
