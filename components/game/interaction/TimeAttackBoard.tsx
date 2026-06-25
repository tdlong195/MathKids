'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_GENTLE } from '@/lib/animation/springs'
import { AnswerChoices } from '@/components/game/AnswerChoices'
import type { Question } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`

const TimerBarOuter = styled.div`
  width: 100%;
  max-width: 360px;
  height: 14px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 7px;
  overflow: hidden;
`

const TimerBarInner = styled(motion.div)<{ $ratio: number }>`
  height: 100%;
  border-radius: 7px;
  background: ${({ $ratio }) =>
    $ratio > 0.5 ? '#4CAF50' : $ratio > 0.25 ? '#FFC107' : '#F44336'};
  transform-origin: left;
`

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

const DEFAULT_TIME_LIMIT = 20  // seconds

export function TimeAttackBoard({ question, phase, selectedId, onSelect }: Props) {
  const total = question.timeLimit ?? DEFAULT_TIME_LIMIT
  const [remaining, setRemaining] = useState(total)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown while playing — no side effects inside the state updater
  useEffect(() => {
    if (phase !== 'playing') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setRemaining(total)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [question.id, phase, total])

  // Detect timeout separately so onSelect is never called inside a state updater
  useEffect(() => {
    if (remaining === 0 && phase === 'playing') {
      onSelect('__timeout__')
    }
  }, [remaining, phase, onSelect])

  const ratio = remaining / total

  return (
    <Wrapper>
      <TimerBarOuter>
        <TimerBarInner
          $ratio={ratio}
          animate={{ scaleX: ratio }}
          initial={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      </TimerBarOuter>

      <AnswerChoices
        choices={question.choices}
        correctId={question.correctId}
        phase={phase}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </Wrapper>
  )
}
