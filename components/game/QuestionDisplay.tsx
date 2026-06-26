'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_GENTLE, SPRING_SNAP } from '@/lib/animation/springs'
import { ttsManager } from '@/lib/tts/ttsManager'
import type { Question } from '@/types/question'

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`

const EmojiGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  max-width: 320px;
`

const EmojiItem = styled(motion.span)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: 1.2;
`

const PromptText = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  line-height: 1.2;
`

const ReadAloudButton = styled(motion.button)`
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  min-width: 56px;
  min-height: 56px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

interface Props {
  question: Question
}

export function QuestionDisplay({ question }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supported = ttsManager.isSupported()

  const speak = () => {
    if (!supported) return
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current)
    setSpeaking(true)
    ttsManager.speak(question.prompt)
    // SpeechSynthesis onend is unreliable in many browsers; use a fallback timer
    speakingTimerRef.current = setTimeout(() => setSpeaking(false), 4000)
  }

  useEffect(() => {
    ttsManager.loadPreference()
    // Delay slightly so the enter animation plays first
    const timer = setTimeout(speak, 350)
    return () => {
      clearTimeout(timer)
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current)
      ttsManager.cancel()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -60, opacity: 0 }}
        transition={SPRING_GENTLE}
      >
        <DisplayWrapper>
          {question.visualEmojis && question.visualEmojis.length > 0 && (
            <EmojiGrid>
              {question.visualEmojis.map((em, i) => (
                <EmojiItem
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ ...SPRING_GENTLE, delay: i * 0.05 }}
                >
                  {em}
                </EmojiItem>
              ))}
            </EmojiGrid>
          )}
          <PromptText>{question.prompt}</PromptText>
          {supported && (
            <ReadAloudButton
              onClick={speak}
              whileTap={{ scale: 0.85 }}
              transition={SPRING_SNAP}
              animate={speaking ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              aria-label="Đọc lại câu hỏi"
              title="Đọc lại câu hỏi"
            >
              {speaking ? '🔊' : '🔈'}
            </ReadAloudButton>
          )}
        </DisplayWrapper>
      </motion.div>
    </AnimatePresence>
  )
}
