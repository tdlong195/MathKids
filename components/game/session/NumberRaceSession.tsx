'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import type { GamePhase } from '@/store/gameStore'

const TrackWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const TrackLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

// Outer rail — fixed height, clips the fill but not the character
const TrackRail = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`

const TrackFill = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #a8e6cf, ${({ theme }) => theme.colors.correct});
  border-radius: ${({ theme }) => theme.radius.full};
`

// Character floats above the rail, positioned by percentage
const CharacterRow = styled.div`
  position: relative;
  width: 100%;
  height: 36px;
`

const CharacterDot = styled(motion.span)`
  position: absolute;
  top: 0;
  font-size: 1.8rem;
  line-height: 1;
  display: block;
  transform: translateX(-50%);
`

const EndFlags = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.4rem;
  line-height: 1;
`

interface Props {
  correctAnswers: number
  totalQuestions: number
  avatar: string
  phase: GamePhase
}

export function NumberRaceSession({ correctAnswers, totalQuestions, avatar, phase }: Props) {
  // Keep character 5%–95% so it stays visible at both ends
  const progress = totalQuestions > 0 ? correctAnswers / totalQuestions : 0
  const charLeft = `${5 + progress * 90}%`
  const fillWidth = `${progress * 100}%`

  const isWrong = phase === 'revealed'

  return (
    <TrackWrapper>
      <TrackLabel>
        🏁 Đúng {correctAnswers} / {totalQuestions} câu
      </TrackLabel>

      <CharacterRow>
        <CharacterDot
          animate={{
            left: charLeft,
            rotate: isWrong ? [0, -12, 12, -8, 8, 0] : 0,
            scale: phase === 'feedback-correct' ? [1, 1.4, 1] : 1,
          }}
          transition={
            phase === 'feedback-correct'
              ? { type: 'tween', duration: 0.5, ease: 'easeInOut' }
              : isWrong
                ? { duration: 0.4, ease: 'easeInOut' }
                : SPRING_BOUNCY
          }
        >
          {avatar}
        </CharacterDot>
      </CharacterRow>

      <TrackRail>
        <TrackFill animate={{ width: fillWidth }} transition={SPRING_GENTLE} />
      </TrackRail>

      <EndFlags>
        <span>🚩</span>
        <span>🏆</span>
      </EndFlags>
    </TrackWrapper>
  )
}
