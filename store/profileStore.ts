import { create } from 'zustand'
import {
  loadProfiles,
  saveProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  addStars,
  recordTopicResult,
  detectNewAchievements,
} from '@/lib/storage/profiles'
import type { Profile } from '@/types/profile'
import type { AgeGroup } from '@/types/topic'

interface ProfileStore {
  profiles: Profile[]
  currentProfileId: string | null
  // Actions
  loadFromStorage: () => void
  addProfile: (data: { name: string; avatar: string; ageGroup: AgeGroup }) => Profile
  setCurrentProfile: (id: string) => void
  updateCurrentProfile: (updated: Profile) => void
  removeProfile: (id: string) => void
  awardStars: (count: number) => void
  recordResult: (topic: string, correct: boolean) => void
  recordResultWithAchievements: (topic: string, correct: boolean) => string[]
  getCurrentProfile: () => Profile | null
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
    return newProfile
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
    set({
      profiles,
      currentProfileId: get().currentProfileId === id ? null : get().currentProfileId,
    })
  },

  awardStars: (count) => {
    const profile = get().getCurrentProfile()
    if (!profile) return
    const updated = addStars(profile, count)
    const profiles = updateProfile(get().profiles, updated)
    saveProfiles(profiles)
    set({ profiles })
  },

  recordResult: (topic, correct) => {
    const profile = get().getCurrentProfile()
    if (!profile) return
    const updated = recordTopicResult(profile, topic, correct)
    const profiles = updateProfile(get().profiles, updated)
    saveProfiles(profiles)
    set({ profiles })
  },

  recordResultWithAchievements: (topic, correct) => {
    const profile = get().getCurrentProfile()
    if (!profile) return []
    const updated = recordTopicResult(profile, topic, correct)
    const { newIds } = detectNewAchievements(updated)
    const profiles = updateProfile(get().profiles, updated)
    saveProfiles(profiles)
    set({ profiles })
    return newIds
  },

  getCurrentProfile: () => {
    const { profiles, currentProfileId } = get()
    return profiles.find(p => p.id === currentProfileId) ?? null
  },
}))
