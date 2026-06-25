import { create } from 'zustand'
import type { Question } from '@/types/question'
import type { Topic, AgeGroup, GameMode } from '@/types/topic'
import type { TwoPlayerSession } from '@/types/twoPlayer'

export type GamePhase = 'idle' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'revealed' | 'celebration'

interface GameStore {
  topic: Topic | null
  ageGroup: AgeGroup | null
  gameMode: GameMode
  questions: Question[]
  currentIndex: number
  sessionStars: number
  totalSessionStars: number
  attempts: number
  phase: GamePhase
  newAchievementIds: string[]
  isTwoPlayer: boolean
  twoPlayerSession: TwoPlayerSession | null
  // Actions
  startSession: (topic: Topic, ageGroup: AgeGroup, questions: Question[], gameMode?: GameMode) => void
  startTwoPlayerSession: (player1Name: string, player2Name: string, questions: Question[]) => void
  submitAnswer: (choiceId: string) => 'correct' | 'wrong'
  submitResult: (isCorrect: boolean) => 'correct' | 'wrong'  // for non-choice boards
  submitAnswerPlayer: (playerId: 1 | 2, choiceId: string) => 'correct' | 'wrong'
  submitResultPlayer: (playerId: 1 | 2, isCorrect: boolean) => 'correct' | 'wrong'
  nextQuestion: () => void
  endSession: () => void
  resetGame: () => void
  setNewAchievements: (ids: string[]) => void
  getCurrentQuestion: () => Question | null
}

export const useGameStore = create<GameStore>((set, get) => ({
  topic: null,
  ageGroup: null,
  gameMode: 'standard',
  questions: [],
  currentIndex: 0,
  sessionStars: 0,
  totalSessionStars: 0,
  attempts: 0,
  phase: 'idle',
  newAchievementIds: [],
  isTwoPlayer: false,
  twoPlayerSession: null,

  startSession: (topic, ageGroup, questions, gameMode = 'standard') => {
    set({
      topic,
      ageGroup,
      gameMode,
      questions,
      currentIndex: 0,
      sessionStars: 0,
      totalSessionStars: questions.length * 2,
      attempts: 0,
      phase: 'playing',
    })
  },

  submitAnswer: (choiceId) => {
    const { questions, currentIndex } = get()
    const question = questions[currentIndex]
    return get().submitResult(choiceId === question.correctId)
  },

  submitResult: (isCorrect) => {
    const { attempts, sessionStars } = get()
    const newAttempts = attempts + 1

    if (isCorrect) {
      const earned = newAttempts === 1 ? 2 : 1
      set({ sessionStars: sessionStars + earned, attempts: newAttempts, phase: 'feedback-correct' })
      return 'correct'
    } else {
      if (newAttempts >= 2) {
        set({ attempts: newAttempts, phase: 'revealed' })
      } else {
        set({ attempts: newAttempts, phase: 'feedback-wrong' })
      }
      return 'wrong'
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    const next = currentIndex + 1
    if (next >= questions.length) {
      set({ phase: 'celebration' })
    } else {
      set({ currentIndex: next, attempts: 0, phase: 'playing' })
    }
  },

  endSession: () => set({ phase: 'celebration' }),

  resetGame: () =>
    set({
      topic: null,
      ageGroup: null,
      gameMode: 'standard',
      questions: [],
      currentIndex: 0,
      sessionStars: 0,
      totalSessionStars: 0,
      attempts: 0,
      phase: 'idle',
      isTwoPlayer: false,
      twoPlayerSession: null,
    }),

  startTwoPlayerSession: (player1Name, player2Name, questions) => {
    set({
      isTwoPlayer: true,
      twoPlayerSession: {
        player1Id: null,
        player2Id: null,
        player1Name,
        player2Name,
        player1Correct: 0,
        player2Correct: 0,
        player1Wrong: 0,
        player2Wrong: 0,
      },
      questions,
      currentIndex: 0,
      attempts: 0,
      phase: 'playing',
    })
  },

  submitAnswerPlayer: (playerId, choiceId) => {
    const { questions, currentIndex, twoPlayerSession } = get()
    const question = questions[currentIndex]
    const isCorrect = choiceId === question.correctId
    const newSession = { ...twoPlayerSession! }

    if (isCorrect) {
      if (playerId === 1) newSession.player1Correct++
      else newSession.player2Correct++
    } else {
      if (playerId === 1) newSession.player1Wrong++
      else newSession.player2Wrong++
    }

    set({ twoPlayerSession: newSession, phase: isCorrect ? 'feedback-correct' : 'feedback-wrong', attempts: get().attempts + 1 })
    return isCorrect ? 'correct' : 'wrong'
  },

  submitResultPlayer: (playerId, isCorrect) => {
    const { twoPlayerSession } = get()
    const newSession = { ...twoPlayerSession! }

    if (isCorrect) {
      if (playerId === 1) newSession.player1Correct++
      else newSession.player2Correct++
    } else {
      if (playerId === 1) newSession.player1Wrong++
      else newSession.player2Wrong++
    }

    set({ twoPlayerSession: newSession, phase: isCorrect ? 'feedback-correct' : 'feedback-wrong' })
    return isCorrect ? 'correct' : 'wrong'
  },

  setNewAchievements: (ids) => set({ newAchievementIds: ids }),

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get()
    return questions[currentIndex] ?? null
  },
}))
