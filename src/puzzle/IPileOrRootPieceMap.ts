import { Piece } from './Piece'

export interface IPileOrRootPieceMap {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean) => void
}
