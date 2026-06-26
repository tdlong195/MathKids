import type { Question } from '@/types/question'
import { buildQuestion, randomInt } from './index'

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
  { animal: 'cows', emoji: '🐄', sound: 'bò kêu', soundFile: 'cow' },
  { animal: 'lợn', emoji: '🐷', sound: 'lợn kêu', soundFile: 'pig' },
]

export function generateSoundMatching(difficulty: 1 | 2 | 3): Question {
  const targetMatch = soundMatches[randomInt(0, soundMatches.length - 1)]

  const otherMatches = soundMatches
    .filter(match => match.animal !== targetMatch.animal)
    .slice(0, 3)

  const choices = [targetMatch, ...otherMatches]
    .sort(() => Math.random() - 0.5)

  const params = {
    topic: 'soundMatching',
    interactionMode: 'choice' as const,
    prompt: `Nghe âm thanh: "${targetMatch.sound}". Chọn con vật nào?`,
    visualEmojis: choices.map(m => m.emoji),
    correct: targetMatch.emoji,
    distractors: otherMatches.map(m => m.emoji),
    difficulty,
    timeLimit: 5000,
  }

  return buildQuestion(params)
}
