import { IdPrefixes } from '../../IdPrefixes'
import { Happener } from './Happener'
import { Solution } from './Solution'

export function ProcessAutos (
  happener: Happener,
  solution: Solution
): void {
  const achievements = happener.GetCurrentlyTrueAchievements()
  const items = happener.GetCurrentVisibleInventory()
  const objs = happener.GetCurrentVisibleProps()

  const autos = solution.GetAutos()
  for (const piece of autos) {
    let numberSatisfied = 0
    for (const inputName of piece.inputHints) {
      if (inputName.startsWith(IdPrefixes.Obj)) {
        if (objs.includes(inputName)) {
          numberSatisfied += 1
        }
      } else if (inputName.startsWith(IdPrefixes.Inv)) {
        if (items.includes(inputName)) {
          numberSatisfied += 1
        }
      } else if (inputName.startsWith(IdPrefixes.Achievement)) {
        if (achievements.includes(inputName)) {
          numberSatisfied += 1
        }
      }
    }
    if (numberSatisfied === piece.inputHints.length) {
      if (piece.output.startsWith('obj_')) {
        console.warn(`Auto: obj set visible ${piece.output}`)
        happener.SetPropVisible(piece.output, true)
      } else if (piece.output.startsWith('achievement_')) {
        console.warn(`Auto: achievement set to true ${piece.output}`)
        happener.SetAchievementValue(piece.output, 1)
      } else if (piece.output.startsWith('inv_')) {
        console.warn(`Auto: inv set to visible ${piece.output}`)
        happener.SetInvVisible(piece.output, true)
      }
    }
  }
}
