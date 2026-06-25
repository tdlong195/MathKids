'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_GENTLE, SPRING_SNAP } from '@/lib/animation/springs'
import type { Profile } from '@/types/profile'

const CardOuter = styled.div`
  width: 100%;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const CardWrapper = styled(motion.button)`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.touch.lg};
  min-height: ${({ theme }) => theme.touch.lg};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-family: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`

const AvatarText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: 1;
`

const NameText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const StarsText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const StreakBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
  color: #ff6b00;
  background: #fff3e0;
  padding: ${({ theme }) => `4px ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.md};
`

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;

  ${CardOuter}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`

const ActionButton = styled(motion.button)`
  min-width: 40px;
  min-height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

interface Props {
  profile: Profile
  onClick: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onViewProgress?: (id: string) => void
}

export function ProfileCard({ profile, onClick, onEdit, onDelete, onViewProgress }: Props) {
  return (
    <CardOuter>
      <CardWrapper
        onClick={onClick}
        whileHover={{ y: -6, scale: 1.03, borderColor: '#FF6B35' }}
        whileTap={{ scale: 0.96 }}
        transition={SPRING_GENTLE}
      >
        <AvatarText>{profile.avatar}</AvatarText>
        <NameText>{profile.name}</NameText>
        <StarsText>⭐ {profile.stars}</StarsText>
        {profile.currentStreak > 0 && (
          <StreakBadge initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING_GENTLE}>
            🔥 {profile.currentStreak}
          </StreakBadge>
        )}
      </CardWrapper>

      <ActionRow>
        {onViewProgress && (
          <ActionButton
            onClick={e => {
              e.stopPropagation()
              onViewProgress(profile.id)
            }}
            whileTap={{ scale: 0.85 }}
            transition={SPRING_SNAP}
            title="Tiến trình"
          >
            📊
          </ActionButton>
        )}
        {onEdit && (
          <ActionButton
            onClick={e => {
              e.stopPropagation()
              onEdit(profile.id)
            }}
            whileTap={{ scale: 0.85 }}
            transition={SPRING_SNAP}
            title="Sửa"
          >
            ✏️
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton
            onClick={e => {
              e.stopPropagation()
              onDelete(profile.id)
            }}
            whileTap={{ scale: 0.85 }}
            transition={SPRING_SNAP}
            title="Xóa"
          >
            🗑️
          </ActionButton>
        )}
      </ActionRow>
    </CardOuter>
  )
}
