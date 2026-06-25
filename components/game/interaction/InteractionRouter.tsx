'use client'

// Routes a Question to the correct interaction board based on interactionMode.
// Choice-family boards (choice/tapCount/dragDrop/balanceScale/ballShoot/timeAttack)
// call onSelect(choiceId) — parent validates via submitAnswer().
// Self-validating boards (ordering/memoryFlip) call onAnswer(isCorrect)
// — parent validates via submitResult().

import type { Question } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'
import { ChoiceBoard } from './ChoiceBoard'
import { TapCountBoard } from './TapCountBoard'
import { DragDropBoard } from './DragDropBoard'
import { OrderingBoard } from './OrderingBoard'
import { MemoryMatchBoard } from './MemoryMatchBoard'
import { BalanceScaleBoard } from './BalanceScaleBoard'
import { BallShootBoard } from './BallShootBoard'
import { ClockDragBoard } from './ClockDragBoard'
import { TimeAttackBoard } from './TimeAttackBoard'

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
  onAnswer: (isCorrect: boolean) => void
}

export function InteractionRouter({ question, phase, selectedId, onSelect, onAnswer }: Props) {
  const mode = question.interactionMode ?? 'choice'

  switch (mode) {
    case 'tapCount':
      return (
        <TapCountBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )

    case 'dragDrop':
      return (
        <DragDropBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
          onAnswer={onAnswer}
        />
      )

    case 'ordering':
      return (
        <OrderingBoard
          key={question.id}
          question={question}
          phase={phase}
          onAnswer={onAnswer}
        />
      )

    case 'memoryFlip':
      return (
        <MemoryMatchBoard
          key={question.id}
          question={question}
          phase={phase}
          onAnswer={onAnswer}
        />
      )

    case 'balanceScale':
      return (
        <BalanceScaleBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )

    case 'ballShoot':
      return (
        <BallShootBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )

    case 'clockDrag':
      return (
        <ClockDragBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )

    case 'timeAttack':
      return (
        <TimeAttackBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )

    case 'choice':
    default:
      return (
        <ChoiceBoard
          key={question.id}
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )
  }
}
