import promptSync from 'prompt-sync'
import { AddBrackets } from '../puzzle/AddBrackets'
import { FormatText } from '../puzzle/FormatText'
import { SolutionCollection } from '../puzzle/SolutionCollection'
import { NavigatePieceRecursive } from './NavigatePieceRecursive'

const prompt = promptSync({})

export function ChooseDigDeprecated (solver: SolutionCollection): void {
  console.warn('ChooseDigIntoGoals... ')

  for (; ;) {
    solver.MarkGoalsAsCompletedAndMergeIfNeeded()
    const numberOfSolutions: number = solver.NumberOfSolutions()
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions in solver = ${numberOfSolutions}`)

    // display list
    let incomplete = 0
    let listItemNumber = 0
    let solutionNumber = 65
    for (const solution of solver.GetSolutions()) {
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
      for (const item of solution.GetRootMap().GetValues()) {
        listItemNumber++

        // display list item
        const output = item.goalHint
        let inputs = ''
        if (item.piece != null) {
          for (const inputSpiel of item.piece.inputSpiels) {
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

    console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`)

    // allow user to choose item
    const input = prompt(
      'Choose goal to dig down on or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      continue
    }
    if (input === 'r') {
      solver.SolvePartiallyUntilCloning()
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        const solutions = solver.GetSolutions()
        for (let i = 0; i < solutions.length; i++) {
          const rootMap = solutions[i].GetRootMap()
          const goals = rootMap.GetValues()
          for (const goal of goals) {
            i++
            if (i === theNumber && (goal.piece != null)) {
              NavigatePieceRecursive(goal.piece, rootMap, solutions[i])
            }
          }
        }
      }
    }
  }
}
