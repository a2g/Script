import promptSync from 'prompt-sync'
import { AddBrackets } from '../puzzle/AddBrackets'
import { FormatText } from '../puzzle/FormatText'
import { Solutions } from '../puzzle/Solutions'
import { PieceView } from './views/PieceView'

const prompt = promptSync({})

export function ChooseZzzOldWay (solutions: Solutions): void {
  console.warn('ChooseClimbIntoAchievements... ')

  for (; ;) {
    solutions.UpdateSolvedStatuses()
    const numberOfSolutions: number = solutions.NumberOfSolutions()
    console.warn('Climb in to achievements')
    console.warn('===============')
    console.warn(`Number of solutions in solutions = ${numberOfSolutions}`)

    // display list
    let incomplete = 0
    let listItemNumber = 0
    let solutionNumber = 65
    for (const solution of solutions.GetSolutions()) {
      // TrimNonIntegratedRootPieces(solution)
      const letter = String.fromCharCode(solutionNumber++)
      const path = FormatText(solution.GetSolvingPath())
      const NAME_NOT_DETERMINABLE = 'name_not_determinable'
      // HACKY!
      const label =
        path.length > 8
          ? path + '<-- path'
          : NAME_NOT_DETERMINABLE
      console.warn(`${letter}. ${label}}`)
      for (const item of solution.GetAchievementStubMap().GetValues()) {
        listItemNumber++

        // display list item
        const output = item.GetTheAchievementWord()
        const piece = item.GetThePiece()
        let inputs = ''
        if (piece != null) {
          for (const inputSpiel of piece.inputSpiels) {
            inputs += `${FormatText(inputSpiel)},`
          }
        }
        console.warn(
          `    ${listItemNumber}. ${FormatText(output)} ${AddBrackets(
            inputs
          )} (status=${item.IsSolved() ? 'Solved' : 'Unsolved'})`
        )
        incomplete += item.IsSolved() ? 0 : 1
      }
    }

    console.warn(`Number of achievements incomplete ${incomplete}/${listItemNumber}`)

    // allow user to choose item
    const input = prompt(
      'Choose achievement to climb up into or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      continue
    }
    if (input === 'r') {
      solutions.SolvePartiallyUntilCloning()
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        const solutionArray = solutions.GetSolutions()
        for (let i = 0; i < solutionArray.length; i++) {
          const rootMap = solutionArray[i].GetAchievementStubMap()
          const achievements = rootMap.GetValues()
          for (const achievement of achievements) {
            i++
            const theAchievementPiece = achievement.GetThePiece()
            if (i === theNumber && (theAchievementPiece != null)) {
              PieceView(theAchievementPiece, solutionArray[i].GetVisibleThingsAtTheStart(), ['blah'])
            }
          }
        }
      }
    }
  }
}
