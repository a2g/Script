import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { PieceView } from './PieceView'
import { AddBrackets } from '../../puzzle/AddBrackets'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { Solution } from '../../puzzle/Solution'
import { Solutions } from '../../puzzle/Solutions'
const prompt = promptSync({})

export function SolutionView (solution: Solution, solutions: Solutions, titlePath: string[]): void {
  titlePath.push('Solution')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    const text = FormatText(solution.GetSolvingPath())
    const NAME_NOT_DETERMINABLE = 'name_not_determinable'
    // HACKY!
    const label =
      text.length > 8
        ? text
        : NAME_NOT_DETERMINABLE

    console.warn(`${label}`)
    let listItemNumber = 0
    let incomplete = 0
    for (const achievementStub of solution.GetGoalStubMap().GetValues()) {
      listItemNumber++

      // display list item
      const output = achievementStub.GetAchievementWord()
      const theGoalPiece = achievementStub.GetThePiece()
      let inputs = ''
      if (theGoalPiece != null) {
        for (let i = 0; i < theGoalPiece.inputSpiels.length; i++) {
          const inputSpiel = theGoalPiece.inputSpiels[i]
          inputs += (i === 0) ? '' : ','
          inputs += `${FormatText(inputSpiel)}`
        }
      }
      const status = achievementStub.GetSolved() as string
      console.warn(
        `${listItemNumber}. ${status} ${FormatText(output)} ${AddBrackets(inputs)} `
      )
      incomplete += achievementStub.IsSolved() ? 0 : 1
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
      solution.ProcessUntilCloning(solutions)
      solution.UpdateGoalSolvedStatuses()
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
              PieceView(theGoalPiece, solution.GetVisibleThingsAtTheStart(), titlePath)
            } else {
              prompt(`${goal.GetAchievementWord()} Goal.piece WAS NULL. Hit any key to continue: `)
            }
          }
        }
      }
    }
  }
}
