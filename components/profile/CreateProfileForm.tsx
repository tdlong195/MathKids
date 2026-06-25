'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { KidButton } from '@/components/ui/KidButton'
import { SPRING_BOUNCY } from '@/lib/animation/springs'
import type { AgeGroup } from '@/types/topic'

const AVATAR_OPTIONS = ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐸', '🐧', '🦄', '🐬', '🦋', '🌟']

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: '3-4', label: '3-4 tuổi' },
  { value: '5-6', label: '5-6 tuổi' },
  { value: '7-8', label: '7-8 tuổi' },
  { value: '9-10', label: '9-10 tuổi' },
]

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
  width: 100%;
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const NameInput = styled.input`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: inherit;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  min-height: ${({ theme }) => theme.touch.min};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`

const AvatarButton = styled(motion.button)<{ $selected: boolean }>`
  font-size: 2rem;
  min-width: ${({ theme }) => theme.touch.min};
  min-height: ${({ theme }) => theme.touch.min};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AgeGroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`

const AgeButton = styled(motion.button)<{ $selected: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  font-family: inherit;
  min-height: ${({ theme }) => theme.touch.min};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`

interface Props {
  onSubmit: (data: { name: string; avatar: string; ageGroup: AgeGroup }) => void
  onCancel: () => void
  initialData?: { name: string; avatar: string; ageGroup: AgeGroup }
}

export function CreateProfileForm({ onSubmit, onCancel, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [avatar, setAvatar] = useState(initialData?.avatar ?? AVATAR_OPTIONS[0])
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialData?.ageGroup ?? '3-4')

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({ name: name.trim(), avatar, ageGroup })
  }

  return (
    <FormWrapper>
      <Label>
        Tên bé
        <NameInput
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nhập tên bé..."
          maxLength={20}
        />
      </Label>

      <Label>
        Chọn avatar
        <AvatarGrid>
          {AVATAR_OPTIONS.map(em => (
            <AvatarButton
              key={em}
              $selected={avatar === em}
              onClick={() => setAvatar(em)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: avatar === em ? 1 : 1.12 }}
              animate={avatar === em ? { scale: 1.1 } : { scale: 1 }}
              transition={SPRING_BOUNCY}
              type="button"
            >
              {em}
            </AvatarButton>
          ))}
        </AvatarGrid>
      </Label>

      <Label>
        Nhóm tuổi
        <AgeGroupGrid>
          {AGE_GROUPS.map(ag => (
            <AgeButton
              key={ag.value}
              $selected={ageGroup === ag.value}
              onClick={() => setAgeGroup(ag.value)}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              {ag.label}
            </AgeButton>
          ))}
        </AgeGroupGrid>
      </Label>

      <KidButton
        $variant="primary"
        $size="lg"
        onClick={handleSubmit}
        disabled={!name.trim()}
        style={{ width: '100%', opacity: name.trim() ? 1 : 0.5 }}
      >
        {initialData ? 'Lưu thay đổi ✓' : 'Tạo hồ sơ 🎉'}
      </KidButton>

      <KidButton $variant="ghost" onClick={onCancel}>
        Quay lại
      </KidButton>
    </FormWrapper>
  )
}
