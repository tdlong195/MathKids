'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/store/profileStore'
import { useGameStore } from '@/store/gameStore'
import { generateSession, generateMixedSession } from '@/lib/generators'
import { TOPIC_META } from '@/types/topic'
import { KidButton } from '@/components/ui/KidButton'
import { soundManager } from '@/lib/sound/soundManager'
import { SPRING_GENTLE, SPRING_BOUNCY, SPRING_SNAP } from '@/lib/animation/springs'
import type { Topic, AgeGroup, GameMode } from '@/types/topic'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const AvatarText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xl};
`

const GreetingText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const SubText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 400px;
`

const TopicCard = styled(motion.button)`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  min-height: ${({ theme }) => theme.touch.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-family: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`

const TopicEmoji = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xl};
`

const TopicLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ModeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`

const ModeButton = styled(motion.button)<{ $active: boolean }>`
  min-height: 64px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) => $active ? theme.colors.primaryLight : theme.colors.surface};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  font-family: inherit;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
`

const ModeEmoji = styled.span`
  font-size: 1.6rem;
  line-height: 1;
`

const GAME_MODES: { mode: GameMode; emoji: string; label: string }[] = [
  { mode: 'standard',     emoji: '📚', label: 'Thường' },
  { mode: 'numberRace',   emoji: '🏃', label: 'Đua xe' },
  { mode: 'puzzleReveal', emoji: '🧩', label: 'Ghép hình' },
]

export default function TopicsPage() {
  const router = useRouter()
  const { getCurrentProfile } = useProfileStore()
  const { startSession } = useGameStore()
  const [gameMode, setGameMode] = useState<GameMode>('standard')

  const profile = getCurrentProfile()

  useEffect(() => {
    soundManager.loadMutePreference()
    if (!profile) router.replace('/')
  }, [profile, router])

  if (!profile) return null

  const availableTopics = TOPIC_META.filter(t => t.ageGroups.includes(profile.ageGroup))

  const handleSelectTopic = (topicId: Topic) => {
    soundManager.play('click')
    const questions = generateSession(topicId, profile.ageGroup as AgeGroup)
    startSession(topicId, profile.ageGroup as AgeGroup, questions, gameMode)
    router.push('/play')
  }

  const handleQuickMix = () => {
    soundManager.play('click')
    const questions = generateMixedSession(profile.ageGroup as AgeGroup)
    startSession('counting', profile.ageGroup as AgeGroup, questions, 'standard')
    router.push('/play')
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_GENTLE}
      >
        <Header>
          <AvatarText>{profile.avatar}</AvatarText>
          <GreetingText>Xin chào, {profile.name}!</GreetingText>
        </Header>
      </motion.div>

      <SubText>Hôm nay bé muốn học gì? 🤔</SubText>

      <ModeRow>
        {GAME_MODES.map(({ mode, emoji, label }) => (
          <ModeButton
            key={mode}
            $active={gameMode === mode}
            onClick={() => { soundManager.play('click'); setGameMode(mode) }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING_SNAP}
          >
            <ModeEmoji>{emoji}</ModeEmoji>
            {label}
          </ModeButton>
        ))}
      </ModeRow>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_BOUNCY, delay: 0.1 }}
      >
        <KidButton
          $variant="primary"
          $size="lg"
          onClick={handleQuickMix}
          style={{ width: '100%' }}
        >
          🎲 Chơi ngẫu nhiên
        </KidButton>
      </motion.div>

      <TopicsGrid>
        {availableTopics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...SPRING_BOUNCY, delay: (i + 1) * 0.08 }}
          >
            <TopicCard
              onClick={() => handleSelectTopic(topic.id as Topic)}
              whileHover={{ y: -4, scale: 1.03, borderColor: '#FF6B35' }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING_GENTLE}
            >
              <TopicEmoji>{topic.emoji}</TopicEmoji>
              <TopicLabel>{topic.labelVi}</TopicLabel>
            </TopicCard>
          </motion.div>
        ))}
      </TopicsGrid>

      <KidButton $variant="ghost" onClick={() => router.push('/')}>
        ← Đổi bé
      </KidButton>
    </PageWrapper>
  )
}
