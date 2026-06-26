const TTS_ENABLED_KEY = 'mathkids-tts-enabled'

let ttsEnabled = true
// Chrome loads voices asynchronously — cache them after first load
let cachedVoices: SpeechSynthesisVoice[] = []

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  cachedVoices = window.speechSynthesis.getVoices()
  if (cachedVoices.length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = window.speechSynthesis.getVoices()
    }, { once: true })
  }
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = cachedVoices.length
    ? cachedVoices
    : window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'vi-VN') ||
    voices.find(v => v.lang.startsWith('vi')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0] ||
    null
  )
}

export const ttsManager = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  },

  speak(text: string): void {
    if (!this.isSupported() || !ttsEnabled) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1.0
    const voice = getBestVoice()
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  },

  cancel(): void {
    if (this.isSupported()) window.speechSynthesis.cancel()
  },

  setEnabled(value: boolean): void {
    ttsEnabled = value
    if (!value) this.cancel()
    if (typeof window !== 'undefined') {
      localStorage.setItem(TTS_ENABLED_KEY, String(value))
    }
  },

  isEnabled(): boolean {
    return ttsEnabled
  },

  loadPreference(): void {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(TTS_ENABLED_KEY)
    if (saved === 'false') ttsEnabled = false
    initVoices()
  },
}
