'use client'

// Clock board: shows an analog clock face (SVG) at the target time.
// Child reads the clock and taps the correct time from 4 choice buttons.

import styled from 'styled-components'
import { AnswerChoices } from '@/components/game/AnswerChoices'
import type { Question } from '@/types/question'
import type { ClockDragData } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

const ClockSvg = styled.svg`
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
`

function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  const cx = 100
  const cy = 100
  const r = 90

  // Hand angles: 0° = 12 o'clock, clockwise
  const minuteDeg = (minute / 60) * 360
  const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30

  function handEnd(deg: number, len: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + len * Math.cos(rad), y: cy + len * Math.sin(rad) }
  }

  const hEnd = handEnd(hourDeg, 52)
  const mEnd = handEnd(minuteDeg, 72)

  // Hour markers
  const markers = Array.from({ length: 12 }, (_, i) => {
    const deg = (i / 12) * 360
    const rad = ((deg - 90) * Math.PI) / 180
    const inner = i % 3 === 0 ? 74 : 80
    const outer = 88
    return {
      x1: cx + inner * Math.cos(rad),
      y1: cy + inner * Math.sin(rad),
      x2: cx + outer * Math.cos(rad),
      y2: cy + outer * Math.sin(rad),
      bold: i % 3 === 0,
    }
  })

  // Hour numbers (3, 6, 9, 12)
  const numbers = [12, 3, 6, 9].map((n, i) => {
    const deg = (i / 4) * 360
    const rad = ((deg - 90) * Math.PI) / 180
    const dist = 62
    return { n, x: cx + dist * Math.cos(rad), y: cy + dist * Math.sin(rad) }
  })

  return (
    <ClockSvg width="200" height="200" viewBox="0 0 200 200">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#333" strokeWidth="4" />
      {/* Markers */}
      {markers.map((m, i) => (
        <line
          key={i}
          x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
          stroke="#333"
          strokeWidth={m.bold ? 3 : 1.5}
          strokeLinecap="round"
        />
      ))}
      {/* Numbers */}
      {numbers.map(({ n, x, y }) => (
        <text
          key={n}
          x={x} y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="bold"
          fill="#222"
        >
          {n}
        </text>
      ))}
      {/* Hour hand */}
      <line
        x1={cx} y1={cy}
        x2={hEnd.x} y2={hEnd.y}
        stroke="#222" strokeWidth="6" strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx} y1={cy}
        x2={mEnd.x} y2={mEnd.y}
        stroke="#555" strokeWidth="4" strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="6" fill="#222" />
    </ClockSvg>
  )
}

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
}

export function ClockDragBoard({ question, phase, selectedId, onSelect }: Props) {
  const data = question.interactionData as ClockDragData | undefined
  if (!data) return null

  return (
    <Wrapper>
      <ClockFace hour={data.targetHour} minute={data.targetMinute} />
      <AnswerChoices
        choices={question.choices}
        correctId={question.correctId}
        phase={phase}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </Wrapper>
  )
}
