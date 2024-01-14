import { IPileOfPiecesReadOnly } from './IPileOfPiecesReadOnly'
import { Piece } from './Piece'
import { SpecialTypes } from './SpecialTypes'

/**
 * This is basically wraps a multimap - no extra data -
 * so we can more easily obtain all the pieces whose output
 * node matches a given input.
 *
 * It also has non-trivial implementations for the following reasons:
 * - deep cloning (important for solution gathering)
 * - RemovePiece considers piece counts
 * - get Autos to retrieve piece.type.startsWith
 * - GetPiecesThatOutputString returns empty set if no match
 * - GetSinglePieceById matches by id
 */
export class PileOfPieces implements IPileOfPiecesReadOnly {
  private readonly piecesMappedByOutput: Map<string, Set<Piece>>
  private readonly displayName: string
  constructor (cloneFromMe: IPileOfPiecesReadOnly | null, displayName = '') {
    this.displayName = displayName
    this.piecesMappedByOutput = new Map<string, Set<Piece>>()
    if (cloneFromMe != null) {
      for (const set of cloneFromMe.GetIterator()) {
        if (set.size > 0) {
          const clonedSet = new Set<Piece>()
          let outputName = ''
          for (const piece of set) {
            const clonedPiece = piece.ClonePieceAndEntireTree()
            clonedSet.add(clonedPiece)
            outputName = clonedPiece.output
          }
          this.piecesMappedByOutput.set(outputName, clonedSet)
        }
      }
    }
  }

  public RemovePiece (piece: Piece): void {
    if (piece.reuseCount - 1 <= 0) {
      const key = piece.output
      if (this.piecesMappedByOutput.has(key)) {
        const oldSet = this.piecesMappedByOutput.get(key)
        if (oldSet != null) {
          // console.warn(" old size = "+oldSet.size);
          oldSet.delete(piece)
          // console.warn(" newSize = "+oldSet.size);
        }
      } else {
        piece.SetCount(piece.reuseCount - 1)
        console.warn(`trans.count is now ${piece.reuseCount}`)
      }
    }
  }

  public GetAutos (): Piece[] {
    const toReturn: Piece[] = []
    this.piecesMappedByOutput.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (piece.type.startsWith('AUTO')) {
          toReturn.push(piece)
        }
      })
    })
    return toReturn
  }

  public AddPiece (piece: Piece, _folder = '', _isNoFile = true): void {
    if (!piece.type.startsWith('AUTO_GOAL1_MET')) {
      // initialize array, if it hasn't yet been
      if (!this.piecesMappedByOutput.has(piece.output)) {
        this.piecesMappedByOutput.set(piece.output, new Set<Piece>())
      }
      // always add to list
      this.piecesMappedByOutput.get(piece.output)?.add(piece)
    }
  }

  public GetSinglePieceById (idToMatch: number): Piece | null {
    for (const set of this.piecesMappedByOutput.values()) {
      for (const piece of set) {
        if (piece.id === idToMatch) {
          return piece
        }
      }
    }
    return null
  }

  public GetPiecesThatOutputString (objectToObtain: string): Set<Piece> {
    // since the remainingPieces are a map index by output piece
    // then a remainingPieces.Get will retrieve all matching pieces.
    // BUT...
    // we want it to return a random empty set if not found
    // and for now, it seems like it was changed to a slow
    // iteration through the map to match - possibly for debugging.
    for (const pair of this.piecesMappedByOutput) {
      if (pair[0] === objectToObtain) {
        return pair[1]
      }
    }
    return new Set<Piece>()
  }

  public Size (): number {
    let count = 0
    for (const set of this.piecesMappedByOutput.values()) {
      count += set.size
    }
    return count
  }

  public Has (givenOutput: string): boolean {
    return this.piecesMappedByOutput.has(givenOutput)
  }

  public Get (givenOutput: string): Set<Piece> | undefined {
    return this.piecesMappedByOutput.get(givenOutput)
  }

  public GetIterator (): IterableIterator<Set<Piece>> {
    return this.piecesMappedByOutput.values()
  }

  public CopyAllPiecesToPile (destinationPile: PileOfPieces): void {
    this.piecesMappedByOutput.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        destinationPile.AddPiece(piece, '', true)
      })
    })
  }

  public StubOutInputsWithInputHint (hintToMatch: string): number {
    console.assert(hintToMatch.endsWith('_goal'), 'should end with goal')
    let stubbings = 0
    this.piecesMappedByOutput.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((unusedPiece: Piece) => {
        for (let k = 0; k < unusedPiece.inputHints.length; k++) {
          if (unusedPiece.inputHints[k] === hintToMatch) {
            console.log(`Stubbed out ${hintToMatch} in ${unusedPiece.type} in ${this.displayName}`)
            unusedPiece.StubOutInputK(k, SpecialTypes.CompletedElsewhere)
            stubbings += 1
          }
        }
      })
    })
    return stubbings
  }
}
