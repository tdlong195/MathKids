import type { Profile, TopicHistory } from '@/types/profile'
import { ACHIEVEMENTS } from '@/types/achievement'
import { TOPIC_META } from '@/types/topic'

const STORAGE_KEY = 'mathkids-profiles'
const SCHEMA_VERSION_KEY = 'mathkids-schema-version'
const CURRENT_SCHEMA_VERSION = 3

function getTodayDateString(): string {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

function calculateStreak(profile: Profile, todayStr: string): { streak: number; longest: number } {
  const lastPlayed = profile.lastPlayedDate
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // If played today, keep streak
  if (lastPlayed === todayStr) {
    return { streak: profile.currentStreak, longest: profile.longestStreak ?? profile.currentStreak }
  }

  // If played yesterday, increment streak
  if (lastPlayed === yesterdayStr) {
    const newStreak = profile.currentStreak + 1
    return { streak: newStreak, longest: Math.max(profile.longestStreak ?? 0, newStreak) }
  }

  // Otherwise, reset streak
  return { streak: 1, longest: profile.longestStreak ?? 0 }
}

export function loadProfiles(): Profile[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const savedVersion = Number(localStorage.getItem(SCHEMA_VERSION_KEY) ?? 0)
    return runMigrations(parsed, savedVersion)
  } catch {
    console.warn('[mathkids] Failed to load profiles, starting fresh')
    return []
  }
}

export function saveProfiles(profiles: Profile[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
}

export function createProfile(
  data: Pick<Profile, 'name' | 'avatar' | 'ageGroup'>
): Profile {
  return {
    ...data,
    id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    stars: 0,
    history: [],
    createdAt: Date.now(),
    currentStreak: 0,
    lastPlayedDate: '',
    longestStreak: 0,
    unlockedAchievements: [],
  }
}

export function updateProfile(profiles: Profile[], updated: Profile): Profile[] {
  return profiles.map(p => (p.id === updated.id ? updated : p))
}

export function deleteProfile(profiles: Profile[], id: string): Profile[] {
  return profiles.filter(p => p.id !== id)
}

export function addStars(profile: Profile, count: number): Profile {
  return { ...profile, stars: profile.stars + count }
}

export function recordTopicResult(
  profile: Profile,
  topic: string,
  correct: boolean
): Profile {
  const existing = profile.history.find(h => h.topic === topic)
  const updated: TopicHistory = existing
    ? {
        ...existing,
        correct: existing.correct + (correct ? 1 : 0),
        wrong: existing.wrong + (correct ? 0 : 1),
        lastPlayed: Date.now(),
      }
    : { topic, correct: correct ? 1 : 0, wrong: correct ? 0 : 1, lastPlayed: Date.now() }

  const history = existing
    ? profile.history.map(h => (h.topic === topic ? updated : h))
    : [...profile.history, updated]

  // Update streak: session ends when any topic is recorded (marks last play today)
  const todayStr = getTodayDateString()
  const { streak, longest } = calculateStreak(profile, todayStr)

  let updated_profile = {
    ...profile,
    history,
    currentStreak: streak,
    lastPlayedDate: todayStr,
    longestStreak: longest,
  }

  // Check for new achievements
  const { updated: achievementUpdated } = detectNewAchievements(updated_profile)
  return achievementUpdated
}

// Migration system — add new entries as schema evolves
const migrations: Record<number, (data: unknown) => Profile[]> = {
  1: (raw: unknown) => {
    const old = raw as Array<Omit<Profile, 'history'> & { history?: TopicHistory[] }>
    return old.map(p => ({ ...p, history: p.history ?? [] }))
  },
  2: (raw: unknown) => {
    const old = raw as Array<Partial<Profile>>
    return old.map(p => ({
      ...p,
      currentStreak: p.currentStreak ?? 0,
      lastPlayedDate: p.lastPlayedDate ?? '',
      longestStreak: p.longestStreak ?? 0,
    } as Profile))
  },
  3: (raw: unknown) => {
    const old = raw as Array<Partial<Profile>>
    return old.map(p => ({
      ...p,
      unlockedAchievements: p.unlockedAchievements ?? [],
    } as Profile))
  },
}

function runMigrations(data: unknown, fromVersion: number): Profile[] {
  let result = data as Profile[]
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (migrations[v]) result = migrations[v](result)
  }
  return result
}

export function detectNewAchievements(profile: Profile): { newIds: string[]; updated: Profile } {
  const unlocked = new Set(profile.unlockedAchievements)
  const newIds: string[] = []

  // first_session: play any session
  if (profile.history.length > 0 && !unlocked.has('first_session')) {
    unlocked.add('first_session')
    newIds.push('first_session')
  }

  // ten_sessions: play 10+ sessions
  const totalSessions = profile.history.reduce((sum, h) => sum + h.correct + h.wrong, 0) / 10 || 0
  if (totalSessions >= 10 && !unlocked.has('ten_sessions')) {
    unlocked.add('ten_sessions')
    newIds.push('ten_sessions')
  }

  // fifty_sessions: play 50+ sessions
  if (totalSessions >= 50 && !unlocked.has('fifty_sessions')) {
    unlocked.add('fifty_sessions')
    newIds.push('fifty_sessions')
  }

  // hundred_stars: reach 100 stars
  if (profile.stars >= 100 && !unlocked.has('hundred_stars')) {
    unlocked.add('hundred_stars')
    newIds.push('hundred_stars')
  }

  // streak_7: reach 7 day streak
  if (profile.currentStreak >= 7 && !unlocked.has('streak_7')) {
    unlocked.add('streak_7')
    newIds.push('streak_7')
  }

  // streak_30: reach 30 day streak
  if (profile.currentStreak >= 30 && !unlocked.has('streak_30')) {
    unlocked.add('streak_30')
    newIds.push('streak_30')
  }

  // master_topic: play 1 topic 10+ times
  const masteredTopic = profile.history.find(h => h.correct + h.wrong >= 10)
  if (masteredTopic && !unlocked.has('master_topic')) {
    unlocked.add('master_topic')
    newIds.push('master_topic')
  }

  // all_topics: play all topics for age group
  const availableTopics = TOPIC_META.filter(t => t.ageGroups.includes(profile.ageGroup)).map(t => t.id)
  const playedTopics = new Set(profile.history.map(h => h.topic))
  if (availableTopics.every(t => playedTopics.has(t)) && !unlocked.has('all_topics')) {
    unlocked.add('all_topics')
    newIds.push('all_topics')
  }

  return {
    newIds,
    updated: { ...profile, unlockedAchievements: Array.from(unlocked) },
  }
}
