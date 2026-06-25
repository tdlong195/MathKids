# Skill: kid-audio-skill

## Khi nào trigger
- Thêm âm thanh SFX vào component mới
- Tạo hoặc sửa `soundManager.ts`
- Thêm file sound mới vào `public/sounds/`
- Debug âm thanh không phát hoặc phát sai lúc

---

## Danh sách SFX chuẩn

| File | Khi phát | Ghi chú |
|------|----------|---------|
| `correct.mp3` | Chọn đúng đáp án lần 1 | Vui, ngắn (~0.8s), pitch cao |
| `wrong.mp3` | Chọn sai (lần 1 hoặc 2) | Nhẹ nhàng, không đáng sợ (~0.5s) |
| `click.mp3` | Nhấn bất kỳ button/choice | Rất ngắn (~0.1s), feedback chạm |
| `celebration.mp3` | Màn celebration cuối session | Vui, dài hơn (2-4s), có thể loop |
| `reveal.mp3` | Hiện đáp án đúng sau sai lần 2 | Nhẹ nhàng, gợi ý — optional |

Nguồn SFX gợi ý: freesound.org (license CC0), mixkit.co

---

## soundManager.ts — Cấu trúc chuẩn

```typescript
// lib/sound/soundManager.ts
// Singleton pattern — ONE instance shared across entire app
import { Howl, Howler } from 'howler'

type SoundKey = 'correct' | 'wrong' | 'click' | 'celebration' | 'reveal'

const sounds: Record<SoundKey, Howl> = {
  correct: new Howl({ src: ['/sounds/correct.mp3'], preload: true, volume: 0.8 }),
  wrong: new Howl({ src: ['/sounds/wrong.mp3'], preload: true, volume: 0.6 }),
  click: new Howl({ src: ['/sounds/click.mp3'], preload: true, volume: 0.5 }),
  celebration: new Howl({ src: ['/sounds/celebration.mp3'], preload: true, volume: 0.9 }),
  reveal: new Howl({ src: ['/sounds/reveal.mp3'], preload: true, volume: 0.5 }),
}

let muted = false

export const soundManager = {
  play(key: SoundKey): void {
    if (muted) return
    // Stop previous instance to prevent overlap on rapid taps
    sounds[key].stop()
    sounds[key].play()
  },

  setMuted(value: boolean): void {
    muted = value
    Howler.mute(value)
  },

  isMuted(): boolean {
    return muted
  },

  // Call on app init to load mute preference from localStorage
  loadMutePreference(): void {
    const saved = localStorage.getItem('mathkids-muted')
    if (saved === 'true') this.setMuted(true)
  },

  saveMutePreference(): void {
    localStorage.setItem('mathkids-muted', String(muted))
  },
}
```

---

## Cách dùng trong component

```typescript
// ĐÚNG — luôn dùng qua soundManager
import { soundManager } from '@/lib/sound/soundManager'

function AnswerChoices() {
  const handleChoiceClick = (choiceId: string) => {
    soundManager.play('click')      // feedback ngay khi chạm
    // ... check answer logic
    if (isCorrect) {
      soundManager.play('correct')  // phát sau khi xác nhận đúng
    } else {
      soundManager.play('wrong')
    }
  }
}

// SAI — không tạo Howl instance mới trong component
const mySound = new Howl({ src: ['/sounds/correct.mp3'] }) // ❌
```

---

## Thứ tự phát sound + animation

Sound và animation phải sync nhau:

```typescript
// correct answer flow:
soundManager.play('click')       // t=0: ngay khi chạm
// ... (50ms) validate answer
soundManager.play('correct')     // t=50ms: confirm đúng, CÙNG LÚC với animation
// animation duration ~600ms
// star appears at t=300ms (delay: 0.3 trong Framer Motion)
```

```typescript
// wrong answer flow:
soundManager.play('click')       // t=0: ngay khi chạm
// ... (50ms) validate
soundManager.play('wrong')       // t=50ms: cùng lúc shake animation bắt đầu
```

```typescript
// reveal correct answer (sau sai lần 2):
soundManager.play('reveal')      // cùng lúc highlight đáp án đúng
```

---

## MuteButton component

```tsx
// components/ui/MuteButton.tsx
'use client'
import { useState, useEffect } from 'react'
import { soundManager } from '@/lib/sound/soundManager'
import { motion } from 'framer-motion'

export function MuteButton() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    soundManager.loadMutePreference()
    setMuted(soundManager.isMuted())
  }, [])

  const toggle = () => {
    const next = !muted
    setMuted(next)
    soundManager.setMuted(next)
    soundManager.saveMutePreference()
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      style={{ fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {muted ? '🔇' : '🔊'}
    </motion.button>
  )
}
```

---

## Quy tắc

1. **Không tạo Howl instance trong component** — chỉ dùng `soundManager.play()`
2. **`click` SFX phát trước** mọi action — feedback chạm tức thì
3. **Stop trước khi play** (`sounds[key].stop()`) — tránh overlap khi bé tap nhanh
4. **Preload tất cả** khi khởi tạo soundManager — không lazy load, file nhỏ
5. **Không dùng Web Speech API / TTS** — chỉ SFX, không giọng đọc
6. **Howler phải import ở client component** — không import trong Server Component (Next.js)

## Lưu ý Next.js App Router

```typescript
// soundManager phải được dùng trong 'use client' component hoặc
// lazy init để tránh SSR error (Howler cần browser environment)

// Nếu cần dùng ở nhiều nơi, wrap trong dynamic import hoặc
// kiểm tra typeof window !== 'undefined' trước khi init
```
