'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { SPRING_BOUNCY, SPRING_SNAP } from '@/lib/animation/springs'
import type { Question, DragDropData } from '@/types/question'
import type { GamePhase } from '@/store/gameStore'

// DragDropBoard: single-zone (quantityMatch, sequence) or multi-zone (logicSort).
// Single-zone: drag items to 1 zone, call onSelect(choiceId).
// Multi-zone: drag items to 2+ zones, call onAnswer(isCorrect) when all placed.

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

const DropZone = styled.div<{ $active: boolean; $correct: boolean | null; $shake?: boolean }>`
  min-width: 160px;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 4px dashed
    ${({ theme, $active, $correct }) =>
      $correct === true
        ? theme.colors.correct
        : $correct === false
          ? theme.colors.wrong
          : $active
            ? theme.colors.primary
            : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $active, $correct }) =>
    $correct === true
      ? theme.colors.correctLight
      : $correct === false
        ? theme.colors.wrongLight
        : $active
          ? '#EEF4FF'
          : theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 900;
  transition: border-color 0.2s, background 0.2s;
  animation: ${({ $shake }) => $shake ? 'shake 0.4s' : 'none'};

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
`

const ZoneLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ZonesRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`

const ItemsInZone = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
  min-height: 40px;
`

const CardsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

const DragCard = styled(motion.button)<{ $used: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $used }) => $used ? theme.colors.surface : theme.colors.primary};
  color: ${({ $used }) => $used ? '#bbb' : '#fff'};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 900;
  font-family: inherit;
  cursor: ${({ $used }) => $used ? 'default' : 'grab'};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $used }) => $used ? 0.4 : 1};
  touch-action: none;
`

interface Props {
  question: Question
  phase: GamePhase
  selectedId: string | null
  onSelect: (choiceId: string) => void
  onAnswer?: (isCorrect: boolean) => void
}

export function DragDropBoard({ question, phase, selectedId, onSelect, onAnswer }: Props) {
  const isDisabled = phase !== 'playing'

  // Determine if multi-zone or single-zone
  const interactionData = question.interactionData as DragDropData | undefined
  const isMultiZone = interactionData && interactionData.dropZones.length > 1

  // Single-zone state
  const [dropped, setDropped] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Multi-zone state: Map of itemId -> zoneId
  const [itemPlacements, setItemPlacements] = useState<Record<string, string>>({})
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [hoveringZone, setHoveringZone] = useState<string | null>(null)
  const [wrongZoneId, setWrongZoneId] = useState<string | null>(null)

  // For multi-zone: validate when all items placed
  const allItemsPlaced = useMemo(() => {
    if (!isMultiZone || !interactionData) return false
    const dragItemIds = interactionData.dragItems.map(item => item.id)
    return dragItemIds.every(id => id in itemPlacements)
  }, [isMultiZone, interactionData, itemPlacements])

  const isMultiZoneCorrect = useMemo(() => {
    if (!isMultiZone || !interactionData) return null
    if (!allItemsPlaced) return null
    return Object.entries(itemPlacements).every(
      ([itemId, zoneId]) => interactionData.correctMapping[itemId] === zoneId
    )
  }, [isMultiZone, interactionData, itemPlacements, allItemsPlaced])

  const handleDragEnd = useCallback((choiceId: string, info: { point: { x: number; y: number } }) => {
    if (isDisabled) return

    if (isMultiZone && interactionData && onAnswer) {
      // Multi-zone: check all zones
      const px = info.point.x - window.scrollX
      const py = info.point.y - window.scrollY
      let hitZone = false

      for (const zone of interactionData.dropZones as Array<{ id: string; label: string }>) {
        const zoneEl = zoneRefs.current[zone.id]
        if (!zoneEl) continue
        const rect = zoneEl.getBoundingClientRect()
        const hit = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom
        if (hit) {
          hitZone = true
          const newPlacements = { ...itemPlacements, [choiceId]: zone.id }
          setItemPlacements(newPlacements)
          setHoveringZone(null)

          // Check if placement is correct; if not, show shake feedback
          const isCorrect = interactionData.correctMapping[choiceId] === zone.id
          if (!isCorrect) {
            setWrongZoneId(zone.id)
            setTimeout(() => setWrongZoneId(null), 500)
          }

          // Check if all items are placed
          const dragItemIds = interactionData.dragItems.map(item => item.id)
          const allPlaced = dragItemIds.every(id => id in newPlacements)
          if (allPlaced) {
            const isCorrect = Object.entries(newPlacements).every(
              ([itemId, zoneId]) => interactionData.correctMapping[itemId] === zoneId
            )
            setTimeout(() => onAnswer(isCorrect), 300)
          }
          return
        }
      }

      // If not dropped in any zone, clear the placement (allow recovery)
      if (!hitZone && choiceId in itemPlacements) {
        const newPlacements = { ...itemPlacements }
        delete newPlacements[choiceId]
        setItemPlacements(newPlacements)
      }
    } else if (!isMultiZone) {
      // Single-zone: old behavior
      if (dropped !== null) return
      const zone = dropRef.current
      if (!zone) return
      const rect = zone.getBoundingClientRect()
      const px = info.point.x - window.scrollX
      const py = info.point.y - window.scrollY
      const hit = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom
      if (hit) {
        setDropped(choiceId)
        onSelect(choiceId)
      }
    }
    setHovering(false)
  }, [isDisabled, isMultiZone, interactionData, onAnswer, itemPlacements, dropped, onSelect])

  if (isMultiZone && interactionData) {
    const dragItems = interactionData.dragItems as Array<{ id: string; label?: string; emoji?: string }>
    const zones = interactionData.dropZones as Array<{ id: string; label: string }>
    return (
      <Wrapper>
        <ZonesRow>
          {zones.map((zone: { id: string; label: string }) => (
            <DropZone
              key={zone.id}
              ref={el => {
                if (el) zoneRefs.current[zone.id] = el
              }}
              $active={hoveringZone === zone.id}
              $correct={null}
              $shake={wrongZoneId === zone.id}
            >
              <ZoneLabel>{zone.label}</ZoneLabel>
              <ItemsInZone>
                {dragItems
                  .filter((item: any) => itemPlacements[item.id] === zone.id)
                  .map((item: any) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={SPRING_SNAP}
                      style={{ fontSize: '2rem' }}
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
              </ItemsInZone>
            </DropZone>
          ))}
        </ZonesRow>

        <CardsRow>
          {dragItems.map((item: any) => (
            <DragCard
              key={item.id}
              $used={item.id in itemPlacements}
              drag={!isDisabled}
              dragSnapToOrigin
              onDragStart={() => setHoveringZone(null)}
              onDragEnd={(_e, info) => handleDragEnd(item.id, info)}
              whileDrag={{ scale: 1.15, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 10 }}
              animate={{ scale: 1 }}
              transition={SPRING_SNAP}
            >
              {item.emoji}
            </DragCard>
          ))}
        </CardsRow>
      </Wrapper>
    )
  }

  // Single-zone (old behavior)
  const isCorrect = dropped !== null ? dropped === question.correctId : null
  const droppedLabel = dropped
    ? question.choices.find(c => c.id === dropped)?.label ?? ''
    : '?'

  return (
    <Wrapper>
      <DropZone ref={dropRef} $active={hovering} $correct={isCorrect}>
        {droppedLabel}
      </DropZone>

      <CardsRow>
        {question.choices.map(choice => (
          <DragCard
            key={choice.id}
            $used={dropped === choice.id}
            drag={!isDisabled && dropped === null}
            dragSnapToOrigin
            onDragStart={() => setHovering(true)}
            onDragEnd={(_e, info) => handleDragEnd(choice.id, info)}
            whileDrag={{ scale: 1.15, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 10 }}
            animate={{ scale: 1 }}
            transition={SPRING_SNAP}
          >
            {choice.label}
          </DragCard>
        ))}
      </CardsRow>
    </Wrapper>
  )
}
