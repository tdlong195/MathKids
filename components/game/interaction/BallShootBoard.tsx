'use client'

import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import type { Question } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Arena = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 260px;
  background: linear-gradient(180deg, #e0f0ff 0%, #c8e6ff 100%);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.border};
`

const Ball = styled(motion.button)`
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff 0%, #FF6B35 60%, #e04000 100%);
  border: none;
  font-size: 2rem;
  font-weight: 900;
  font-family: inherit;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);

  &:disabled { cursor: default; }
`

// Number of lanes = number of choices (2–4)
// Each ball starts off-screen on the right and flies left.
// Speed: 4-6 seconds to cross the arena (UX Rule 12: min 2s crossing).

const BALL_SIZE = 72
const LANE_HEIGHT = 260 / 4  // divide arena into 4 rows

function getInitialY(lane: number): number {
  return lane * LANE_HEIGHT + (LANE_HEIGHT - BALL_SIZE) / 2
}

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

export function BallShootBoard({ question, phase, selectedId, onSelect }: Props) {
  const isDisabled = phase !== 'playing' && phase !== 'feedback-wrong'

  // Assign each choice a lane and a duration
  const ballConfigs = question.choices.map((choice, i) => ({
    choice,
    lane: i % 4,
    duration: 4 + (i % 3),  // 4s, 5s, or 6s crossing time
    delay: i * 0.8,
  }))

  const handleTap = useCallback((choiceId: string) => {
    if (isDisabled) return
    onSelect(choiceId)
  }, [isDisabled, onSelect])

  return (
    <Arena>
      {ballConfigs.map(({ choice, lane, duration, delay }) => {
        const stateStyle = selectedId === choice.id
          ? phase === 'feedback-correct'
            ? { background: 'radial-gradient(circle at 35% 35%, #fff 0%, #4CAF50 60%, #2e7d32 100%)' }
            : { background: 'radial-gradient(circle at 35% 35%, #fff 0%, #FFB74D 60%, #F57C00 100%)' }
          : {}

        return (
          <Ball
            key={choice.id}
            style={{ top: getInitialY(lane), ...stateStyle }}
            initial={{ x: 380 }}
            animate={{ x: -BALL_SIZE }}
            transition={{
              duration,
              delay,
              repeat: isDisabled ? 0 : Infinity,
              repeatDelay: 0.5,
              ease: 'linear',
            }}
            disabled={isDisabled}
            onClick={() => handleTap(choice.id)}
            whileTap={{ scale: 0.92 }}
          >
            {choice.label}
          </Ball>
        )
      })}
    </Arena>
  )
}
