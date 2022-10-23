import { Piece } from './Piece'

export class RootPiece {
  public piece: Piece
  public isCompleted: boolean
  constructor (piece: Piece, isCompleted: boolean) {
    this.piece = piece
    this.isCompleted = isCompleted
  }
}
