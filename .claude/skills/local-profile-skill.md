# Skill: local-profile-skill

## Khi nào trigger
- Đọc/ghi profile từ localStorage
- Thêm field mới vào Profile schema
- Cần migrate data khi schema thay đổi giữa các version app
- Debug dữ liệu bé bị mất sau khi update

---

## Storage key convention

```typescript
// Chỉ dùng 1 key chính cho toàn bộ data
const STORAGE_KEY = 'mathkids-profiles'      // array of Profile[]
const MUTE_KEY = 'mathkids-muted'            // boolean string
const SCHEMA_VERSION_KEY = 'mathkids-schema-version'  // number string
```

---

## Schema version (bắt buộc)

Mỗi khi thay đổi cấu trúc `Profile`, tăng `SCHEMA_VERSION` và viết migration:

```typescript
// lib/storage/profiles.ts
const CURRENT_SCHEMA_VERSION = 1  // increment này khi đổi schema

// Migration functions — mỗi version 1 function
const migrations: Record<number, (data: unknown) => Profile[]> = {
  // v0 → v1: added 'history' field (was missing in early builds)
  1: (raw: unknown) => {
    const old = raw as Array<Omit<Profile, 'history'>>
    return old.map(p => ({ ...p, history: p.history ?? [] }))
  },
}
```

---

## profiles.ts — Cấu trúc chuẩn

```typescript
// lib/storage/profiles.ts
import type { Profile } from '@/types/profile'

const STORAGE_KEY = 'mathkids-profiles'
const SCHEMA_VERSION_KEY = 'mathkids-schema-version'
const CURRENT_SCHEMA_VERSION = 1

// --- Read ---

export function loadProfiles(): Profile[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    const savedVersion = Number(localStorage.getItem(SCHEMA_VERSION_KEY) ?? 0)

    return runMigrations(parsed, savedVersion)
  } catch {
    // Corrupted data — return empty rather than crash
    console.warn('[mathkids] Failed to load profiles, starting fresh')
    return []
  }
}

// --- Write ---

export function saveProfiles(profiles: Profile[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
}

// --- CRUD helpers ---

export function createProfile(data: Omit<Profile, 'id' | 'stars' | 'history' | 'createdAt'>): Profile {
  return {
    ...data,
    id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    stars: 0,
    history: [],
    createdAt: Date.now(),
  }
}

export function updateProfile(profiles: Profile[], updated: Profile): Profile[] {
  return profiles.map(p => p.id === updated.id ? updated : p)
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
  correct: boolean,
): Profile {
  const existing = profile.history.find(h => h.topic === topic)
  const updated = existing
    ? { ...existing, [correct ? 'correct' : 'wrong']: existing[correct ? 'correct' : 'wrong'] + 1, lastPlayed: Date.now() }
    : { topic, correct: correct ? 1 : 0, wrong: correct ? 0 : 1, lastPlayed: Date.now() }

  const history = existing
    ? profile.history.map(h => h.topic === topic ? updated : h)
    : [...profile.history, updated]

  return { ...profile, history }
}

// --- Migration ---

function runMigrations(data: unknown, fromVersion: number): Profile[] {
  let result = data as Profile[]
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (migrations[v]) result = migrations[v](result)
  }
  return result
}

const migrations: Record<number, (data: unknown) => Profile[]> = {
  // Add future migrations here, example:
  // 2: (raw) => (raw as Profile[]).map(p => ({ ...p, newField: 'default' }))
}
```

---

## Zustand profileStore — Kết nối với storage

```typescript
// store/profileStore.ts
import { create } from 'zustand'
import { loadProfiles, saveProfiles, createProfile, updateProfile, deleteProfile } from '@/lib/storage/profiles'
import type { Profile } from '@/types/profile'

interface ProfileStore {
  profiles: Profile[]
  currentProfileId: string | null
  // Actions
  loadFromStorage: () => void
  addProfile: (data: Omit<Profile, 'id' | 'stars' | 'history' | 'createdAt'>) => void
  setCurrentProfile: (id: string) => void
  updateCurrentProfile: (updated: Profile) => void
  removeProfile: (id: string) => void
  currentProfile: () => Profile | null
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  currentProfileId: null,

  loadFromStorage: () => {
    const profiles = loadProfiles()
    set({ profiles })
  },

  addProfile: (data) => {
    const newProfile = createProfile(data)
    const profiles = [...get().profiles, newProfile]
    saveProfiles(profiles)
    set({ profiles })
  },

  setCurrentProfile: (id) => set({ currentProfileId: id }),

  updateCurrentProfile: (updated) => {
    const profiles = updateProfile(get().profiles, updated)
    saveProfiles(profiles)
    set({ profiles })
  },

  removeProfile: (id) => {
    const profiles = deleteProfile(get().profiles, id)
    saveProfiles(profiles)
    set({ profiles, currentProfileId: get().currentProfileId === id ? null : get().currentProfileId })
  },

  currentProfile: () => {
    const { profiles, currentProfileId } = get()
    return profiles.find(p => p.id === currentProfileId) ?? null
  },
}))
```

---

## Quy tắc

1. **Luôn try/catch khi đọc localStorage** — data có thể corrupt, JSON.parse có thể throw
2. **Không lưu function, Date object, undefined** vào localStorage — chỉ serialize-safe values
3. **Tăng SCHEMA_VERSION** mỗi khi thêm/đổi field trong Profile — không bỏ qua
4. **Viết migration** cho mỗi version — dữ liệu bé phải được preserve, không xóa sạch
5. **`typeof window !== 'undefined'` guard** trước mọi localStorage call — Next.js SSR
6. **Không lưu quá 50 profiles** — localStorage limit. Nếu cần, cảnh báo user (hiếm xảy ra)
7. **Không dùng IndexedDB cho MVP** — localStorage đủ dùng, đơn giản hơn

## Khi nào dùng IndexedDB (Phase 2+)
Chỉ cần nếu: lưu nhiều hơn 5MB data, lưu Blob/ArrayBuffer, hoặc cần transaction. MVP không cần.
