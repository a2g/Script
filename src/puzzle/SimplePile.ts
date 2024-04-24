import { Piece } from './Piece'
import { TalkFile } from './talk/TalkFile'
import { IPileOrSimplePile } from './IPileOrSimplePile'
import { Box } from './Box'

export class SimplePile implements IPileOrSimplePile {
  array: Piece[]
  constructor () {
    this.array = []
  }

  AddPiece (piece: Piece, _folder: string, _isNoFile: boolean, _goalWords: Set<string>, _mapOfBoxes: Map<string, Box>): void {
    this.array.push(piece)
  }

  public AddTalkFile (_talkFile: TalkFile): void {
  }

  public AddGoalWord (_goalWord: string): void {
  }
}
