import { Howl, Howler } from 'howler'

type SoundKey = 'correct' | 'wrong' | 'click' | 'celebration'

const MUTE_KEY = 'mathkids-muted'

// Lazy-initialized to avoid SSR issues
let sounds: Record<SoundKey, Howl> | null = null

function getSounds(): Record<SoundKey, Howl> {
  if (!sounds) {
    sounds = {
      correct:     new Howl({ src: ['/sounds/correct.mp3'],     preload: true, volume: 0.8 }),
      wrong:       new Howl({ src: ['/sounds/wrong.mp3'],       preload: true, volume: 0.6 }),
      click:       new Howl({ src: ['/sounds/click.mp3'],       preload: true, volume: 0.5 }),
      celebration: new Howl({ src: ['/sounds/celebration.mp3'], preload: true, volume: 0.9 }),
    }
  }
  return sounds
}

let muted = false

export const soundManager = {
  play(key: SoundKey): void {
    if (typeof window === 'undefined' || muted) return
    const s = getSounds()[key]
    s.stop()
    s.play()
  },

  setMuted(value: boolean): void {
    muted = value
    if (typeof window !== 'undefined') Howler.mute(value)
  },

  isMuted(): boolean {
    return muted
  },

  loadMutePreference(): void {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(MUTE_KEY)
    if (saved === 'true') this.setMuted(true)
  },

  saveMutePreference(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(MUTE_KEY, String(muted))
  },
}
