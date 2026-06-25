'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { soundManager } from '@/lib/sound/soundManager'
import { SPRING_SNAP } from '@/lib/animation/springs'

const ButtonWrapper = styled(motion.button)`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  min-width: ${({ theme }) => theme.touch.min};
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

export function MuteButton() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    soundManager.loadMutePreference()
    setMuted(soundManager.isMuted())
  }, [])

  const toggle = () => {
    const next = !muted
    setMuted(next)
    soundManager.setMuted(next)
    soundManager.saveMutePreference()
  }

  return (
    <ButtonWrapper
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      transition={SPRING_SNAP}
      aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
    >
      {muted ? '🔇' : '🔊'}
    </ButtonWrapper>
  )
}
