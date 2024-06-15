import { Box } from './Box'
import { Piece } from './Piece'

export class Aggregates {
  /**
   * #### All the goal words
   */
  public setOfgoalAchievements: Set<string>
  /**
   * #### Set of outputs that can be solved twice
   */
  public piecesMapped: Map<string, Set<Piece>>

  /**
   * #### Boxes mapped by filename
   */
  public mapOfBoxes: Map<string, Box>
  constructor () {
    this.setOfgoalAchievements = new Set<string>()
    this.piecesMapped = new Map<string, Set<Piece>>()
    this.mapOfBoxes = new Map<string, Box>()
  }
}
