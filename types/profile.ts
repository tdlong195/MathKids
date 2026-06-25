import type { AgeGroup } from './topic'

export interface TopicHistory {
  topic: string
  correct: number
  wrong: number
  lastPlayed: number
}

export interface Profile {
  id: string
  name: string
  avatar: string
  ageGroup: AgeGroup
  stars: number
  history: TopicHistory[]
  createdAt: number
  currentStreak: number
  lastPlayedDate: string // ISO date: "2026-06-24"
  longestStreak?: number
  unlockedAchievements: string[] // achievement IDs
}
