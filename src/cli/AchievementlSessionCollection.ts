import definitions from '../../oldCampaignFramework.json'
import { AchievementSession } from './AchievementSession'

export class AchievementSessionCollection {
  private readonly achievements: AchievementSession[]
  constructor () {
    this.achievements = new Array<AchievementSession>()
  }

  public IsActive (index: number): boolean {
    const gachievements = new Set<string>()
    if (index < 0 || index >= this.achievements.length) {
      return false
    }
    for (const section of this.achievements) {
      if (section.playable.IsCompleted()) {
        gachievements.add(section.achievementEnum)
      }
    }
    let prerequisitesCompleted = 0
    for (const prerequisite of this.achievements[index].prerequisiteAchievements) {
      if (gachievements.has(prerequisite)) {
        prerequisitesCompleted++
      }
    }

    let sunsetsCompleted = 0
    for (const sunset of this.achievements[index].sunsetAchievements) {
      if (gachievements.has(sunset)) {
        sunsetsCompleted++
      }
    }

    let isPrerequisiteSatisfied = false
    switch (this.achievements[index].prerequisiteType) {
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
          prerequisitesCompleted >= this.achievements[index].prerequisiteAchievements.length
    }

    let isSunsetSatisfied = false
    switch (this.achievements[index].sunsetType) {
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
          sunsetsCompleted >= this.achievements[index].sunsetAchievements.length
    }

    // default to must have completed all
    const isActive = isPrerequisiteSatisfied && !isSunsetSatisfied
    return isActive
  }

  public Push (session: AchievementSession): void {
    this.achievements.push(session)
  }

  public Get (i: number): AchievementSession {
    return this.achievements[i]
  }

  public Length (): number {
    return this.achievements.length
  }
}
