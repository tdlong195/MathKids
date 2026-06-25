'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import { ACHIEVEMENTS } from '@/types/achievement'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`

const ModalBox = styled(motion.div)`
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

const BadgeEmoji = styled(motion.div)`
  font-size: 5rem;
  line-height: 1;
`

const BadgeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`

const BadgeDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  font-weight: 600;
`

const Confetti = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;
`

interface Props {
  achievementIds: string[]
  onClose: () => void
}

export function AchievementUnlockedModal({ achievementIds, onClose }: Props) {
  if (achievementIds.length === 0) return null

  // Show first achievement (or could queue them)
  const firstId = achievementIds[0]
  const achievement = ACHIEVEMENTS[firstId]

  if (!achievement) return null

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Confetti animation */}
        {[...Array(12)].map((_, i) => (
          <Confetti
            key={i}
            initial={{
              x: Math.random() * 200 - 100,
              y: -100,
              opacity: 1,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: 400,
              opacity: 0,
              rotate: Math.random() * 720,
            }}
            transition={{ duration: 2.5, ease: 'easeIn' }}
          >
            {['🎉', '⭐', '🎊', '✨'][Math.floor(Math.random() * 4)]}
          </Confetti>
        ))}

        <ModalBox
          initial={{ scale: 0.5, opacity: 0, rotateX: -180 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={SPRING_BOUNCY}
          onClick={e => e.stopPropagation()}
          style={{ perspective: 1000 }}
        >
          <BadgeEmoji
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            {achievement.emoji}
          </BadgeEmoji>

          <BadgeTitle>
            🎉 Huy hiệu mới!
          </BadgeTitle>

          <BadgeTitle style={{ fontSize: '1.5rem', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            {achievement.label}
          </BadgeTitle>

          <BadgeDesc>
            {achievement.description}
          </BadgeDesc>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.3 }}
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Độ hiếm: {achievement.rarity === 'common' ? 'Phổ biến' : achievement.rarity === 'rare' ? 'Hiếm' : achievement.rarity === 'epic' ? 'Epic' : 'Huyền thoại'}
          </motion.div>
        </ModalBox>
      </ModalOverlay>
    </AnimatePresence>
  )
}
