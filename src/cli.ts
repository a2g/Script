import promptSync from 'prompt-sync'
import { Solutions } from './puzzle/Solutions'
import { ChooseListOfLeaves } from './cli/ChooseListOfLeaves'
import { ChooseOrderOfCommands } from './cli/ChooseOrderOfCommands'
import { $IStarter, getJsonOfStarters } from './api/getJsonOfStarters'
import { ChooseBackwardSolve } from './cli/ChooseBackwardSolve'
// import { DumpGainsFromEachChatInFolder } from './cli/DumpGansFromEachChatInFolder'
import { Validators } from './puzzle/Validators'
import { ChooseForwardValidate } from './cli/ChooseForwardValidate'
import { ChoosePiecesInBoxes } from './cli/ChoosePiecesInBoxes'
// import { ChooseValidateSolution } from './cli/ChooseValidateSolutions'

const prompt = promptSync()

function main (): void {
  const starters: $IStarter[] = getJsonOfStarters()

  for (; ;) {
    for (let i = 1; i <= starters.length; i++) {
      const starter = starters[i - 1]
      console.warn(`${i}. ${starter.world} ${starter.area}  ${i}`)
    }

    const indexAsString = prompt(
      'Choose an area to Load (b)ail): '
    ).toLowerCase()
    const index = Number(indexAsString) - 1
    switch (indexAsString) {
      case 'b':
        return
      default:
        if (index >= 0 && index < starters.length) {
          const starter = starters[index]
          // DumpGainsFromEachChatInFolder(starter.folder)

          const solutions = new Solutions(starter.folder, starter.file)

          for (; ;) {
            console.warn(`\nSubMenu of ${starter.file}`)
            console.warn(
              `number of pieces = ${solutions
                .GetSolutions()[0]
                .GetNumberOfPiecesRemaining()}`
            )
            console.warn('---------------------------------------')
            console.warn('1. Solve backwards all boxes mixed together')
            console.warn('2. Validate forward a box-at-a-time')
            console.warn('3. Pieces in Boxes.')
            console.warn('4. Leaves all boxes at once.')
            console.warn('5. Leaves a box-at-a-time`')
            console.warn('6. Order of Commands in solve')
            console.warn('7. Choose climb into piece-trees (old)')
            console.warn('8. Play')

            const choice = prompt('Choose an option (b)ack: ').toLowerCase()
            if (choice === 'b') {
              break
            }
            switch (choice) {
              case '1':
                ChooseBackwardSolve(solutions)
                break
              case '2':
                {
                  console.warn(' ')
                  for (let i = 0; i < 200; i++) {
                    solutions.SolvePartiallyUntilCloning()
                    solutions.UpdateSolvedStatuses()
                  }
                  solutions.PerformThingsNeededAfterAllSolutionsFound()
                  const validators = new Validators(solutions)
                  ChooseForwardValidate(validators)
                }
                break
              case '3':
                ChoosePiecesInBoxes(solutions)
                break
              case '4':
                ChooseListOfLeaves(solutions)
                break
              case '5':
                ChooseListOfLeaves(solutions)
                break
              case '6':
              {
                console.warn(' ')
                for (let i = 0; i < 200; i++) {
                  solutions.SolvePartiallyUntilCloning()
                  solutions.UpdateSolvedStatuses()
                }
                solutions.PerformThingsNeededAfterAllSolutionsFound()
                const validators = new Validators(solutions)

                ChooseOrderOfCommands(validators)
                break
              }

              default:
            }
          }
        }
    }
  }
}

main()
