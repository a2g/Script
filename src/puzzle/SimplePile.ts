import { Piece } from './Piece'
import { TalkFile } from './talk/TalkFile'
import { IPileOrSimplePile } from './IPileOrSimplePile'
import { Aggregates } from './Aggregates'

export class SimplePile implements IPileOrSimplePile {
  array: Piece[]
  constructor () {
    this.array = []
  }

  AddPiece (piece: Piece, _folder: string, _isNoFile: boolean, _report: Aggregates): void {
    this.array.push(piece)
  }

  public AddTalkFile (_talkFile: TalkFile): void {
  }
}
