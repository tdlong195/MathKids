export const SPRING_BOUNCY = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
  mass: 1,
} as const

export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 2,
} as const

export const SPRING_SLOW = {
  type: 'spring',
  stiffness: 100,
  damping: 18,
  mass: 1.5,
} as const

export const SPRING_SNAP = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
  mass: 0.8,
} as const
