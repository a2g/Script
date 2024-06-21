import { Happener } from '../puzzle/Happener'
import { PlayerAI } from '../puzzle/PlayerAI'
import { Solution } from '../puzzle/Solution'
import { Playable } from './Playable'

export class AchievementSession {
  public prerequisiteAchievements: string[]
  public prerequisiteType: string
  public sunsetAchievements: string[]
  public sunsetType: string
  public achievementEnum: string
  public achievementName: string
  public startingThings: Map<string, Set<string>>
  public playable: Playable
  constructor (
    happener: Happener,
    startingThings: Map<string, Set<string>>,
    solution: Solution
  ) {
    const numberOfAutopilotTurns = 0
    const player = new PlayerAI(happener, numberOfAutopilotTurns)
    this.playable = new Playable(player, happener, solution)
    this.prerequisiteAchievements = []
    this.prerequisiteType = ''
    this.sunsetAchievements = []
    this.sunsetType = ''
    this.achievementEnum = ''
    this.achievementName = ''
    this.startingThings = startingThings
  }

  public GetTitle (): string {
    return this.achievementName
  }
}
