# Skill: math-generator-skill

## Khi nào trigger
- Viết generator đề toán mới (file mới trong `lib/generators/`)
- Thêm topic/difficulty mới vào generator có sẵn
- Review/debug một generator đang cho ra đề sai

## Cấu trúc file generator chuẩn

Mỗi topic là 1 file trong `lib/generators/<topic>.ts`. Pattern bắt buộc:

```typescript
// lib/generators/addition.ts
import type { Question, Choice } from '@/types/question'

// Each difficulty maps to a numeric constraint
const DIFFICULTY_CONFIG = {
  1: { maxSum: 5 },
  2: { maxSum: 10 },
  3: { maxSum: 20 },
} as const

export function generateAddition(difficulty: 1 | 2 | 3 = 1): Question {
  const config = DIFFICULTY_CONFIG[difficulty]
  const a = randomInt(0, config.maxSum)
  const b = randomInt(0, config.maxSum - a)
  const correct = a + b

  return buildQuestion({
    topic: 'addition',
    prompt: `${a} + ${b} = ?`,
    visualEmojis: buildCountingEmojis(a, b),   // optional
    correct,
    distractors: generateDistractors(correct, config.maxSum, 3),
    difficulty,
  })
}
```

## Helper functions (đặt trong lib/generators/index.ts)

```typescript
// Returns a random integer in [min, max] inclusive
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generates N wrong-but-plausible choices, no negatives, no duplicates
export function generateDistractors(correct: number, max: number, count: number): number[] {
  const pool = new Set<number>()
  const attempts = count * 10
  let i = 0
  while (pool.size < count && i < attempts) {
    i++
    const offset = randomInt(1, Math.min(3, max))
    const sign = Math.random() > 0.5 ? 1 : -1
    const candidate = correct + sign * offset
    if (candidate >= 0 && candidate !== correct) pool.add(candidate)
  }
  // Fallback: fill with sequential if pool not full
  let fill = correct + 1
  while (pool.size < count) { if (fill !== correct) pool.add(fill); fill++ }
  return Array.from(pool)
}

// Shuffles choices so correct answer is not always first
export function buildChoices(correct: number, distractors: number[]): { choices: Choice[], correctId: string } {
  const all = [correct, ...distractors].map((n, i) => ({
    id: `c-${i}`,
    label: String(n),
    value: n,
  }))
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const correctChoice = all.find(c => c.value === correct)!
  return {
    choices: all.map(({ id, label }) => ({ id, label })),
    correctId: correctChoice.id,
  }
}

// Builds the full Question object
export function buildQuestion(params: {
  topic: string
  prompt: string
  visualEmojis?: string[]
  correct: number
  distractors: number[]
  difficulty: 1 | 2 | 3
}): Question {
  const { choices, correctId } = buildChoices(params.correct, params.distractors)
  return {
    id: `${params.topic}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: params.topic,
    prompt: params.prompt,
    visualEmojis: params.visualEmojis,
    choices,
    correctId,
    difficulty: params.difficulty,
  }
}
```

## Factory (lib/generators/index.ts)

```typescript
import { generateCounting } from './counting'
import { generateAddition } from './addition'
import type { Question } from '@/types/question'
import type { Topic, AgeGroup } from '@/types/topic'

// Maps ageGroup to default difficulty for each topic
const AGE_DIFFICULTY: Record<AgeGroup, 1 | 2 | 3> = {
  '3-4': 1,
  '5-6': 1,
  '7-8': 2,
  '9-10': 3,
}

export function generateQuestion(topic: Topic, ageGroup: AgeGroup): Question {
  const difficulty = AGE_DIFFICULTY[ageGroup]
  switch (topic) {
    case 'counting': return generateCounting(difficulty)
    case 'addition': return generateAddition(difficulty)
    // add more cases as topics grow
    default: throw new Error(`Unknown topic: ${topic}`)
  }
}

// Generates a full session (array of N unique questions)
export function generateSession(topic: Topic, ageGroup: AgeGroup, count: number): Question[] {
  return Array.from({ length: count }, () => generateQuestion(topic, ageGroup))
}
```

## Quy tắc viết generator

1. **Distractor phải hợp lý:** Không âm, không bằng đáp án đúng, chênh lệch ≤ 3 so với đáp án (tránh quá dễ đoán)
2. **Shuffle choices:** Đáp án đúng không bao giờ ở vị trí cố định
3. **ID câu hỏi phải unique:** Dùng `Date.now() + random` để tránh trùng trong session
4. **Visual emoji optional:** Bắt buộc cho nhóm 3-4 tuổi (`counting`, `shapes`), optional cho 5-6 tuổi
5. **DIFFICULTY_CONFIG rõ ràng:** Mỗi generator tự định nghĩa mapping difficulty → constraint, đừng hardcode magic number
6. **Không có side effect:** Generator là pure function — không đọc store, không gọi API

## Số lượng choices theo nhóm tuổi

| Nhóm tuổi | Số choices |
|-----------|-----------|
| 3-4 tuổi | 3 choices (1 đúng + 2 sai) |
| 5-6 tuổi | 4 choices (1 đúng + 3 sai) |
| 7+ tuổi | 4 choices hoặc nhập tay |

## Test cho generator

Mỗi generator phải có test file `lib/generators/__tests__/<topic>.test.ts`:

```typescript
// Minimal test checklist:
// 1. Output có đúng shape (id, topic, prompt, choices, correctId, difficulty)?
// 2. correctId có tồn tại trong choices không?
// 3. Có đúng số choices không?
// 4. Chạy 100 lần, không có đáp án âm không?
// 5. Chạy 100 lần, choices không bao giờ toàn trùng nhau không?

describe('generateAddition', () => {
  it('always produces a valid question shape', () => {
    const q = generateAddition(1)
    expect(q.choices.find(c => c.id === q.correctId)).toBeDefined()
    expect(q.choices.length).toBe(3)
  })

  it('never produces negative answers', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateAddition(1)
      q.choices.forEach(c => expect(Number(c.label)).toBeGreaterThanOrEqual(0))
    }
  })
})
```
