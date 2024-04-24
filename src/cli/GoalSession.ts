import { Box } from '../puzzle/Box'
import { Happener } from '../puzzle/Happener'
import { PlayerAI } from '../puzzle/PlayerAI'
import { Playable } from './Playable'

export class GoalSession {
  public prerequisiteGoals: string[]
  public prerequisiteType: string
  public sunsetGoals: string[]
  public sunsetType: string
  public goalEnum: string
  public goalName: string
  public startingThings: Map<string, Set<string>>
  public playable: Playable
  constructor (
    happener: Happener,
    startingThings: Map<string, Set<string>>,
    box: Box
  ) {
    const numberOfAutopilotTurns = 0
    const player = new PlayerAI(happener, numberOfAutopilotTurns)
    this.playable = new Playable(player, happener, box)
    this.prerequisiteGoals = []
    this.prerequisiteType = ''
    this.sunsetGoals = []
    this.sunsetType = ''
    this.goalEnum = ''
    this.goalName = ''
    this.startingThings = startingThings
  }

  public GetTitle (): string {
    return this.goalName
  }
}
