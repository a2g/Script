
import { Dialog } from './dialog/Dialog'
import { Piece } from './Piece'

export interface IPileOrRootPieceMap {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean) => void
  AddDialog: (dialog: Dialog) => void
}
