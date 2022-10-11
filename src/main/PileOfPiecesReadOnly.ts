import { Piece } from './Piece'

export interface PileOfPiecesReadOnly {
  GetAutos: () => Piece[]
  HasAnyPiecesThatOutputObject: (objectToObtain: string) => boolean
  GetPiecesThatOutputObject: (objectToObtain: string) => Set<Piece> | undefined
  Has: (objectToObtain: string) => boolean
  Get: (objectToObtain: string) => Set<Piece> | undefined
  GetValues: () => IterableIterator<Set<Piece>>
  Size: () => number
  ContainsId: (idToMatch: number) => boolean
}
