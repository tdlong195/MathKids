'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_SNAP, SPRING_GENTLE } from '@/lib/animation/springs'
import type { Question } from '@/types/question'
import type { MemoryFlipData } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 360px;
  width: 100%;
`

const CardOuter = styled(motion.div)`
  perspective: 600px;
  height: 80px;
`

const CardInner = styled(motion.div)<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  cursor: pointer;
`

const CardFace = styled.div<{ $back?: boolean }>`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  background: ${({ theme, $back }) => $back ? theme.colors.primary : theme.colors.surface};
  color: ${({ $back }) => $back ? '#fff' : 'inherit'};
  transform: ${({ $back }) => $back ? 'rotateY(180deg)' : 'none'};
`

const MatchedOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.correctLight};
  border: 3px solid ${({ theme }) => theme.colors.correct};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  z-index: 1;
`

const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`

interface CardState {
  id: string
  pairId: string
  label: string
}

interface Props {
  question: Question
  phase: GamePhase
  onAnswer: (isCorrect: boolean) => void
}

const REVEAL_DURATION = 1000   // ms to hold mismatched cards before flipping back

export function MemoryMatchBoard({ question, phase, onAnswer }: Props) {
  const data = question.interactionData as MemoryFlipData | undefined
  const [cards] = useState<CardState[]>(() => data?.pairs ?? [])
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [locked, setLocked] = useState(false)
  const flipBackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear pending flip-back timer on unmount to avoid stale state updates
  useEffect(() => {
    return () => { if (flipBackTimerRef.current) clearTimeout(flipBackTimerRef.current) }
  }, [])

  const totalPairs = cards.length / 2
  const matchedPairs = matched.size / 2

  const handleFlip = useCallback((cardId: string) => {
    if (locked || flipped.has(cardId) || matched.has(cardId) || phase !== 'playing') return

    const nextFlipped = new Set(flipped)
    nextFlipped.add(cardId)

    const flippedArr = Array.from(nextFlipped)
    // Only process pairs — 2 cards flipped = check match
    const unmatched = flippedArr.filter(id => !matched.has(id))

    if (unmatched.length === 2) {
      setFlipped(nextFlipped)
      setLocked(true)
      const [a, b] = unmatched.map(id => cards.find(c => c.id === id)!)
      if (a.pairId === b.pairId) {
        const nextMatched = new Set(matched)
        nextMatched.add(a.id)
        nextMatched.add(b.id)
        setMatched(nextMatched)
        setFlipped(new Set())
        setLocked(false)
      } else {
        flipBackTimerRef.current = setTimeout(() => {
          setFlipped(new Set())
          setLocked(false)
          flipBackTimerRef.current = null
        }, REVEAL_DURATION)
      }
    } else {
      setFlipped(nextFlipped)
    }
  }, [locked, flipped, matched, phase, cards])

  // When all pairs matched, signal completion
  useEffect(() => {
    if (matched.size > 0 && matched.size === cards.length) {
      onAnswer(true)
    }
  }, [matched, cards.length, onAnswer])

  if (!data) return null

  const cols = cards.length <= 6 ? 3 : 4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <ProgressText>
        Đã tìm được {matchedPairs} / {totalPairs} cặp 🎴
      </ProgressText>

      <Grid $cols={cols}>
        {cards.map(card => {
          const isFlipped = flipped.has(card.id)
          const isMatched = matched.has(card.id)

          return (
            <CardOuter
              key={card.id}
              onClick={() => handleFlip(card.id)}
              whileTap={!locked && !isMatched ? { scale: 0.92 } : {}}
              transition={SPRING_SNAP}
            >
              <CardInner
                $flipped={isFlipped || isMatched}
                animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CardFace $back={false}>🎴</CardFace>
                <CardFace $back={true}>{card.label}</CardFace>
                {isMatched && (
                  <MatchedOverlay
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING_BOUNCY}
                  >
                    {card.label} ✓
                  </MatchedOverlay>
                )}
              </CardInner>
            </CardOuter>
          )
        })}
      </Grid>
    </div>
  )
}
