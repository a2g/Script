import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece'
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb'
import { Raw } from '../puzzle/Raw'
const prompt = promptSync({})

export function ChooseDigIntoGoals2 (solver: SolverViaRootPiece): void {
  console.warn(' ')

  let infoLevel = 1
  for (; ;) {
    solver.MarkGoalsAsCompletedAndMergeIfNeeded()
    const numberOfSolutions: number = solver.NumberOfSolutions()
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions in solver = ${numberOfSolutions}`)

    solver.GenerateSolutionNamesAndPush()
    console.warn('Pick solution')
    console.warn('================')
    console.warn(`Number of solutions = ${numberOfSolutions}`)
    if (solver.GetSolutions().length > 1) {
      console.warn('    0. All solutions')
    }
    for (let i = 0; i < solver.GetSolutions().length; i++) {
      const solution = solver.GetSolutions()[i]
      let numberOfUnsolveds = 0
      for (const goalArray of solution.GetRootMap().GetValues()) {
        for (const goal of goalArray) {
          numberOfUnsolveds += goal.isUnsolved ? 1 : 0
        }
      }
      const name = FormatText(solution.GetDisplayNamesConcatenated())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${name} UnSolved=${numberOfUnsolveds}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an ingredient of one of the solutions or (b)ack, (r)e-run: '
    ).toLowerCase()

    if (input === null || input === 'b') {
      return
    }

    if (input === 'r') {
      solver.SolvePartiallyUntilCloning()
      continue
    } else {
      const theNumber = Number(input)
      // list all leaves, of all solutions in order
      const name =
        theNumber === 0
          ? 'all solutions'
          : solver.GetSolutions()[theNumber - 1].GetDisplayNamesConcatenated()
      console.warn(`List of Commands for ${name}`)
      console.warn('================')

      let listItemNumber = 0
      for (
        let solutionNumber = 0;
        solutionNumber < solver.GetSolutions().length;
        solutionNumber++
      ) {
        const solution = solver.GetSolutions()[solutionNumber]
        if (theNumber === 0 || theNumber - 1 === solutionNumber) {
          const letter = String.fromCharCode(65 + solutionNumber)
          const text = FormatText(solution.GetDisplayNamesConcatenated())
          const NAME_NOT_DETERMINABLE = 'name_not_determinable'
          // HACKY!
          const label =
            text.length > 8
              ? text + '<-- yellow is type of leaf, red is constraints'
              : NAME_NOT_DETERMINABLE
          console.warn(`${letter}. ${label} `)

          const commands: RawObjectsAndVerb[] =
            solution.GetOrderOfCommands()
          for (const command of commands) {
            // 0 is cleanest, later numbers are more detailsed
            if (command.type === Raw.Goal && infoLevel < 3) {
              continue
            }
            listItemNumber++
            const formattedCommand = FormatCommand(command, infoLevel)
            console.warn(`    ${listItemNumber}. ${formattedCommand} `)
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
}

function FormatCommand (raw: RawObjectsAndVerb, infoLevel: number): string {
  raw.PopulateSpielFields()
  let toReturn = ''
  switch (infoLevel) {
    case 1:
    case 2:
    case 3:
      toReturn = `${raw.mainSpiel} `
      break
    case 4:
    case 5:
    case 6:
      toReturn = `${raw.mainSpiel}  ${raw.goalSpiel} `
      break
    case 7:
    case 8:
    case 9:
      toReturn = `${raw.mainSpiel}  ${raw.goalSpiel} ${raw.restrictionSpiel} ${raw.typeJustForDebugging} `
      break
  }
  return toReturn
}
