import definitions from '../../oldCampaignFramework.json'
import { GoalSession } from './GoalSession'

export class GoalSessionCollection {
  private readonly goals: GoalSession[]
  constructor () {
    this.goals = new Array<GoalSession>()
  }

  public IsActive (index: number): boolean {
    const ggoals = new Set<string>()
    if (index < 0 || index >= this.goals.length) {
      return false
    }
    for (const section of this.goals) {
      if (section.playable.IsCompleted()) {
        ggoals.add(section.goalEnum)
      }
    }
    let prerequisitesCompleted = 0
    for (const prerequisite of this.goals[index].prerequisiteGoals) {
      if (ggoals.has(prerequisite)) {
        prerequisitesCompleted++
      }
    }

    let sunsetsCompleted = 0
    for (const sunset of this.goals[index].sunsetGoals) {
      if (ggoals.has(sunset)) {
        sunsetsCompleted++
      }
    }

    let isPrerequisiteSatisfied = false
    switch (this.goals[index].prerequisiteType) {
      case definitions.definitions.condition_enum_entity.oneOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 1
        break
      case definitions.definitions.condition_enum_entity.twoOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 2
        break
      case definitions.definitions.condition_enum_entity.threeOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 3
        break
      default:
        isPrerequisiteSatisfied =
          prerequisitesCompleted >= this.goals[index].prerequisiteGoals.length
    }

    let isSunsetSatisfied = false
    switch (this.goals[index].sunsetType) {
      case definitions.definitions.condition_enum_entity.oneOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 1
        break
      case definitions.definitions.condition_enum_entity.twoOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 2
        break
      case definitions.definitions.condition_enum_entity.threeOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 3
        break
      default:
        isSunsetSatisfied =
          sunsetsCompleted >= this.goals[index].sunsetGoals.length
    }

    // default to must have completed all
    const isActive = isPrerequisiteSatisfied && !isSunsetSatisfied
    return isActive
  }

  public Push (session: GoalSession): void {
    this.goals.push(session)
  }

  public Get (i: number): GoalSession {
    return this.goals[i]
  }

  public Length (): number {
    return this.goals.length
  }
}
