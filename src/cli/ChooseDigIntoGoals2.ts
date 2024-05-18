import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { SolutionCollection } from '../puzzle/SolutionCollection'
import { NavigatePieceRecursive } from './NavigatePieceRecursive'
import { AddBrackets } from '../puzzle/AddBrackets'
const prompt = promptSync({})

export function ChooseDigIntoGoals2 (solver: SolutionCollection): void {
  console.warn(' ')
  let numberOfRuns = 0
  for (; ;) {
    const numberOfSolutions: number = solver.NumberOfSolutions()
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions = ${numberOfSolutions} iterations:${numberOfRuns}`)
    if (solver.GetSolutions().length > 1) {
      console.warn('    0. All solutions')
    }
    for (let i = 0; i < solver.GetSolutions().length; i++) {
      const solution = solver.GetSolutions()[i]
      let numberOfUnsolved = 0
      for (const goal of solution.GetRootMap().GetValues()) {
        numberOfUnsolved += goal.IsSolved() ? 0 : 1
      }
      const name = FormatText(solution.GetSolvingPath())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${name} number of unsolved goals=${numberOfUnsolved}`)
    }

    // allow user to choose item
    const firstInput = prompt(
      '\nChoose an ingredient of one of the solutions or (b)ack, (r)e-run, e(x)it '
    ).toLowerCase()

    numberOfRuns++
    if (firstInput === null || firstInput === 'b') {
      break
    }
    if (firstInput === 'x') {
      return
    }

    if (firstInput === 'r') {
      if (numberOfRuns % 2 > 0) {
        solver.IterateOverGoalMapWhilstSkippingBranchesUntilExhausted()
      } else {
        solver.SolvePartiallyUntilCloning()
      }
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > solver.GetSolutions().length) {
        continue
      }
      for (; ;) {
        const solution = solver.GetSolutions()[theNumber - 1]
        // list all leaves, of all solutions in order
        // TrimNonIntegratedRootPieces(solution) <-- pretty sure this did nothing

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
        for (const rootGoal of solution.GetRootMap().GetValues()) {
          listItemNumber++

          // display list item
          const output = rootGoal.goalHint
          let inputs = ''
          if (rootGoal.piece != null) {
            for (const inputSpiel of rootGoal.piece.inputSpiels) {
              inputs += `${FormatText(inputSpiel)},`
            }
          }
          const status = rootGoal.IsSolved() ? '✓' : '✖'
          console.warn(
            `    ${listItemNumber}. ${status} ${FormatText(output)} ${AddBrackets(inputs)} (root = ${(rootGoal.piece != null) ? 'found' : 'null'})`
          )
          incomplete += rootGoal.IsSolved() ? 0 : 1
        }

        console.warn(`Number of goals remaining ${incomplete} (${listItemNumber})`)

        // allow user to choose item
        const input = prompt(
          'Choose goal to dig down on or (b)ack, (r)e-run: '
        ).toLowerCase()
        numberOfRuns++
        if (input === null || input === 'b') {
          break
        }
        if (input === 'x') {
          return
        }
        if (input === 'r') {
          if (numberOfRuns % 2 > 0) {
            solver.IterateOverGoalMapWhilstSkippingBranchesUntilExhausted()
          } else {
            solver.SolvePartiallyUntilCloning()
          }
          continue
        } else {
          // show map entry for chosen item
          const theNumber = Number(input)
          if (theNumber > 0 && theNumber <= listItemNumber) {
            let j = 0
            for (const goal of solution.GetRootMap().GetValues()) {
              j++
              if (j === theNumber) {
                if (goal.piece != null) {
                  NavigatePieceRecursive(goal.piece, solution.GetRootMap(), solution)
                } else {
                  prompt(`${goal.goalHint} Goal.piece WAS NULL. Hit any key to continue: `)
                }
              }
            }
          }
        }
      }
    }
  }
}
