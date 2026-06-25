import { Question, Choice } from '@/types/question'

const EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '💛', '💚', '💙']

const DIFFICULTY_CONFIG: Record<1 | 2 | 3, { cycleLength: number; patternLength: number; startOffset?: boolean }> = {
  1: { cycleLength: 2, patternLength: 6 },
  2: { cycleLength: 3, patternLength: 9 },
  3: { cycleLength: 3, patternLength: 9, startOffset: true },
}

function generatePattern(cycleLength: number, patternLength: number, startOffset?: boolean): string[] {
  const baseEmojis = EMOJIS.slice(0, cycleLength)
  const pattern: string[] = []
  let startIdx = 0
  if (startOffset) startIdx = Math.floor(Math.random() * cycleLength)

  for (let i = 0; i < patternLength; i++) {
    pattern.push(baseEmojis[(startIdx + i) % cycleLength])
  }
  return pattern
}

function getDistractors(correctEmoji: string, allEmojis: string[]): string[] {
  const pool = allEmojis.filter(e => e !== correctEmoji)
  const distractors = new Set<string>()
  let attempts = 30
  while (distractors.size < 3 && attempts > 0) {
    attempts--
    const idx = Math.floor(Math.random() * pool.length)
    distractors.add(pool[idx])
  }
  return Array.from(distractors)
}

export function generatePatternSeq(difficulty: 1 | 2 | 3): Question {
  const config = DIFFICULTY_CONFIG[difficulty]
  const pattern = generatePattern(config.cycleLength, config.patternLength, config.startOffset)

  const correctEmoji = pattern[0]
  const distractors = getDistractors(correctEmoji, EMOJIS)

  const choices: Choice[] = [
    { id: 'correct', label: correctEmoji },
    { id: 'd1', label: distractors[0] },
    { id: 'd2', label: distractors[1] },
    { id: 'd3', label: distractors[2] },
  ].sort(() => Math.random() - 0.5)

  return {
    id: `patternSeq-${Date.now()}`,
    topic: 'patternSeq',
    interactionMode: 'choice',
    prompt: 'Ô ❓ là gì?',
    visualEmojis: [...pattern, '❓'],
    choices,
    correctId: choices.find(c => c.label === correctEmoji)?.id || 'correct',
    difficulty,
  }
}
