import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'
/**
 *  Needed to be able to pass around a pile of pieces that was readonly,
 * thus here we have the PileOfPieces...ReadOnly edition.
 */
export interface IPileOfPiecesReadOnly {
  GetAutos: () => Piece[]
  GetPiecesThatOutputString: (objectToObtain: string) => Set<Piece>
  Has: (objectToObtain: string) => boolean
  Get: (objectToObtain: string) => Set<Piece> | undefined
  GetPieceIterator: () => IterableIterator<Set<Piece>>
  GetTalkIterator: () => IterableIterator<TalkFile>
  Size: () => number
  AddTalkFile: (talkFile: TalkFile) => void
}
