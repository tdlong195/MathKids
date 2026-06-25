'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { ScoreBar } from '@/components/game/ScoreBar'
import { MuteButton } from '@/components/ui/MuteButton'
import { FeedbackOverlay } from '@/components/game/FeedbackOverlay'
import { AchievementUnlockedModal } from '@/components/game/AchievementUnlockedModal'
import { soundManager } from '@/lib/sound/soundManager'
import { SPRING_GENTLE, SPRING_SNAP } from '@/lib/animation/springs'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 100%;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ScoresRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`

const PlayerScore = styled.div<{ $isActive?: boolean }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primaryLight : theme.colors.surface};
  min-width: 140px;
`

const PlayerName = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ScoreText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  margin-top: 4px;
`

const QuestionArea = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
`

const SplitArea = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 300px;
`

const PlayerSide = styled.div<{ $playerId: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $playerId }) =>
    $playerId === 1 ? 'rgba(100, 150, 255, 0.1)' : 'rgba(255, 100, 150, 0.1)'};
  border-radius: ${({ theme }) => theme.radius.lg};
`

const PlayerLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ChoicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`

const ChoiceButton = styled(motion.button)<{ $selected?: boolean; $correct?: boolean; $wrong?: boolean }>`
  min-height: 72px;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid
    ${({ theme, $selected, $correct, $wrong }) =>
      $correct ? theme.colors.correct : $wrong ? '#F44336' : theme.colors.border};
  background: ${({ theme, $selected, $correct, $wrong }) => {
    if ($correct) return theme.colors.correctLight;
    if ($wrong) return '#FFEBEE';
    if ($selected) return theme.colors.primaryLight;
    return theme.colors.surface;
  }};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`

const FEEDBACK_DELAY = 900

export default function TwoPlayerPlayPage() {
  const router = useRouter()
  const {
    questions,
    currentIndex,
    phase,
    twoPlayerSession,
    nextQuestion,
    submitAnswerPlayer,
  } = useGameStore()

  const [selectedP1, setSelectedP1] = useState<string | null>(null)
  const [selectedP2, setSelectedP2] = useState<string | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)

  useEffect(() => {
    if (!twoPlayerSession || questions.length === 0) {
      router.replace('/')
    }
  }, [twoPlayerSession, questions, router])

  useEffect(() => {
    if (phase === 'feedback-correct' || phase === 'feedback-wrong') {
      const timer = setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          // End session
          router.replace('/results')
        } else {
          nextQuestion()
          setSelectedP1(null)
          setSelectedP2(null)
        }
      }, FEEDBACK_DELAY)
      return () => clearTimeout(timer)
    }
  }, [phase, currentIndex, questions.length, nextQuestion, router])

  if (!twoPlayerSession || questions.length === 0) return null

  const question = questions[currentIndex]
  const p1Correct = phase === 'feedback-correct' && selectedP1 === question.correctId
  const p2Correct = phase === 'feedback-correct' && selectedP2 === question.correctId

  const handleSelectP1 = (choiceId: string) => {
    if (phase !== 'playing' || selectedP1) return
    soundManager.play('click')
    setSelectedP1(choiceId)
    submitAnswerPlayer(1, choiceId)
  }

  const handleSelectP2 = (choiceId: string) => {
    if (phase !== 'playing' || selectedP2) return
    soundManager.play('click')
    setSelectedP2(choiceId)
    submitAnswerPlayer(2, choiceId)
  }

  return (
    <PageWrapper>
      <TopBar>
        <div></div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          Câu {currentIndex + 1} / {questions.length}
        </div>
        <MuteButton />
      </TopBar>

      <ScoresRow>
        <PlayerScore $isActive={!selectedP1}>
          <PlayerName>👶 {twoPlayerSession.player1Name}</PlayerName>
          <ScoreText>✓ {twoPlayerSession.player1Correct}</ScoreText>
        </PlayerScore>
        <PlayerScore $isActive={!selectedP2}>
          <PlayerName>👧 {twoPlayerSession.player2Name}</PlayerName>
          <ScoreText>✓ {twoPlayerSession.player2Correct}</ScoreText>
        </PlayerScore>
      </ScoresRow>

      <QuestionArea>
        <QuestionDisplay question={question} />
      </QuestionArea>

      <SplitArea>
        <PlayerSide $playerId={1}>
          <PlayerLabel>Bé 1 - Tap trái</PlayerLabel>
          <ChoicesGrid>
            {question.choices.map(choice => (
              <ChoiceButton
                key={choice.id}
                onClick={() => handleSelectP1(choice.id)}
                disabled={phase !== 'playing' || selectedP1 !== null}
                $selected={selectedP1 === choice.id}
                $correct={selectedP1 === choice.id && p1Correct}
                $wrong={selectedP1 === choice.id && !p1Correct && phase !== 'playing'}
                whileTap={selectedP1 ? {} : { scale: 0.95 }}
                transition={SPRING_SNAP}
              >
                {choice.label}
              </ChoiceButton>
            ))}
          </ChoicesGrid>
        </PlayerSide>

        <PlayerSide $playerId={2}>
          <PlayerLabel>Bé 2 - Tap phải</PlayerLabel>
          <ChoicesGrid>
            {question.choices.map(choice => (
              <ChoiceButton
                key={choice.id}
                onClick={() => handleSelectP2(choice.id)}
                disabled={phase !== 'playing' || selectedP2 !== null}
                $selected={selectedP2 === choice.id}
                $correct={selectedP2 === choice.id && p2Correct}
                $wrong={selectedP2 === choice.id && !p2Correct && phase !== 'playing'}
                whileTap={selectedP2 ? {} : { scale: 0.95 }}
                transition={SPRING_SNAP}
              >
                {choice.label}
              </ChoiceButton>
            ))}
          </ChoicesGrid>
        </PlayerSide>
      </SplitArea>

      <FeedbackOverlay phase={phase} />
    </PageWrapper>
  )
}
