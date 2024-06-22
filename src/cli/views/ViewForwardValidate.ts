import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { Validators } from '../../puzzle/Validators'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { ValidatorView } from './ValidatorView'
import { Solved } from '../../puzzle/Solved'
const prompt = promptSync({})

export function ViewForwardValidate (validators: Validators): void {
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
      const b = validator.GetNumberOfAchievements()
      const status = a === 0 ? Solved.Solved : Solved.Not

      console.warn(`    ${i + 1}. ${status}(${a}/${b}) ${name} `)
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
      validators.DeconstructAllAchievementsOfAllValidatorsAndRecordSteps()
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > validators.GetValidators().length) {
        continue
      }

      // if they chose a number, go to that number
      const validator = validators.GetValidators()[theNumber - 1]
      ValidatorView(validator, [...titlePath])
    }
  }
}
