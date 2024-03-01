
import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'

export interface IPileOrRootPieceMap {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean) => void
  AddTalkFile: (talkFile: TalkFile) => void
}
