'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import type { GamePhase } from '@/store/gameStore'

const OverlayWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
`

const FeedbackCard = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  pointer-events: none;
`

const FeedbackEmoji = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  line-height: 1;
`

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`

const CORRECT_MESSAGES = [
  'Tuyệt vời! 🌟',
  'Giỏi lắm! 🎉',
  'Đúng rồi! ⭐',
  'Xuất sắc! 🏆',
]

const WRONG_MESSAGES = [
  'Thử lại nhé! 💪',
  'Gần đúng rồi! 🤔',
  'Cố lên nhé! 😊',
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface Props {
  phase: GamePhase
}

export function FeedbackOverlay({ phase }: Props) {
  const showCorrect = phase === 'feedback-correct'
  const showWrong = phase === 'feedback-wrong'
  const visible = showCorrect || showWrong

  return (
    <AnimatePresence>
      {visible && (
        <OverlayWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FeedbackCard
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={SPRING_BOUNCY}
          >
            <FeedbackEmoji>{showCorrect ? '⭐' : '💪'}</FeedbackEmoji>
            <FeedbackText>
              {showCorrect
                ? randomFrom(CORRECT_MESSAGES)
                : randomFrom(WRONG_MESSAGES)}
            </FeedbackText>
          </FeedbackCard>
        </OverlayWrapper>
      )}
    </AnimatePresence>
  )
}
