import { Piece } from './Piece'

export interface PileOfPiecesReadOnly {
  GetAutos: () => Piece[]
  HasAnyNodesThatOutputObject: (objectToObtain: string) => boolean
  GetNodesThatOutputObject: (objectToObtain: string) => Set<Piece> | undefined
  Has: (objectToObtain: string) => boolean
  Get: (objectToObtain: string) => Set<Piece> | undefined
  GetValues: () => IterableIterator<Set<Piece>>
  Size: () => number
  ContainsId: (idToMatch: number) => boolean
}
