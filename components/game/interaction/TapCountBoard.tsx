'use client'

import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import { AnswerChoices } from '@/components/game/AnswerChoices'
import type { Question } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

const EmojiGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  max-width: 340px;
`

const TapItem = styled(motion.button)<{ $tapped: boolean }>`
  font-size: 2.4rem;
  width: 64px;
  height: 64px;
  border: 3px solid ${({ theme, $tapped }) => $tapped ? theme.colors.correct : theme.colors.border};
  background: ${({ theme, $tapped }) => $tapped ? theme.colors.correctLight : theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;

  &:disabled { cursor: default; }
`

const CounterBadge = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
`

const HintText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

export function TapCountBoard({ question, phase, selectedId, onSelect }: Props) {
  const items = question.visualEmojis ?? []
  const [tapped, setTapped] = useState<boolean[]>(() => Array(items.length).fill(false))
  const tappedCount = tapped.filter(Boolean).length
  const allTapped = tappedCount === items.length

  const handleTap = useCallback((i: number) => {
    if (phase !== 'playing' || tapped[i]) return
    setTapped(prev => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }, [phase, tapped])

  // Reset when question changes (by resetting on all-untapped)
  // (parent will re-mount on question change via key so state resets automatically)

  return (
    <Wrapper>
      {!allTapped && (
        <HintText>Chạm vào từng cái để đếm! 👆</HintText>
      )}

      <EmojiGrid>
        {items.map((emoji, i) => (
          <TapItem
            key={i}
            $tapped={tapped[i]}
            disabled={phase !== 'playing' || tapped[i]}
            onClick={() => handleTap(i)}
            whileTap={tapped[i] ? {} : { scale: 0.85 }}
            animate={tapped[i] ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : { scale: 1, rotate: 0 }}
            transition={tapped[i] ? { type: 'tween', duration: 0.4, ease: 'easeInOut' } : SPRING_BOUNCY}
          >
            {emoji}
          </TapItem>
        ))}
      </EmojiGrid>

      <AnimatePresence>
        {tappedCount > 0 && (
          <CounterBadge
            key={tappedCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_GENTLE}
          >
            {tappedCount} 🌟
          </CounterBadge>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allTapped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_GENTLE}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <AnswerChoices
              choices={question.choices}
              correctId={question.correctId}
              phase={phase}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}
