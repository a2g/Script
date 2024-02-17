
import { ChatFile } from './chat/ChatFile'
import { Piece } from './Piece'

export interface IPileOrRootPieceMap {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean) => void
  AddDialog: (dialog: ChatFile) => void
}
