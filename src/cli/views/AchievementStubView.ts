import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { GoalStub } from '../../puzzle/GoalStub'
import { CommandsView } from './CommandsView'
import { PieceView } from './PieceView'
import { VisibleThingsMap } from '../../puzzle/VisibleThingsMap'
const prompt = promptSync({ sigint: true })

export function AchievementStubView (goalStub: GoalStub, visibleThingsAtTheMoment: VisibleThingsMap, titlePath: string[]): void {
  titlePath.push('AchievementStub')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `This achievement stub's Achievement Word is ${goalStub.GetAchievementWord()}` +
      `This achievement stub's Piece is ${goalStub.GetThePiece() !== null ? 'non-null' : 'null'}` +
      '\nWhat to do with achievement stub: (b)ack, (o)rdered-commands, (t)raverse tree  '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'o') {
      CommandsView(goalStub.GetOrderedCommands(), titlePath)
    } else if (input === 't') {
      const theGoalPiece = goalStub.GetThePiece()
      if (theGoalPiece != null) {
        PieceView(theGoalPiece, visibleThingsAtTheMoment, titlePath)
      } else {
        prompt(`${goalStub.GetAchievementWord()} Goal.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
