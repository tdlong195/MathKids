'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_SNAP } from '@/lib/animation/springs'
import type { Choice } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

type ChoiceState = 'idle' | 'correct' | 'wrong' | 'revealed'

const GridWrapper = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => ($count <= 2 ? '1fr 1fr' : $count === 3 ? '1fr 1fr 1fr' : '1fr 1fr')};
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: 360px;
`

const ChoiceButton = styled(motion.button)<{ $state: ChoiceState }>`
  min-height: ${({ theme }) => theme.touch.lg};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xs}`};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  font-family: inherit;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $state }) =>
      $state === 'correct'
        ? theme.colors.correct
        : $state === 'wrong'
          ? theme.colors.wrong
          : $state === 'revealed'
            ? theme.colors.correct
            : theme.colors.border};
  background: ${({ theme, $state }) =>
    $state === 'correct'
      ? theme.colors.correctLight
      : $state === 'wrong'
        ? theme.colors.wrongLight
        : $state === 'revealed'
          ? theme.colors.correctLight
          : theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`

interface Props {
  choices: Choice[]
  correctId: string
  phase: GamePhase
  selectedId: string | null
  onSelect: (id: string) => void
}

function getChoiceState(
  choice: Choice,
  correctId: string,
  selectedId: string | null,
  phase: GamePhase
): ChoiceState {
  if (phase === 'revealed') {
    return choice.id === correctId ? 'revealed' : 'idle'
  }
  if (phase === 'feedback-correct' && choice.id === selectedId) return 'correct'
  if (phase === 'feedback-wrong' && choice.id === selectedId) return 'wrong'
  return 'idle'
}

export function AnswerChoices({ choices, correctId, phase, selectedId, onSelect }: Props) {
  const isDisabled = phase !== 'playing' && phase !== 'feedback-wrong'

  return (
    <GridWrapper $count={choices.length}>
      {choices.map(choice => {
        const state = getChoiceState(choice, correctId, selectedId, phase)

        return (
          <ChoiceButton
            key={choice.id}
            $state={state}
            disabled={isDisabled || (phase === 'feedback-wrong' && choice.id === selectedId)}
            onClick={() => onSelect(choice.id)}
            whileTap={isDisabled ? {} : { scale: 0.92 }}
            animate={
              state === 'correct'
                ? { scale: 1.1, backgroundColor: '#E8F5E9' }
                : state === 'wrong'
                  ? { x: [-10, 10, -8, 8, 0] }
                  : state === 'revealed'
                    ? { boxShadow: '0 0 16px rgba(76,175,80,0.6)' }
                    : { scale: 1, x: 0, backgroundColor: '#FFFFFF', boxShadow: '0 0 0px rgba(76,175,80,0)' }
            }
            transition={
              state === 'correct'
                ? SPRING_BOUNCY
                : state === 'wrong'
                  ? { type: 'tween', duration: 0.45, ease: 'easeInOut' }
                  : state === 'revealed'
                    ? { type: 'tween', duration: 0.5, repeat: 1, repeatType: 'reverse' }
                    : SPRING_SNAP
            }
          >
            {choice.label}
          </ChoiceButton>
        )
      })}
    </GridWrapper>
  )
}
