import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { Validators } from '../puzzle/Validators'
import { ShowUnderlinedTitle } from './ShowUnderlinedTitle'
import { DeconstructPieceTrees } from './page/DeconstructPieceTrees'
const prompt = promptSync({})

export function ChooseForwardValidate (validators: Validators): void {
  const titlePath = ['Forwards Validate']
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const numberOfSolutions: number = validators.GetValidators().length

    console.warn(`Number of solutions = ${numberOfSolutions} , Legend: (a, b)= (not-yet-done, total)`)
    if (validators.GetValidators().length > 1) {
      console.warn('    0. All solutions')
    }
    const validatorList = validators.GetValidators()
    for (let i = 0; i < validatorList.length; i++) {
      const validator = validatorList[i]
      const name = FormatText(validator.GetName())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      const a = validator.GetNumberOfNotYetValidated()
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

      // if they chose a number, go to that number
      DeconstructPieceTrees(validators, theNumber, titlePath)
    }
  }
}
