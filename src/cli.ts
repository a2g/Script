import promptSync from 'prompt-sync'
import { Solutions } from './puzzle/Solutions'
import { ChooseListOfLeaves } from './cli/ChooseListOfLeaves'
import { ChooseOrderOfCommands } from './cli/ChooseOrderOfCommands'
import { $IStarter, getJsonOfStarters } from './api/getJsonOfStarters'
import { ChooseDigIntoGoals2 } from './cli/ChooseDigIntoGoals2'
// import { DumpGainsFromEachTalkInFolder } from './cli/DumpGansFromEachTalkInFolder'
import { Validators } from './puzzle/Validators'
import { ChooseValidateSolution } from './cli/ChooseValidateSolutions'
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
          for (; ;) {
            const starter = starters[index]
            // DumpGainsFromEachTalkInFolder(starter.folder)

            const solutions = new Solutions(starter.folder, starter.file)

            console.warn(`\nSubMenu of ${starter.file}`)
            console.warn(
              `number of pieces = ${solutions
                .GetSolutions()[0]
                .GetNumberOfPiecesRemaining()}`
            )
            console.warn('---------------------------------------')
            console.warn('1. Solve backwards all boxes mixed together')
            console.warn('2. Validate forward a box-at-a-time')
            console.warn('3. Leaves all boxes at once.')
            console.warn('4. Leaves a box-at-a-time`')
            console.warn('5. Order of Commands in solve')
            console.warn('6. Choose Dig into goals (old)')
            console.warn('8. Play')

            const choice = prompt('Choose an option (b)ack: ').toLowerCase()
            if (choice === 'b') {
              break
            }
            switch (choice) {
              case '1':
                ChooseDigIntoGoals2(solutions)
                break
              case '2':
                {
                  console.warn(' ')
                  for (let i = 0; i < 200; i++) {
                    solutions.SolvePartiallyUntilCloning()
                    solutions.MarkGoalsAsCompletedAndMergeIfNeeded()
                  }
                  solutions.PerformThingsNeededAfterAllSolutionsFound()
                  const validators = new Validators(solutions)
                  ChooseValidateSolution(validators)
                }
                break
              case '3':
                ChooseListOfLeaves(solutions)
                break
              case '4':
                ChooseListOfLeaves(solutions)
                break
              case '5':
                ChooseOrderOfCommands(solutions)
                break
                // case '6':
                // ChooseDigDeprecated(  )
                // break

              default:
            }
          }
        }
    }
  }
}

main()
