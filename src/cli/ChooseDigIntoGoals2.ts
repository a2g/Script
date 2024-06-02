import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { Solutions } from '../puzzle/Solutions'
import { NavigatePieceRecursive } from './NavigatePieceRecursive'
import { AddBrackets } from '../puzzle/AddBrackets'
const prompt = promptSync({})

export function ChooseDigIntoGoals2 (solutions: Solutions): void {
  console.warn(' ')

  for (; ;) {
    const numberOfSolutions: number = solutions.NumberOfSolutions()
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions in solutions = ${numberOfSolutions}`)

    // solutions.GenerateSolutionNamesAndPush()
    console.warn('Pick solution')
    console.warn('================')
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

    // allow user to choose item
    const firstInput = prompt(
      '\nChoose an ingredient of one of the solutions or (b)ack, (r)e-run, e(x)it '
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
      for (; ;) {
        const solution = solutions.GetSolutions()[theNumber - 1]
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
        for (const rootGoal of solution.GetGoalStubMap().GetValues()) {
          listItemNumber++

          // display list item
          const output = rootGoal.GetGoalWord()
          const theGoalPiece = rootGoal.GetPiece()
          let inputs = ''
          if (theGoalPiece != null) {
            for (const inputSpiel of theGoalPiece.inputSpiels) {
              inputs += `${FormatText(inputSpiel)},`
            }
          }
          const status = rootGoal.GetSolved() as string
          console.warn(
            `    ${listItemNumber}. ${status}${FormatText(output)} ${AddBrackets(inputs)} (root = ${(rootGoal.GetPiece() != null) ? 'found' : 'null'}`
          )
          incomplete += rootGoal.IsSolved() ? 0 : 1
        }

        console.warn(`Remaining Pieces: ${solution.GetNumberOfPiecesRemaining()}`)

        console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`)

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
                const theGoalPiece = goal.GetPiece()
                if (theGoalPiece != null) {
                  NavigatePieceRecursive(theGoalPiece, solution.GetGoalStubMap(), solution.GetVisibleThingsAtTheStart())
                } else {
                  prompt(`${goal.GetGoalWord()} Goal.piece WAS NULL. Hit any key to continue: `)
                }
              }
            }
          }
        }
      }
    }
  }
}
