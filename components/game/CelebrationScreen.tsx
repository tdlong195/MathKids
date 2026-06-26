'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_SLOW, SPRING_BOUNCY } from '@/lib/animation/springs'
import { KidButton } from '@/components/ui/KidButton'

const ScreenWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`

const AnimatedStar = styled(motion.span)`
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
`

const ScoreCard = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.xxl}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1;
`

const TitleText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`

const StarsEarned = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.star};
`

const SubText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  z-index: 1;
`

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const STAR_COUNT = 10
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  left: randomInt(2, 98),
  rotate: randomInt(-30, 30),
  delay: i * 0.12,
}))

interface Props {
  starsEarned: number
  totalPossible: number
  onContinue: () => void
  onHome: () => void
}

export function CelebrationScreen({ starsEarned, totalPossible, onContinue, onHome }: Props) {
  const pct = totalPossible > 0 ? Math.round((starsEarned / totalPossible) * 100) : 0
  const message =
    pct >= 80 ? 'Xuất sắc! Bé thật tuyệt! 🏆' :
    pct >= 50 ? 'Giỏi lắm! Tiếp tục nhé! 🌟' :
    'Cố lên! Lần sau sẽ tốt hơn! 💪'

  return (
    <ScreenWrapper>
      {/* Falling stars animation */}
      {stars.map(s => (
        <AnimatedStar
          key={s.id}
          initial={{ y: -100, opacity: 0, rotate: s.rotate }}
          animate={{ y: '110vh', opacity: 1 }}
          transition={{ type: 'tween', duration: 2.5, delay: s.delay, ease: 'easeIn' }}
          style={{ left: `${s.left}%` }}
        >
          ⭐
        </AnimatedStar>
      ))}

      <ScoreCard
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_SLOW, delay: 0.4 }}
      >
        <motion.span
          style={{ fontSize: '4rem', display: 'inline-block' }}
          animate={{ rotate: 10 }}
          transition={{ type: 'tween', duration: 0.15, delay: 0.8, repeat: 5, repeatType: 'mirror' }}
        >
          🎉
        </motion.span>
        <TitleText>{message}</TitleText>
        <StarsEarned>⭐ {starsEarned}</StarsEarned>
        <SubText>trên tổng {totalPossible} sao</SubText>
      </ScoreCard>

      <ButtonRow>
        <KidButton $variant="primary" $size="lg" onClick={onContinue} style={{ width: '100%' }}>
          Chơi tiếp 🚀
        </KidButton>
        <KidButton $variant="ghost" onClick={onHome} style={{ width: '100%' }}>
          Chọn bài khác 📚
        </KidButton>
      </ButtonRow>
    </ScreenWrapper>
  )
}
