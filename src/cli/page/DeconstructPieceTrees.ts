import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { AddBrackets } from '../../puzzle/AddBrackets'
import { Validators } from '../../puzzle/Validators'
import { TreeClimbingWhilstDeconstructing } from './TreeClimbingWhilstDeconstructing'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'

const prompt = promptSync({})

export function DeconstructPieceTrees (validators: Validators, theNumber: number, titlePath: string[]): void {
  titlePath.push('Deconstruct Piece Trees')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const validator = validators.GetValidators()[theNumber - 1]
    // list all leaves, of all solutions in order
    // TrimNonIntegratedRootPieces(solution) <-- pretty sure this did nothing
    console.warn('Forwards Validate//Piece Trees')
    console.warn('============================')
    const text = FormatText(validator.GetName())
    const NAME_NOT_DETERMINABLE = 'name_not_determinable'
    // HACKY!
    const label =
      text.length > 8
        ? text
        : NAME_NOT_DETERMINABLE

    console.warn(`${theNumber}. ${label}`)
    let listItemNumber = 0
    for (const rootGoal of validator.GetRootMap().GetValues()) {
      listItemNumber++

      // display list item
      const output = rootGoal.GetGoalWord()
      const theGoalPiece = rootGoal.GetThePiece()
      let inputs = ''
      if (theGoalPiece != null) {
        for (const inputSpiel of theGoalPiece.inputSpiels) {
          inputs += `${FormatText(inputSpiel)},`
        }
      }
      const pieceCount = rootGoal.GetCountRecursively()
      const originalCount = rootGoal.GetOriginalPieceCount()
      const id = (theGoalPiece != null) ? theGoalPiece.id : ''
      const status = rootGoal.GetValidated() as string

      // const status = rootGoal.GetValidated() as string
      console.warn(
        `    ${listItemNumber}. ${status}(${pieceCount}/${originalCount}) ${FormatText(output)} ${id} ${AddBrackets(inputs)}`
      )
    }

    console.warn(`Pieces remaining ${validator.GetNumberOfRemainingPieces()} (${validator.GetRemainingPiecesAsString()})`)

    console.warn(`Number of goals back to zero ${validator.GetNumberOfClearedGoals()}/${validator.GetNumberOfGoals()}`)

    // allow user to choose item
    const input = prompt(
      'Choose goal to dig down on or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      break
    }
    if (input === 'x') {
      return
    }
    if (input === 'r') {
      validator.DeconstructAllGoalsAndRecordSteps()
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let j = 0
        for (const goal of validator.GetRootMap().GetValues()) {
          j++
          if (j === theNumber) {
            const theGoalPiece = goal.GetThePiece()
            if (theGoalPiece != null) {
              TreeClimbingWhilstDeconstructing(theGoalPiece, validator, goal, validator.GetVisibleThingsAtTheMoment(), titlePath)
            } else {
              prompt(`${goal.GetGoalWord()} Goal.piece WAS NULL. Hit any key to continue: `)
            }
          }
        }
      }
    }
  }
}
