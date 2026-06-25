'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { useProfileStore } from '@/store/profileStore'
import { CelebrationScreen } from '@/components/game/CelebrationScreen'
import { soundManager } from '@/lib/sound/soundManager'
import type { Topic, AgeGroup } from '@/types/topic'

export default function ResultsPage() {
  const router = useRouter()
  const { topic, ageGroup, sessionStars, totalSessionStars, questions, resetGame, startSession } = useGameStore()
  const { getCurrentProfile } = useProfileStore()
  const celebrationPlayed = useRef(false)

  useEffect(() => {
    if (!celebrationPlayed.current) {
      celebrationPlayed.current = true
      soundManager.play('celebration')
    }
  }, [])

  // Guard: no session data
  useEffect(() => {
    if (!topic) router.replace('/')
  }, [topic, router])

  if (!topic) return null

  const handleContinue = () => {
    // Re-generate a fresh session on the same topic
    const profile = getCurrentProfile()
    if (topic && ageGroup && profile) {
      const { generateSession } = require('@/lib/generators')
      const newQuestions = generateSession(topic as Topic, ageGroup as AgeGroup)
      startSession(topic as Topic, ageGroup as AgeGroup, newQuestions)
      router.replace('/play')
    } else {
      router.replace('/topics')
    }
  }

  const handleHome = () => {
    resetGame()
    router.replace('/')
  }

  return (
    <CelebrationScreen
      starsEarned={sessionStars}
      totalPossible={totalSessionStars}
      onContinue={handleContinue}
      onHome={handleHome}
    />
  )
}
