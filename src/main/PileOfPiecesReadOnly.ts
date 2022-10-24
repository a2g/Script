import { Piece } from './Piece'
/**
 *  Needed to be able to pass around a pile of pieces that was readonly,
 * thus here we have the PileOfPieces...ReadOnly edition.
 */
export interface PileOfPiecesReadOnly {
  GetAutos: () => Piece[]
  HasAnyPiecesThatOutputObject: (objectToObtain: string) => boolean
  GetPiecesThatOutputObject: (objectToObtain: string) => Piece[] | undefined
  Has: (objectToObtain: string) => boolean
  Get: (objectToObtain: string) => Set<Piece> | undefined
  GetIterator: () => IterableIterator<Set<Piece>>
  Size: () => number
  ContainsId: (idToMatch: number) => boolean
}
