import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { AddBrackets } from '../puzzle/AddBrackets'
import { Validators } from '../puzzle/Validators'
import { NavigatePieceRecursive } from './NavigatePieceRecursive'
const prompt = promptSync({})

export function ChooseValidateSolution (validators: Validators): void {
  for (; ;) {
    const numberOfSolutions: number = validators.GetValidators().length
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions in solutions = ${numberOfSolutions}`)

    // solutions.GenerateSolutionNamesAndPush()
    console.warn('Pick solution')
    console.warn('================')
    console.warn(`Number of solutions = ${numberOfSolutions}`)
    if (validators.GetValidators().length > 1) {
      console.warn('    0. All solutions')
    }
    const validatorList = validators.GetValidators()
    for (let i = 0; i < validatorList.length; i++) {
      const validator = validatorList[i]
      let numberOfUnsolved = 0
      for (const goal of validator.GetRootMap().GetValues()) {
        numberOfUnsolved += goal.IsSolved() ? 0 : 1
      }
      const name = FormatText(validator.GetName())
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
      validators.MatchLeavesAndRemoveFromGoalMap()
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > validators.GetValidators().length) {
        continue
      }
      for (; ;) {
        const validator = validators.GetValidators()[theNumber - 1]
        // list all leaves, of all solutions in order
        // TrimNonIntegratedRootPieces(solution) <-- pretty sure this did nothing

        const text = FormatText(validator.GetName())
        const NAME_NOT_DETERMINABLE = 'name_not_determinable'
        // HACKY!
        const label =
          text.length > 8
            ? text
            : NAME_NOT_DETERMINABLE

        console.warn(`${theNumber}. ${label}`)
        let listItemNumber = 0
        let numberOfClearedTrees = 0
        for (const rootGoal of validator.GetRootMap().GetValues()) {
          listItemNumber++

          // display list item
          const output = rootGoal.goalWord
          let inputs = ''
          if (rootGoal.piece != null) {
            for (const inputSpiel of rootGoal.piece.inputSpiels) {
              inputs += `${FormatText(inputSpiel)},`
            }
          }
          const pieceCount = rootGoal.GetPieceCount()
          const status = rootGoal.GetValidated() as string
          console.warn(
            `    ${status}${pieceCount}${listItemNumber}. ${FormatText(output)} ${AddBrackets(inputs)} (root = ${(rootGoal.piece != null) ? 'found' : 'null'})`
          )
          numberOfClearedTrees += rootGoal.IsTreeCleared() ? 0 : 1
        }

        console.warn(`Number of goals back to zero ${numberOfClearedTrees}/${listItemNumber}`)

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
          validators.MatchLeavesAndRemoveFromGoalMap()
          continue
        } else {
          // show map entry for chosen item
          const theNumber = Number(input)
          if (theNumber > 0 && theNumber <= listItemNumber) {
            let j = 0
            for (const goal of validator.GetRootMap().GetValues()) {
              j++
              if (j === theNumber) {
                j++
                if (j === theNumber) {
                  if (goal.piece != null) {
                    NavigatePieceRecursive(goal.piece, validator.GetRootMap(), validator.GetVisibleThingsAtTheMoment())
                  } else {
                    prompt(`${goal.goalWord} Goal.piece WAS NULL. Hit any key to continue: `)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
