'use client'

import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Reorder } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/lib/animation/springs'
import type { Question } from '@/types/question'
import type { OrderingData } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: 280px;
`

const OrderItem = styled(motion.div)<{ $correct?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $correct }) =>
    $correct === true ? theme.colors.correctLight : theme.colors.surface};
  border: 3px solid
    ${({ theme, $correct }) =>
      $correct === true ? theme.colors.correct : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  min-height: 80px;
  cursor: grab;
  touch-action: none;
  font-size: 2rem;
  user-select: none;
`

const SizeLabel = styled.span<{ $rank: number }>`
  font-size: 1.2rem;
  transform: scale(${({ $rank }) => 0.7 + $rank * 0.3});
  display: inline-block;
`

const SubmitButton = styled(motion.button)`
  min-height: ${({ theme }) => theme.touch.lg};
  min-width: 160px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 800;
  font-family: inherit;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
`

const ResultText = styled(motion.p)<{ $correct: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme, $correct }) => $correct ? theme.colors.correct : theme.colors.wrong};
  text-align: center;
`

interface OrderItem {
  id: string
  emoji: string
  sizeRank: number
}

interface Props {
  question: Question
  phase: GamePhase
  onAnswer: (isCorrect: boolean) => void
}

export function OrderingBoard({ question, phase, onAnswer }: Props) {
  const data = question.interactionData as OrderingData | undefined
  const [items, setItems] = useState<OrderItem[]>(() =>
    data ? [...data.items] : []
  )
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = useCallback(() => {
    if (!data || submitted || phase !== 'playing') return
    // Check if items are in the correct sizeRank order
    const ordered = data.direction === 'asc'
      ? items.every((item, i) => i === 0 || item.sizeRank >= items[i - 1].sizeRank)
      : items.every((item, i) => i === 0 || item.sizeRank <= items[i - 1].sizeRank)
    setIsCorrect(ordered)
    setSubmitted(true)
    onAnswer(ordered)
  }, [data, submitted, phase, items, onAnswer])

  if (!data) return null

  return (
    <Wrapper>
      <Reorder.Group axis="y" values={items} onReorder={setItems} as="div" style={{ width: '100%', maxWidth: 280 }}>
        {items.map(item => (
          <Reorder.Item key={item.id} value={item} as="div">
            <OrderItem
              $correct={submitted && isCorrect === true}
              whileDrag={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
            >
              <SizeLabel $rank={item.sizeRank}>{item.emoji}</SizeLabel>
            </OrderItem>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {!submitted && (
        <SubmitButton
          onClick={handleSubmit}
          whileTap={{ scale: 0.94 }}
          transition={SPRING_GENTLE}
        >
          Xong! ✅
        </SubmitButton>
      )}

      {submitted && isCorrect !== null && (
        <ResultText
          $correct={isCorrect}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING_BOUNCY}
        >
          {isCorrect ? 'Đúng rồi! 🎉' : 'Thử lại nhé! 💪'}
        </ResultText>
      )}
    </Wrapper>
  )
}
