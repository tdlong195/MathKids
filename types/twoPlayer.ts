export interface TwoPlayerSession {
  player1Id: string | null // Profile ID or null for guest
  player2Id: string | null
  player1Name: string
  player2Name: string
  player1Correct: number
  player2Correct: number
  player1Wrong: number
  player2Wrong: number
}
