
import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'
import { Aggregates } from './Aggregates'

export interface IPileOrSimplePile {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean, pieceAddingReport: Aggregates) => void
  AddTalkFile: (talkFile: TalkFile) => void
}
