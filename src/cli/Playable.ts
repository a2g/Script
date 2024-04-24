import { Box } from '../puzzle/Box'
import { Happener } from '../puzzle/Happener'
import { PlayerAI } from '../puzzle/PlayerAI'

export class Playable {
  private readonly player: PlayerAI

  private readonly box: Box

  private readonly happener: Happener

  private isCompleted: boolean

  constructor (player: PlayerAI, happener: Happener, box: Box) {
    this.player = player
    this.box = box
    this.happener = happener
    this.isCompleted = false
  }

  public GetPlayer (): PlayerAI {
    return this.player
  }

  public GetPileOfPieces (): Box {
    return this.box
  }

  public GetHappener (): Happener {
    return this.happener
  }

  public SetCompleted (): void {
    this.isCompleted = true
  }

  public IsCompleted (): boolean {
    return this.isCompleted
  }
}
