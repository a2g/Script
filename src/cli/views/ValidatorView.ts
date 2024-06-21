import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { AddBrackets } from '../../puzzle/AddBrackets'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { CommandsView } from './CommandsView'
import { AchievementStubView } from './AchievementStubView'
import { Validator } from '../../puzzle/Validator'

const prompt = promptSync({})

export function ValidatorView (validator: Validator, titlePath: string[]): void {
  titlePath.push('Validator')
  for (; ;) {
    // I don't like putting this below the list - but I do like having it there
    // each time, for debugging, so I'll put it up here, before tht title.
    console.warn(`Pieces remaining ${validator.GetNumberOfRemainingPieces()} (${validator.GetRemainingPiecesAsString()})`)

    ShowUnderlinedTitle(titlePath)
    // list all leaves, of all solutions in order
    // TrimNonIntegratedRootPieces(solution) <-- pretty sure this did nothing
    const text = FormatText(validator.GetName())
    const NAME_NOT_DETERMINABLE = 'name_not_determinable'
    // HACKY!
    const label =
      text.length > 8
        ? text
        : NAME_NOT_DETERMINABLE

    console.warn(`${label}`)
    let listItemNumber = 0
    for (const rootAchievement of validator.GetRootMap().GetValues()) {
      listItemNumber++

      // display list item
      const output = rootAchievement.GetTheAchievementWord()
      const theAchievementPiece = rootAchievement.GetThePiece()
      let inputs = ''
      if (theAchievementPiece != null) {
        for (const inputSpiel of theAchievementPiece.inputSpiels) {
          inputs += `${FormatText(inputSpiel)},`
        }
      }
      const pieceCount = rootAchievement.GetCountRecursively()
      const originalCount = rootAchievement.GetOriginalPieceCount()
      const id = (theAchievementPiece != null) ? theAchievementPiece.id : ''
      const status = rootAchievement.GetValidated() as string
      console.warn(
        `${listItemNumber}. ${status}(${pieceCount}/${originalCount}) ${FormatText(output)} ${id} ${AddBrackets(inputs)}`
      )
    }

    console.warn(`Number of achievements back to zero ${validator.GetNumberOfNotYetValidated()}/${validator.GetNumberOfAchievements()}`)

    // allow user to choose item
    const input = prompt(
      'Choose achievement to climb down on or (b)ack, (o)rder, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      break
    }
    if (input === 'x') {
      return
    }
    if (input === 'r') {
      validator.DeconstructAllAchievementsAndRecordSteps()
      continue
    } else if (input === 'o') {
      CommandsView(validator.GetOrderOfCommands(), titlePath)
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let j = 0
        for (const achievement of validator.GetRootMap().GetValues()) {
          j++
          if (j === theNumber) {
            AchievementStubView(achievement, validator.GetVisibleThingsAtTheMoment(), titlePath)
            return
          }
        }
      }
    }
  }
}
