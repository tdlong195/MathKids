export type InteractionMode =
  | 'choice'        // tap one of N answer buttons (default)
  | 'tapCount'      // tap each emoji to count, then pick number
  | 'dragDrop'      // drag a number card into the target drop zone
  | 'ordering'      // drag items to arrange in correct order
  | 'memoryFlip'    // flip cards to find matching pairs
  | 'balanceScale'  // pick number that balances the equation
  | 'ballShoot'     // tap the flying ball with the correct number
  | 'clockDrag'     // read clock hands and select the right time
  | 'timeAttack'    // like choice but with a per-question countdown

// Mode-specific data payloads
export interface OrderingData {
  type?: 'ordering'
  items: { id: string; emoji: string; sizeRank: number }[]
  direction: 'asc' | 'desc'
}

export interface MemoryFlipData {
  type?: 'memoryFlip'
  pairs?: { id: string; pairId: string; label: string }[]
  cardPairs?: { id: string; label: string; pairId: string }[]
}

export interface ClockDragData {
  type?: 'clockDrag'
  targetHour: number    // 1-12
  targetMinute: number  // 0 | 15 | 30 | 45
}

export interface BalanceScaleData {
  type?: 'balanceScale'
  rightValue?: number    // the value shown on the right pan of the scale
}

export interface DragDropData {
  type?: 'dragDrop'
  dragItems: { id: string; label?: string; emoji?: string }[]
  dropZones: { id: string; label: string }[]
  correctMapping: Record<string, string> // dragItemId -> dropZoneId
}

export type InteractionData = OrderingData | MemoryFlipData | ClockDragData | BalanceScaleData | DragDropData

export interface Choice {
  id: string
  label: string
}

export interface Question {
  id: string
  topic: string
  interactionMode: InteractionMode
  prompt: string
  visualEmojis?: string[]
  choices: Choice[]         // used by choice / tapCount / dragDrop / balanceScale / ballShoot / timeAttack
  correctId: string         // empty string for ordering / memoryFlip (board validates internally)
  difficulty: 1 | 2 | 3
  timeLimit?: number        // seconds per question, for timeAttack mode
  interactionData?: InteractionData
}
