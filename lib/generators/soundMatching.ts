import type { Question } from '@/types/question'
import { randomInt } from './index'

interface SoundMatch {
  animal: string
  emoji: string
  sound: string
  soundFile: string
}

const soundMatches: SoundMatch[] = [
  { animal: 'mèo', emoji: '🐱', sound: 'mèo kêu', soundFile: 'cat' },
  { animal: 'chó', emoji: '🐶', sound: 'chó sủa', soundFile: 'dog' },
  { animal: 'gà', emoji: '🐔', sound: 'gà gáy', soundFile: 'rooster' },
  { animal: 'vịt', emoji: '🦆', sound: 'vịt kêu', soundFile: 'duck' },
  { animal: 'sư tử', emoji: '🦁', sound: 'sư tử gầm', soundFile: 'lion' },
  { animal: 'voi', emoji: '🐘', sound: 'voi kêu', soundFile: 'elephant' },
  { animal: 'bò', emoji: '🐄', sound: 'bò kêu', soundFile: 'cow' },
  { animal: 'lợn', emoji: '🐷', sound: 'lợn kêu', soundFile: 'pig' },
]

export function generateSoundMatching(difficulty: 1 | 2 | 3): Question {
  const targetMatch = soundMatches[randomInt(0, soundMatches.length - 1)]

  const otherMatches = soundMatches
    .filter(match => match.animal !== targetMatch.animal)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allChoices = [targetMatch, ...otherMatches].sort(() => Math.random() - 0.5)
  const choices = allChoices.map((match, i) => ({ id: `c-${i}`, label: match.emoji }))
  const correctId = choices.find(c => c.label === targetMatch.emoji)!.id

  return {
    id: `soundMatching-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: 'soundMatching',
    interactionMode: 'choice',
    prompt: `Nghe âm thanh: "${targetMatch.sound}". Chọn con vật nào?`,
    choices,
    correctId,
    difficulty,
    timeLimit: 5000,
  }
}
