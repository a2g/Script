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
      const name = FormatText(validator.GetName())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      const a = validator.GetNumberOfClearedGoals()
      const b = validator.GetNumberOfGoals()
      console.warn(`    ${i + 1}. (${a}/${b}) ${name} `)
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
      validators.DeconstructAllGoalsOfAllValidatorsAndRecordSteps()
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
        for (const rootGoal of validator.GetRootMap().GetValues()) {
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
          const pieceCount = rootGoal.GetCountRecursively()
          const originalCount = rootGoal.GetOriginalPieceCount()
          // const status = rootGoal.GetValidated() as string
          console.warn(
            `    ${listItemNumber}.(${pieceCount} / ${originalCount}/) ${FormatText(output)} ${AddBrackets(inputs)} (root = ${(rootGoal.GetPiece() != null) ? 'found' : 'null'})`
          )
        }

        console.warn(`Pieces remaining ${validator.GetNumberOfRemainingPieces()}`)

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
                const theGoalPiece = goal.GetPiece()
                if (theGoalPiece != null) {
                  NavigatePieceRecursive(theGoalPiece, validator.GetRootMap(), validator.GetVisibleThingsAtTheMoment())
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
