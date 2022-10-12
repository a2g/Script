import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods'
import { Piece } from './Piece'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class PileOfPieces implements PileOfPiecesReadOnly {
  private readonly solutionPieceMap: Map<string, Set<Piece>>

  constructor(cloneFromMe: PileOfPiecesReadOnly | null) {
    this.solutionPieceMap = new Map<string, Set<Piece>>()
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
          this.solutionPieceMap.set(outputName, clonedSet)
        }
      }
    }
  }

  GetAutos(): Piece[] {
    const toReturn = new Array<Piece>()
    this.solutionPieceMap.forEach((value: Set<Piece>) => {
      value.forEach((piece: Piece) => {
        if (piece.type.startsWith('AUTO')) {
          toReturn.push(piece)
        }
      })
    })
    return toReturn
  }

  HasAnyPiecesThatOutputObject(objectToObtain: string): boolean {
    return this.solutionPieceMap.has(objectToObtain)
  }

  GetPiecesThatOutputObject(objectToObtain: string): Set<Piece> | undefined {
    return this.solutionPieceMap.get(objectToObtain)
  }

  Has(objectToObtain: string): boolean {
    return this.solutionPieceMap.has(objectToObtain)
  }

  Get(objectToObtain: string): Set<Piece> | undefined {
    return this.solutionPieceMap.get(objectToObtain)
  }

  GetIterator(): IterableIterator<Set<Piece>> {
    return this.solutionPieceMap.values()
  }

  Size(): number {
    let count = 0
    for (const set of this.solutionPieceMap.values()) {
      count += set.size
    }
    return count
  }

  ContainsId(idToMatch: number): boolean {
    for (const set of this.solutionPieceMap.values()) {
      for (const piece of set) {
        if (piece.id === idToMatch) { return true }
      }
    }
    return false
  }

  // methods for mutating
  MergeInPiecesFromScene(box: BoxReadOnlyWithFileMethods): void {
    box.CopyAllPiecesToGivenMap(this)
  }

  AddMapEntryUsingOutputAsKey(piece: Piece): void {
    // initialize array, if it hasn't yet been
    if (!this.solutionPieceMap.has(piece.output)) {
      this.solutionPieceMap.set(piece.output, new Set<Piece>())
    }
    // always add to list
    this.solutionPieceMap.get(piece.output)?.add(piece)
  }

  RemovePiece(piece: Piece): void {
    if (piece.count - 1 <= 0) {
      const key = piece.output
      if (this.solutionPieceMap.has(key)) {
        const oldSet = this.solutionPieceMap.get(key)
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
