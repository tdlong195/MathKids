'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { generateSession } from '@/lib/generators'
import { TOPIC_META } from '@/types/topic'
import { KidButton } from '@/components/ui/KidButton'
import { soundManager } from '@/lib/sound/soundManager'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import type { AgeGroup } from '@/types/topic'
import type { Profile } from '@/types/profile'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
`

const ModalBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`

const ProfileButton = styled(motion.button)<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  cursor: pointer;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`

const Avatar = styled.div`
  font-size: 2rem;
`

const Name = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const AgeText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const SelectedPlayers = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  align-items: center;
  font-weight: 700;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

interface Props {
  profiles: Profile[]
  onClose: () => void
}

export function TwoPlayerSelector({ profiles, onClose }: Props) {
  const router = useRouter()
  const { startTwoPlayerSession } = useGameStore()
  const [player1, setPlayer1] = useState<Profile | null>(null)
  const [player2, setPlayer2] = useState<Profile | null>(null)

  // Validate same age group
  const validPlayer2 = player1
    ? profiles.filter(p => p.id !== player1.id && p.ageGroup === player1.ageGroup)
    : profiles

  const handleStart = () => {
    if (!player1 || !player2) return
    soundManager.play('click')
    // Random topic from available
    const topics = TOPIC_META.filter(t => t.ageGroups.includes(player1.ageGroup))
    const randomTopic = topics[Math.floor(Math.random() * topics.length)].id
    const questions = generateSession(randomTopic, player1.ageGroup as AgeGroup)
    startTwoPlayerSession(player1.name, player2.name, questions)
    router.push('/play/two-player')
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={SPRING_BOUNCY}
          onClick={e => e.stopPropagation()}
        >
          <Title>👫 Chọn 2 bé chơi</Title>

          <ProfileGrid>
            {profiles.map(p => (
              <ProfileButton
                key={p.id}
                $selected={p.id === player1?.id}
                onClick={() => {
                  setPlayer1(p)
                  if (player2?.id === p.id) setPlayer2(null)
                }}
                whileTap={{ scale: 0.92 }}
                transition={SPRING_GENTLE}
              >
                <Avatar>{p.avatar}</Avatar>
                <Name>{p.name}</Name>
                <AgeText>{p.ageGroup} tuổi</AgeText>
              </ProfileButton>
            ))}
          </ProfileGrid>

          {player1 && (
            <AnimatePresence mode="wait">
              <motion.div
                key="player2-select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Title style={{ fontSize: '1rem' }}>Chọn bé thứ 2</Title>
                <ProfileGrid>
                  {validPlayer2.map(p => (
                    <ProfileButton
                      key={p.id}
                      $selected={p.id === player2?.id}
                      onClick={() => setPlayer2(p)}
                      whileTap={{ scale: 0.92 }}
                      transition={SPRING_GENTLE}
                    >
                      <Avatar>{p.avatar}</Avatar>
                      <Name>{p.name}</Name>
                      <AgeText>{p.ageGroup} tuổi</AgeText>
                    </ProfileButton>
                  ))}
                </ProfileGrid>
              </motion.div>
            </AnimatePresence>
          )}

          {player1 && player2 && (
            <SelectedPlayers>
              {player1.avatar} {player1.name} vs {player2.avatar} {player2.name}
            </SelectedPlayers>
          )}

          <ButtonRow>
            <KidButton $variant="ghost" onClick={onClose} style={{ flex: 1 }}>
              Hủy
            </KidButton>
            <KidButton
              $variant="primary"
              onClick={handleStart}
              disabled={!player1 || !player2}
              style={{ flex: 1, opacity: player1 && player2 ? 1 : 0.5 }}
            >
              Chơi thôi! 🚀
            </KidButton>
          </ButtonRow>
        </ModalBox>
      </ModalOverlay>
    </AnimatePresence>
  )
}
