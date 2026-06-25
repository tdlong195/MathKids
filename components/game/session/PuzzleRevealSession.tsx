'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_SNAP } from '@/lib/animation/springs'

// Each puzzle: a sequence of emoji tiles that together reveal a "picture"
const PUZZLE_SETS = [
  { label: 'Cầu vồng 🌈', tiles: ['🔴','🟠','🟡','🟢','🔵','🟣','🌈','⭐','✨'] },
  { label: 'Biển xanh 🌊', tiles: ['☁️','🌤','🌞','🌊','🐟','🐚','🏖','🦀','🦭'] },
  { label: 'Khu rừng 🌳', tiles: ['🌱','🌿','🍃','🦋','🐛','🍄','🌳','🦔','🐿️'] },
  { label: 'Không gian 🚀', tiles: ['⭐','🌟','✨','🌙','🪐','☄️','🚀','👾','🌌'] },
  { label: 'Nông trại 🐄', tiles: ['🌾','🌻','🐔','🐷','🐄','🐑','🏡','🌈','🌞'] },
]

const PuzzleWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const PuzzleLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const TileGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: 6px;
  width: 100%;
`

const Tile = styled(motion.div)`
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  cursor: default;
`

interface Props {
  correctAnswers: number
  totalQuestions: number
}

export function PuzzleRevealSession({ correctAnswers, totalQuestions }: Props) {
  // Pick a puzzle set on mount and keep it for the session
  const [puzzle] = useState(() => {
    const idx = Math.floor(Math.random() * PUZZLE_SETS.length)
    return PUZZLE_SETS[idx]
  })

  // Determine grid columns: prefer 3-wide layout
  const cols = totalQuestions <= 6 ? 3 : totalQuestions <= 9 ? 3 : 4

  // Use tiles from the puzzle set, cycling if session is longer than the set
  const tiles = Array.from({ length: totalQuestions }, (_, i) => puzzle.tiles[i % puzzle.tiles.length])

  return (
    <PuzzleWrapper>
      <PuzzleLabel>
        🧩 {puzzle.label} — {correctAnswers} / {totalQuestions} mảnh
      </PuzzleLabel>

      <TileGrid $cols={cols}>
        {tiles.map((emoji, i) => {
          const isRevealed = i < correctAnswers
          return (
            <Tile key={i}>
              <AnimatePresence mode="wait" initial={false}>
                {isRevealed ? (
                  <motion.span
                    key="revealed"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ ...SPRING_BOUNCY, delay: 0.05 }}
                    style={{ display: 'block', fontSize: '1.5rem' }}
                  >
                    {emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="hidden"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={SPRING_SNAP}
                    style={{ display: 'block', fontSize: '1.2rem', color: '#bbb' }}
                  >
                    ❓
                  </motion.span>
                )}
              </AnimatePresence>
            </Tile>
          )
        })}
      </TileGrid>
    </PuzzleWrapper>
  )
}
