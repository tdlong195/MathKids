'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`

const ProgressTrack = styled.div`
  flex: 1;
  height: 12px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  transform-origin: left;
`

const StarsText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.star};
  white-space: nowrap;
`

interface Props {
  current: number   // 0-based index of current question
  total: number
  stars: number
}

export function ScoreBar({ current, total, stars }: Props) {
  const progress = total > 0 ? current / total : 0

  return (
    <BarWrapper>
      <ProgressTrack>
        <ProgressFill
          animate={{ scaleX: progress }}
          initial={{ scaleX: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </ProgressTrack>
      <StarsText>⭐ {stars}</StarsText>
    </BarWrapper>
  )
}
