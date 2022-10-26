import { Piece } from './Piece'

export class RootPiece {
  public piece: Piece
  public firstIncompleteInput: string
  constructor (piece: Piece, firstIncompleteInput: string) {
    this.piece = piece
    this.firstIncompleteInput = firstIncompleteInput
  }
}
