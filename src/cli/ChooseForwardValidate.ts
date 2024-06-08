import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { AddBrackets } from '../puzzle/AddBrackets'
import { Validators } from '../puzzle/Validators'
import { TreeClimbingWhilstDeconstructing } from './TreeClimbingWhilstDeconstructing'

const prompt = promptSync({})

export function ChooseForwardValidate (validators: Validators): void {
  for (; ;) {
    const numberOfSolutions: number = validators.GetValidators().length

    // solutions.GenerateSolutionNamesAndPush()
    console.warn('Forward Validate')
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

    }
  }
}
