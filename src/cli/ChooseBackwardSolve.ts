import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { Solutions } from '../puzzle/Solutions'
import { TreeClimbingReadOnly } from './TreeClimbingReadOnly'
import { AddBrackets } from '../puzzle/AddBrackets'
import { PopulatePieceTrees } from './PopulatePieceTrees'
import { ShowUnderlinedTitle } from './ShowUnderlinedTitle'
const prompt = promptSync({})

export function ChooseBackwardSolve (solutions: Solutions): void {
  console.warn(' ')

  const titleSegments = ['Backwards Solve']
  for (; ;) {
    const numberOfSolutions: number = solutions.NumberOfSolutions()
    // solutions.GenerateSolutionNamesAndPush()

    ShowUnderlinedTitle(titleSegments)
    console.warn(`Number of solutions = ${numberOfSolutions}`)
    if (solutions.GetSolutions().length > 1) {
      console.warn('    0. All solutions')
    }
    for (let i = 0; i < solutions.GetSolutions().length; i++) {
      const solution = solutions.GetSolutions()[i]
      let numberOfUnsolved = 0
      for (const goal of solution.GetGoalStubMap().GetValues()) {
        numberOfUnsolved += goal.IsSolved() ? 0 : 1
      }
      const name = FormatText(solution.GetSolvingPath())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${name} number of unsolved goals=${numberOfUnsolved}`)
    }

    const firstInput = prompt(
      '\nChoose an Piece Tree (b)ack, (r)e-run, e(x)it '
    ).toLowerCase()

    if (firstInput === null || firstInput === 'b') {
      break
    }
    if (firstInput === 'x') {
      return
    }

    if (firstInput === 'r') {
      solutions.SolvePartiallyUntilCloning()
      solutions.MarkGoalsAsCompletedAndMergeIfNeeded()
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > solutions.GetSolutions().length) {
        continue
      }

      PopulatePieceTrees(solutions, theNumber, titleSegments)
    }
  }
}
