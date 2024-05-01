import { Happener } from '../puzzle/Happener'
import { PlayerAI } from '../puzzle/PlayerAI'
import { Solution } from '../puzzle/Solution'

export class Playable {
  private readonly player: PlayerAI

  private readonly solution: Solution

  private readonly happener: Happener

  private isCompleted: boolean

  constructor (player: PlayerAI, happener: Happener, solution: Solution) {
    this.player = player
    this.solution = solution
    this.happener = happener
    this.isCompleted = false
  }

  public GetPlayer (): PlayerAI {
    return this.player
  }

  public GetSolution (): Solution {
    return this.solution
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
