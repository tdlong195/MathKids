'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { useGameStore } from '@/store/gameStore'
import { useProfileStore } from '@/store/profileStore'
import { ttsManager } from '@/lib/tts/ttsManager'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { InteractionRouter } from '@/components/game/interaction/InteractionRouter'
import { FeedbackOverlay } from '@/components/game/FeedbackOverlay'
import { ScoreBar } from '@/components/game/ScoreBar'
import { MuteButton } from '@/components/ui/MuteButton'
import { NumberRaceSession } from '@/components/game/session/NumberRaceSession'
import { PuzzleRevealSession } from '@/components/game/session/PuzzleRevealSession'
import { AchievementUnlockedModal } from '@/components/game/AchievementUnlockedModal'
import { soundManager } from '@/lib/sound/soundManager'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 480px;
  margin: 0 auto;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  min-width: ${({ theme }) => theme.touch.min};
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

const QuestionCounter = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`

const FEEDBACK_DELAY_CORRECT = 900
const FEEDBACK_DELAY_REVEALED = 1200

// Modes that skip QuestionDisplay prompt (board shows all context)
const FULL_BOARD_MODES = new Set(['memoryFlip', 'ordering'])

export default function PlayPage() {
  const router = useRouter()
  const { phase, questions, currentIndex, sessionStars, gameMode, submitAnswer, submitResult, nextQuestion, getCurrentQuestion, resetGame } = useGameStore()
  const { getCurrentProfile, awardStars, recordResultWithAchievements } = useProfileStore()
  const { newAchievementIds, setNewAchievements } = useGameStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  // Count correct answers for session wrapper visuals (numberRace / puzzleReveal)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const prevPhaseRef = useRef<string>(phase)

  const profile = getCurrentProfile()

  useEffect(() => {
    if (phase === 'idle') router.replace('/topics')
  }, [phase, router])

  // Detect feedback-correct transitions to increment correct answer counter
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      if (phase === 'feedback-correct') setCorrectAnswers(prev => prev + 1)
      prevPhaseRef.current = phase
    }
  }, [phase])

  // Show achievement modal when new achievements unlocked
  useEffect(() => {
    if (newAchievementIds.length > 0) {
      setShowAchievementModal(true)
    }
  }, [newAchievementIds])

  useEffect(() => {
    if (phase === 'feedback-correct') {
      const timer = setTimeout(() => {
        nextQuestion()
        setSelectedId(null)
      }, FEEDBACK_DELAY_CORRECT)
      return () => clearTimeout(timer)
    }
    if (phase === 'revealed') {
      const timer = setTimeout(() => {
        nextQuestion()
        setSelectedId(null)
      }, FEEDBACK_DELAY_REVEALED)
      return () => clearTimeout(timer)
    }
  }, [phase, nextQuestion])

  useEffect(() => {
    if (phase === 'celebration') {
      awardStars(sessionStars)
      router.replace('/results')
    }
  }, [phase, sessionStars, awardStars, router])

  // For choice-family boards
  const handleSelect = useCallback((choiceId: string) => {
    if (phase !== 'playing' && phase !== 'feedback-wrong') return
    if (phase === 'feedback-wrong' && choiceId === selectedId) return
    // Timeout from TimeAttack — treat as forced wrong
    if (choiceId === '__timeout__') {
      soundManager.play('wrong')
      const q = getCurrentQuestion()
      if (q) {
        const newAchievements = recordResultWithAchievements(q.topic, false)
        setNewAchievements(newAchievements)
      }
      submitResult(false)
      return
    }

    soundManager.play('click')
    const result = submitAnswer(choiceId)
    setSelectedId(choiceId)
    const question = getCurrentQuestion()
    if (question) {
      const newAchievements = recordResultWithAchievements(question.topic, result === 'correct')
      setNewAchievements(newAchievements)
    }
    if (result === 'correct') soundManager.play('correct')
    else soundManager.play('wrong')
  }, [phase, selectedId, submitAnswer, submitResult, getCurrentQuestion, recordResultWithAchievements, setNewAchievements])

  // For self-validating boards (ordering, memoryFlip)
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (phase !== 'playing') return
    const result = submitResult(isCorrect)
    const question = getCurrentQuestion()
    if (question) {
      const newAchievements = recordResultWithAchievements(question.topic, result === 'correct')
      setNewAchievements(newAchievements)
    }
    if (result === 'correct') soundManager.play('correct')
    else soundManager.play('wrong')
  }, [phase, submitResult, getCurrentQuestion, recordResultWithAchievements, setNewAchievements])

  const question = getCurrentQuestion()
  if (!question || phase === 'idle') return null

  const mode = question.interactionMode ?? 'choice'
  const showPrompt = !FULL_BOARD_MODES.has(mode)
  const avatar = profile?.avatar ?? '🐥'

  return (
    <PageWrapper>
      <TopBar>
        <BackButton
          onClick={() => { ttsManager.cancel(); resetGame(); router.replace('/topics') }}
          aria-label="Quay lại chọn bài"
        >
          ←
        </BackButton>
        <ScoreBar
          current={currentIndex}
          total={questions.length}
          stars={sessionStars}
        />
        <MuteButton />
      </TopBar>

      <QuestionCounter>
        Câu {currentIndex + 1} / {questions.length}
      </QuestionCounter>

      {gameMode === 'numberRace' && (
        <NumberRaceSession
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
          avatar={avatar}
          phase={phase}
        />
      )}

      {gameMode === 'puzzleReveal' && (
        <PuzzleRevealSession
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
        />
      )}

      <GameArea>
        {showPrompt && <QuestionDisplay question={question} />}

        <InteractionRouter
          question={question}
          phase={phase}
          selectedId={selectedId}
          onSelect={handleSelect}
          onAnswer={handleAnswer}
        />
      </GameArea>

      <FeedbackOverlay phase={phase} />

      {showAchievementModal && (
        <AchievementUnlockedModal
          achievementIds={newAchievementIds}
          onClose={() => {
            setShowAchievementModal(false)
            setNewAchievements([])
          }}
        />
      )}
    </PageWrapper>
  )
}
