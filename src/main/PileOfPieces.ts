import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods'
import { Piece } from './Piece'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class PileOfPieces implements PileOfPiecesReadOnly {
  private readonly piecesMappedByOutput: Map<string, Set<Piece>>

  constructor (cloneFromMe: PileOfPiecesReadOnly | null) {
    this.piecesMappedByOutput = new Map<string, Set<Piece>>()
    if (cloneFromMe != null) {
      for (const set of cloneFromMe.GetIterator()) {
        if (set.size > 0) {
          const clonedSet = new Set<Piece>()
          const throwawaySet = new Set<Piece>()
          let outputName = ''
          for (const piece of set) {
            const clonedPiece = piece.ClonePieceAndEntireTree(throwawaySet)
            clonedSet.add(clonedPiece)
            outputName = clonedPiece.output
          }
          this.piecesMappedByOutput.set(outputName, clonedSet)
        }
      }
    }
  }

  GetAutos (): Piece[] {
    const toReturn = new Array<Piece>()
    this.piecesMappedByOutput.forEach((value: Set<Piece>) => {
      value.forEach((piece: Piece) => {
        if (piece.type.startsWith('AUTO')) {
          toReturn.push(piece)
        }
      })
    })
    return toReturn
  }

  HasAnyPiecesThatOutputObject (givenOutput: string): boolean {
    return this.piecesMappedByOutput.has(givenOutput)
  }

  GetPiecesThatOutputObject (givenOutput: string): Set<Piece> | undefined {
    return this.piecesMappedByOutput.get(givenOutput)
  }

  Has (givenOutput: string): boolean {
    return this.piecesMappedByOutput.has(givenOutput)
  }

  Get (givenOutput: string): Set<Piece> | undefined {
    return this.piecesMappedByOutput.get(givenOutput)
  }

  GetIterator (): IterableIterator<Set<Piece>> {
    return this.piecesMappedByOutput.values()
  }

  Size (): number {
    let count = 0
    for (const set of this.piecesMappedByOutput.values()) {
      count += set.size
    }
    return count
  }

  ContainsId (idToMatch: number): boolean {
    for (const set of this.piecesMappedByOutput.values()) {
      for (const piece of set) {
        if (piece.id === idToMatch) { return true }
      }
    }
    return false
  }

  // methods for mutating
  MergeInPiecesFromScene (box: BoxReadOnlyWithFileMethods): void {
    box.CopyPiecesFromBoxInToPile(this)
  }

  AddMapEntryUsingOutputAsKey (piece: Piece): void {
    // initialize array, if it hasn't yet been
    if (!this.piecesMappedByOutput.has(piece.output)) {
      this.piecesMappedByOutput.set(piece.output, new Set<Piece>())
    }
    // always add to list
    this.piecesMappedByOutput.get(piece.output)?.add(piece)
  }

  RemovePiece (piece: Piece): void {
    if (piece.count - 1 <= 0) {
      const key = piece.output
      if (this.piecesMappedByOutput.has(key)) {
        const oldSet = this.piecesMappedByOutput.get(key)
        if (oldSet != null) {
          // console.log(" old size = "+oldSet.size);
          oldSet.delete(piece)
          // console.log(" newSize = "+oldSet.size);
        }
      } else {
        piece.count--
        console.log(`trans.count is now ${piece.count}`)
      }
    }
  }
}
