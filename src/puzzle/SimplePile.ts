import { IPileOrRootPieceMap } from './IPileOrRootPieceMap'
import { Piece } from './Piece'
import { TalkFile } from './talk/TalkFile'

export class SimplePile implements IPileOrRootPieceMap {
  array: Piece[]
  constructor () {
    this.array = []
  }

  public AddPiece (piece: Piece, _folder: string, _isNoFile: boolean): void {
    this.array.push(piece)
  }

  public AddTalkFile (_talkFile: TalkFile): void {
  }
}
