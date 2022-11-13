import { Happener } from './Happener.js'
import { PileOfPieces } from './PileOfPieces.js'

export function ProcessAutos(happener: Happener, pileOfPieces: PileOfPieces): void {
  const goals = happener.GetCurrentlyTrueGoals()
  const items = happener.GetCurrentVisibleInventory()
  const props = happener.GetCurrentVisibleProps()

  const autos = pileOfPieces.GetAutos()
  for (const piece of autos) {
    let numberSatisfied = 0
    for (const inputName of piece.inputHints) {
      if (inputName.startsWith('prop_')) {
        if (props.includes(inputName)) {
          numberSatisfied = numberSatisfied + 1
        }
      } else if (inputName.startsWith('inv_')) {
        if (items.includes(inputName)) {
          numberSatisfied++
        }
      } else if (inputName.startsWith('goal_')) {
        if (goals.includes(inputName)) {
          numberSatisfied++
        }
      }
    };
    if (numberSatisfied === piece.inputHints.length) {
      if (piece.output.startsWith('prop_')) {
        console.log('Auto: prop set visible ' + piece.output)
        happener.SetPropVisible(piece.output, true)
      } else if (piece.output.startsWith('goal_')) {
        console.log('Auto: goal set to true ' + piece.output)
        happener.SetGoalValue(piece.output, 1)
      } else if (piece.output.startsWith('inv_')) {
        console.log('Auto: inv set to visible ' + piece.output)
        happener.SetInvVisible(piece.output, true)
      }
    }
  }
}
