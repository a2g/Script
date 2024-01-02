import { Piece } from './Piece'

export class RootPiece {
  public piece: Piece

  public firstNullInput: string

  constructor (piece: Piece, firstIncompleteInput: string) {
    this.piece = piece
    this.firstNullInput = firstIncompleteInput
  }
}
