import promptSync from 'prompt-sync'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { Raw } from '../../puzzle/Raw'
import { RawObjectsAndVerb } from '../../puzzle/RawObjectsAndVerb'
const prompt = promptSync({ sigint: true })

export function CommandsView (commands: RawObjectsAndVerb[], titlePath: string[]
): void {
  titlePath.push('Commands')
  let infoLevel = 9
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    let listItemNumber = 0

    for (const command of commands) {
      // 0 is cleanest, later numbers are more detailed
      if (command.type === Raw.Achievement && infoLevel < 3) {
        continue
      }
      listItemNumber++
      const formattedCommand = FormatCommand(command, infoLevel)
      console.warn(`${listItemNumber}. ${formattedCommand}`)
      if (command.type === Raw.Chat) {
        for (const speechLine of command.speechLines) {
          console.warn(`   ${speechLine[0]}: ${speechLine[1]}`)
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
      if (theNumber2 >= 1 && theNumber2 <= 9) {
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
