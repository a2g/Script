import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb'
import { Raw } from '../puzzle/Raw'
import { Validators } from '../puzzle/Validators'
const prompt = promptSync({})

export function ChooseOrderOfCommands (validators: Validators): void {
  console.warn(' ')

  let infoLevel = 1
  for (; ;) {
    for (let i = 0; i < 40; i++) {
      validators.DeconstructAllAchievementsOfAllValidatorsAndRecordSteps()
    }
    const numberOfSolutions: number = validators.GetValidators().length

    console.warn('If any leaves are not resolved objerly, for example')
    console.warn(' - eg items show up as not found when they should be')
    console.warn(' starting objs, or inv items that should not be leafs.')
    console.warn(
      'Then add these to starting sets; or fix up pieces, such that'
    )
    console.warn(
      'the dependent pieces are discovered; or introduce achievement pieces'
    )
    console.warn('for items that two achievements need, but only one ends up with.')
    console.warn('GOTCHA: Also validate boxes against schema, as this has ')
    console.warn('been the cause of the problem numerous times.')
    console.warn('')
    console.warn('Pick solution')
    console.warn('================')
    console.warn(`Number of solutions = ${numberOfSolutions}`)
    if (validators.GetValidators().length > 1) {
      console.warn('    0. All solutions')
    }
    for (let i = 0; i < validators.GetValidators().length; i++) {
      const validator = validators.GetValidators()[i]
      const name = FormatText(validator.GetName())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${name}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an ingredient of one of the solutions or (b)ack, (r)e-run: '
    ).toLowerCase()

    if (input === null || input === 'b') {
      return
    }

    if (input === 'b') {
      continue
    }
    const theNumber = Number(input)
    // list all leaves, of all solutions in order
    const name =
      theNumber === 0
        ? 'all solutions'
        : validators.GetValidators()[theNumber - 1].GetName()
    console.warn(`List of Commands for ${name}`)
    console.warn('================')

    let listItemNumber = 0
    for (
      let solutionNumber = 0;
      solutionNumber < validators.GetValidators().length;
      solutionNumber++
    ) {
      const solution = validators.GetValidators()[solutionNumber]
      if (theNumber === 0 || theNumber - 1 === solutionNumber) {
        const letter = String.fromCharCode(65 + solutionNumber)
        const text = FormatText(solution.GetName())
        const NAME_NOT_DETERMINABLE = 'name_not_determinable'
        // HACKY!
        const label =
          text.length > 8
            ? text + '<-- yellow is unique sol name , red is constraints'
            : NAME_NOT_DETERMINABLE
        console.warn(`${letter}. ${label}`)

        const commands: RawObjectsAndVerb[] =
          solution.GetOrderOfCommands()
        for (const command of commands) {
          // 0 is cleanest, later numbers are more detailed
          if (command.type === Raw.Achievement && infoLevel < 3) {
            continue
          }
          listItemNumber++
          const formattedCommand = FormatCommand(command, infoLevel)
          console.warn(`    ${listItemNumber}. ${formattedCommand}`)
          if (command.type === Raw.Chat) {
            for (const speechLine of command.speechLines) {
              listItemNumber++
              console.warn(`    ${listItemNumber}. ${speechLine[0]}: ${speechLine[1]}`)
            }
          }
        }
      }
    }

    // allow user to choose item
    const input2 = prompt('Choose a step (b)ack, (r)e-run:, debug-level(1-9) ').toLowerCase()
    if (input2 === null || input2 === 'b') {
      return
    } else {
      // show map entry for chosen item
      const theNumber2 = Number(input2)
      if (theNumber2 >= 1 && theNumber <= 9) {
        infoLevel = theNumber2
      }
    }
  }
}

function FormatCommand (raw: RawObjectsAndVerb, infoLevel: number): string {
  raw.PopulateSpielFields()
  let toReturn = ''
  switch (infoLevel) {
    case 1:
    case 2:
    case 3:
      toReturn = `${raw.mainSpiel}`
      break
    case 4:
    case 5:
    case 6:
      toReturn = `${raw.mainSpiel}  ${raw.achievementSpiel}`
      break
    case 7:
    case 8:
    case 9:
      toReturn = `${raw.mainSpiel}  ${raw.achievementSpiel} ${raw.restrictionSpiel} ${raw.typeJustForDebugging}`
      break
  }
  return toReturn
}
