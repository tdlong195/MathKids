'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_SNAP } from '@/lib/animation/springs'
import { soundManager } from '@/lib/sound/soundManager'

interface KidButtonProps {
  $variant?: 'primary' | 'secondary' | 'ghost'
  $size?: 'md' | 'lg'
}

const ButtonBase = styled(motion.button)<KidButtonProps>`
  min-height: ${({ theme, $size }) => ($size === 'lg' ? theme.touch.lg : theme.touch.min)};
  min-width: ${({ theme, $size }) => ($size === 'lg' ? theme.touch.lg : theme.touch.min)};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme, $size }) => ($size === 'lg' ? theme.fontSize.lg : theme.fontSize.md)};
  font-weight: 800;
  font-family: inherit;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;
  background: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.secondary
      : $variant === 'ghost'
        ? 'transparent'
        : theme.colors.primary};
  color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.primary : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

interface Props extends React.ComponentProps<typeof ButtonBase> {
  playSound?: boolean
}

export function KidButton({ children, playSound = true, onClick, ...props }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound) soundManager.play('click')
    onClick?.(e)
  }

  return (
    <ButtonBase
      whileTap={{ scale: 0.92 }}
      transition={SPRING_SNAP}
      onClick={handleClick}
      {...props}
    >
      {children}
    </ButtonBase>
  )
}
