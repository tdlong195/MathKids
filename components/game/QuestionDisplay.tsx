'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_GENTLE } from '@/lib/animation/springs'
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

interface Props {
  question: Question
}

export function QuestionDisplay({ question }: Props) {
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
        </DisplayWrapper>
      </motion.div>
    </AnimatePresence>
  )
}
