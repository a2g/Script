import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { Solutions } from '../../puzzle/Solutions'
import { TreeClimbingReadOnly } from './TreeClimbingReadOnly'
import { AddBrackets } from '../../puzzle/AddBrackets'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
const prompt = promptSync({})

export function PopulatePieceTrees (solutions: Solutions, theNumber: number, titlePath: string[]): void {
  titlePath.push('Populate Piece Trees')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const solution = solutions.GetSolutions()[theNumber - 1]

    const text = FormatText(solution.GetSolvingPath())
    const NAME_NOT_DETERMINABLE = 'name_not_determinable'
    // HACKY!
    const label =
      text.length > 8
        ? text
        : NAME_NOT_DETERMINABLE

    console.warn(`${theNumber}. ${label}`)
    let listItemNumber = 0
    let incomplete = 0
    for (const rootGoal of solution.GetGoalStubMap().GetValues()) {
      listItemNumber++

      // display list item
      const output = rootGoal.GetGoalWord()
      const theGoalPiece = rootGoal.GetThePiece()
      let inputs = ''
      if (theGoalPiece != null) {
        for (let i = 0; i < theGoalPiece.inputSpiels.length; i++) {
          const inputSpiel = theGoalPiece.inputSpiels[i]
          inputs += (i === 0) ? '' : ','
          inputs += `${FormatText(inputSpiel)}`
        }
      }
      const status = rootGoal.GetSolved() as string
      console.warn(
        `    ${listItemNumber}. ${status} ${FormatText(output)} ${AddBrackets(inputs)} `
      )
      incomplete += rootGoal.IsSolved() ? 0 : 1
    }

    console.warn(`Remaining Pieces: ${solution.GetNumberOfPiecesRemaining()}`)

    console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`)

    // allow user to choose item
    const input = prompt(
      'Choose goal to climb down on or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      break
    }
    if (input === 'x') {
      return
    }
    if (input === 'r') {
      solutions.SolvePartiallyUntilCloning()
      solutions.MarkGoalsAsCompletedAndMergeIfNeeded()
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let j = 0
        for (const goal of solution.GetGoalStubMap().GetValues()) {
          j++
          if (j === theNumber) {
            const theGoalPiece = goal.GetThePiece()
            if (theGoalPiece != null) {
              TreeClimbingReadOnly(theGoalPiece, solution.GetGoalStubMap(), solution.GetVisibleThingsAtTheStart(), titlePath)
            } else {
              prompt(`${goal.GetGoalWord()} Goal.piece WAS NULL. Hit any key to continue: `)
            }
          }
        }
      }
    }
  }
}
