import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { AchievementStub } from '../../puzzle/AchievementStub'
import { CommandsView } from './CommandsView'
import { PieceView } from './PieceView'
import { VisibleThingsMap } from '../../puzzle/VisibleThingsMap'
const prompt = promptSync({ sigint: true })

export function AchievementStubView (stub: AchievementStub, visibleThingsAtTheMoment: VisibleThingsMap, titlePath: string[]): void {
  titlePath.push('AchievementStub')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `This achievement stub's Achievement Word is ${stub.GetTheAchievementWord()}` +
      `This achievement stub's Piece is ${stub.GetThePiece() !== null ? 'non-null' : 'null'}` +
      '\nWhat to do with achievement stub: (b)ack, (o)rdered-commands, (t)raverse tree  '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'o') {
      CommandsView(stub.GetOrderedCommands(), titlePath)
    } else if (input === 't') {
      const theGoalPiece = stub.GetThePiece()
      if (theGoalPiece != null) {
        PieceView(theGoalPiece, visibleThingsAtTheMoment, titlePath)
      } else {
        prompt(`${stub.GetTheAchievementWord()} Goal.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
