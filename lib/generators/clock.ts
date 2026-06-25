import type { Question, Choice } from '@/types/question'
import type { ClockDragData } from '@/types/question'
import { randomInt } from './index'

// Difficulty 1: whole hours only   2: half hours   3: quarter hours
const MINUTE_OPTIONS = {
  1: [0],
  2: [0, 30],
  3: [0, 15, 30, 45],
} as const

function formatTime(hour: number, minute: number): string {
  const h = String(hour)
  const m = minute === 0 ? '00' : String(minute)
  return `${h}:${m}`
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 7)
}

function buildDistractorTimes(
  correctHour: number,
  correctMinute: number,
  minutePool: readonly number[],
  count: number
): Array<{ hour: number; minute: number }> {
  const pool: Array<{ hour: number; minute: number }> = []
  const correctStr = formatTime(correctHour, correctMinute)
  let attempts = count * 30
  while (pool.length < count && attempts > 0) {
    attempts--
    const h = randomInt(1, 12)
    const m = minutePool[randomInt(0, minutePool.length - 1)]
    const str = formatTime(h, m)
    if (str !== correctStr && !pool.some(p => formatTime(p.hour, p.minute) === str)) {
      pool.push({ hour: h, minute: m })
    }
  }
  return pool
}

export function generateClock(difficulty: 1 | 2 | 3 = 2): Question {
  const minutePool = MINUTE_OPTIONS[difficulty]
  const targetHour = randomInt(1, 12)
  const targetMinute = minutePool[randomInt(0, minutePool.length - 1)]
  const correctLabel = formatTime(targetHour, targetMinute)

  const distractors = buildDistractorTimes(targetHour, targetMinute, minutePool, 3)
  const allTimes = [
    { hour: targetHour, minute: targetMinute },
    ...distractors,
  ]

  // Shuffle
  for (let i = allTimes.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[allTimes[i], allTimes[j]] = [allTimes[j], allTimes[i]]
  }

  const choices: Choice[] = allTimes.map((t, i) => ({
    id: `c-${i}`,
    label: formatTime(t.hour, t.minute),
  }))
  const correctId = choices.find(c => c.label === correctLabel)!.id

  const interactionData: ClockDragData = {
    type: 'clockDrag',
    targetHour,
    targetMinute,
  }

  return {
    id: `clock-${Date.now()}-${makeId()}`,
    topic: 'clock',
    interactionMode: 'clockDrag',
    prompt: 'Đồng hồ này chỉ mấy giờ?',
    visualEmojis: undefined,
    choices,
    correctId,
    difficulty,
    interactionData,
  }
}
