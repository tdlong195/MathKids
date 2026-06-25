'use client'

import { AnswerChoices } from '@/components/game/AnswerChoices'
import type { Question } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

export function ChoiceBoard({ question, phase, selectedId, onSelect }: Props) {
  return (
    <AnswerChoices
      choices={question.choices}
      correctId={question.correctId}
      phase={phase}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  )
}
