import type { Question, Choice, InteractionMode, InteractionData } from '@/types/question'
import type { Topic, AgeGroup } from '@/types/topic'
import { TOPIC_META } from '@/types/topic'
import { generateCounting } from './counting'
import { generateShapes } from './shapes'
import { generateAddition } from './addition'
import { generateSubtraction } from './subtraction'
import { generateComparison } from './comparison'
import { generateSequence } from './sequence'
import { generateQuantityMatch } from './quantityMatch'
import { generateSizeOrdering } from './sizeOrdering'
import { generateMemoryMatch } from './memoryMatch'
import { generateWordProblem } from './wordProblem'
import { generateBalanceScale } from './balanceScale'
import { generateMultiplication } from './multiplication'
import { generateDivision } from './division'
import { generateClock } from './clock'
import { generateMeasurement } from './measurement'
import { generateMoney } from './money'
import { generateFractions } from './fractions'
import { generateFractionCompare } from './fractionCompare'
import { generateGeometry } from './geometry'
import { generatePatternSeq } from './patternSeq'
import { generateOddOneOut } from './oddOneOut'
import { generateGridPattern } from './gridPattern'
import { generateAnalogies } from './analogyThinking'
import { generateLogicSort } from './logicSort'
import { generateCodeSequence } from './codeSequence'
import { generateSubitizing } from './subitizing'
import { generateColorRecognition } from './colorRecognition'
import { generateSoundMatching } from './soundMatching'

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateDistractors(
  correct: number,
  max: number,
  count: number
): number[] {
  const pool = new Set<number>()
  const maxOffset = Math.min(3, Math.max(1, Math.floor(max / 3)))
  let attempts = count * 20
  while (pool.size < count && attempts > 0) {
    attempts--
    const offset = randomInt(1, maxOffset)
    const sign = Math.random() > 0.5 ? 1 : -1
    const candidate = correct + sign * offset
    if (candidate >= 0 && candidate !== correct) pool.add(candidate)
  }
  let fill = correct + 1
  while (pool.size < count) {
    if (fill !== correct) pool.add(fill)
    fill++
  }
  return Array.from(pool)
}

export function buildChoices(
  correct: number,
  distractors: number[]
): { choices: Choice[]; correctId: string } {
  const all = [correct, ...distractors].map((n, i) => ({
    id: `c-${i}`,
    label: String(n),
    value: n,
  }))
  for (let i = all.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const correctChoice = all.find(c => c.value === correct)!
  return {
    choices: all.map(({ id, label }) => ({ id, label })),
    correctId: correctChoice.id,
  }
}

export function buildQuestion(params: {
  topic: string
  interactionMode?: InteractionMode
  prompt: string
  visualEmojis?: string[]
  correct: number
  distractors: number[]
  difficulty: 1 | 2 | 3
  timeLimit?: number
  interactionData?: InteractionData
}): Question {
  const { choices, correctId } = buildChoices(params.correct, params.distractors)
  return {
    id: `${params.topic}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topic: params.topic,
    interactionMode: params.interactionMode ?? 'choice',
    prompt: params.prompt,
    visualEmojis: params.visualEmojis,
    choices,
    correctId,
    difficulty: params.difficulty,
    timeLimit: params.timeLimit,
    interactionData: params.interactionData,
  }
}

const AGE_DIFFICULTY: Record<AgeGroup, 1 | 2 | 3> = {
  '3-4': 1,
  '5-6': 2,
  '7-8': 2,
  '9-10': 3,
}

export function generateQuestion(topic: Topic, ageGroup: AgeGroup): Question {
  const difficulty = AGE_DIFFICULTY[ageGroup]
  switch (topic) {
    case 'counting':        return generateCounting(difficulty)
    case 'shapes':          return generateShapes(difficulty)
    case 'quantityMatch':   return generateQuantityMatch(difficulty)
    case 'comparison':      return generateComparison(difficulty)
    case 'sizeOrdering':    return generateSizeOrdering(difficulty)
    case 'memoryMatch':     return generateMemoryMatch(difficulty)
    case 'addition':        return generateAddition(difficulty)
    case 'subtraction':     return generateSubtraction(difficulty)
    case 'sequence':        return generateSequence(difficulty)
    case 'wordProblem':     return generateWordProblem(difficulty)
    case 'balanceScale':    return generateBalanceScale(difficulty)
    case 'multiplication':  return generateMultiplication(difficulty)
    case 'division':        return generateDivision(difficulty)
    case 'clock':           return generateClock(difficulty)
    case 'measurement':     return generateMeasurement(difficulty)
    case 'money':           return generateMoney(difficulty)
    case 'fractions':       return generateFractions(difficulty)
    case 'fractionCompare': return generateFractionCompare(difficulty)
    case 'geometry':        return generateGeometry(difficulty)
    case 'patternSeq':      return generatePatternSeq(difficulty)
    case 'oddOneOut':       return generateOddOneOut(difficulty)
    case 'gridPattern':     return generateGridPattern(difficulty)
    case 'analogyThinking': return generateAnalogies(difficulty)
    case 'logicSort':       return generateLogicSort(difficulty)
    case 'codeSequence':    return generateCodeSequence(difficulty as 2 | 3)
    case 'subitizing':      return generateSubitizing(difficulty)
    case 'colorRecognition': return generateColorRecognition(difficulty)
    case 'soundMatching':   return generateSoundMatching(difficulty)
    default:
      throw new Error(`Unknown topic: ${topic}`)
  }
}

const SESSION_LENGTH: Record<AgeGroup, number> = {
  '3-4': 5,
  '5-6': 10,
  '7-8': 10,
  '9-10': 10,
}

export function generateSession(topic: Topic, ageGroup: AgeGroup): Question[] {
  const count = SESSION_LENGTH[ageGroup]
  return Array.from({ length: count }, () => generateQuestion(topic, ageGroup))
}

export function generateMixedSession(ageGroup: AgeGroup): Question[] {
  // Get all available topics for this age group
  const availableTopics = TOPIC_META.filter(t => t.ageGroups.includes(ageGroup)).map(t => t.id as Topic)

  // Shuffle and pick subset of topics
  const shuffled = [...availableTopics].sort(() => Math.random() - 0.5)
  const sessionLength = SESSION_LENGTH[ageGroup]
  const topicsToUse = shuffled.slice(0, Math.ceil(sessionLength / 2)) // Use 2-5 topics

  // Generate questions, cycling through topics
  const questions: Question[] = []
  for (let i = 0; i < sessionLength; i++) {
    const topic = topicsToUse[i % topicsToUse.length]
    questions.push(generateQuestion(topic, ageGroup))
  }

  return questions
}
