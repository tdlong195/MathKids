'use client'

import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@/lib/animation/springs'
import type { Question, BalanceScaleData } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

const ScaleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const Beam = styled(motion.div)`
  width: 240px;
  height: 8px;
  background: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 4px;
  position: relative;
`

const PanRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 240px;
`

const Pan = styled(motion.div)<{ $filled: boolean }>`
  width: 100px;
  min-height: 56px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $filled }) => $filled ? theme.colors.correctLight : theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  transition: background 0.3s;
`

const Stand = styled.div`
  width: 8px;
  height: 40px;
  background: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 auto;
  border-radius: 4px;
`

const EquationText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  letter-spacing: 2px;
`

const CardsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

const ChoiceCard = styled(motion.button)<{ $state: 'idle' | 'correct' | 'wrong' }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $state }) =>
      $state === 'correct' ? theme.colors.correct : $state === 'wrong' ? theme.colors.wrong : theme.colors.border};
  background: ${({ theme, $state }) =>
    $state === 'correct' ? theme.colors.correctLight : $state === 'wrong' ? theme.colors.wrongLight : theme.colors.surface};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  &:disabled { cursor: default; opacity: 0.6; }
`

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

export function BalanceScaleBoard({ question, phase, selectedId, onSelect }: Props) {
  const [placed, setPlaced] = useState<string | null>(null)
  const isDisabled = phase !== 'playing'
  const scaleData = question.interactionData as BalanceScaleData | undefined

  const handlePick = useCallback((choiceId: string) => {
    if (isDisabled || placed !== null) return
    setPlaced(choiceId)
    onSelect(choiceId)
  }, [isDisabled, placed, onSelect])

  const placedLabel = placed
    ? (question.choices.find(c => c.id === placed)?.label ?? '?')
    : '?'

  const correctLabel = question.choices.find(c => c.id === question.correctId)?.label ?? '0'
  const isCorrect = placed !== null && placed === question.correctId
  // Compare numeric values so beam tilts toward the lighter side
  const beamRotate = placed === null ? 0
    : isCorrect ? 0
    : Number(placedLabel) < Number(correctLabel) ? -8 : 8

  // Right pan: read from interactionData to avoid parsing the prompt string
  const rightPanValue = scaleData?.rightValue ?? question.prompt.split('=')[1]?.trim() ?? ''

  return (
    <Wrapper>
      <EquationText>{question.prompt.replace('?', placedLabel)}</EquationText>

      <ScaleWrapper>
        <PanRow>
          <Pan $filled={placed !== null}>
            {placed !== null ? placedLabel : '?'}
          </Pan>
          <Pan $filled={true}>
            {rightPanValue}
          </Pan>
        </PanRow>
        <Beam
          animate={{ rotate: beamRotate }}
          transition={SPRING_BOUNCY}
        />
        <Stand />
      </ScaleWrapper>

      <CardsRow>
        {question.choices.map(choice => {
          const state =
            selectedId === choice.id && phase === 'feedback-correct' ? 'correct'
            : selectedId === choice.id && (phase === 'feedback-wrong' || phase === 'revealed') ? 'wrong'
            : 'idle'
          return (
            <ChoiceCard
              key={choice.id}
              $state={state}
              disabled={isDisabled || placed !== null}
              onClick={() => handlePick(choice.id)}
              whileTap={!isDisabled && placed === null ? { scale: 0.92 } : {}}
              animate={state === 'correct' ? { scale: [1, 1.15, 1] } : {}}
              transition={state === 'correct' ? { type: 'tween', duration: 0.4, ease: 'easeInOut' } : SPRING_BOUNCY}
            >
              {choice.label}
            </ChoiceCard>
          )
        })}
      </CardsRow>
    </Wrapper>
  )
}
