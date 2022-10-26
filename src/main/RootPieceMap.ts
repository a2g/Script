import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { Piece } from './Piece'
import { PileOrRootPieceMap } from './PileOrRootPieceMap'
import { RootPiece } from './RootPiece'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class RootPieceMap implements PileOrRootPieceMap {
  private readonly roots: Map<string, RootPiece>
  // file names?

  constructor (deepCopyFromMe: RootPieceMap | null, incompletePieces: Set<Piece>) {
    this.roots = new Map<string, RootPiece>()
    if (deepCopyFromMe != null) {
      for (const pair of deepCopyFromMe.roots) {
        const key = pair[0]
        const value = pair[1]
        const clonedTree = value.piece.ClonePieceAndEntireTree(incompletePieces)
        this.roots.set(key, new RootPiece(clonedTree, value.firstIncompleteInput))
      }
    }
  }

  CloneAllRootPiecesAndTheirTrees (incompletePieces: Set<Piece>): RootPieceMap {
    return new RootPieceMap(this, incompletePieces)
  }

  Has (goalToObtain: string): boolean {
    return this.roots.has(goalToObtain)
  }

  GetRootPieceByNameNoThrow (goalToObtain: string): RootPiece | undefined {
    return this.roots.get(goalToObtain)
  }

  GetRootPieceByName (name: string): RootPiece {
    const root = this.roots.get(name)
    if (typeof root === 'undefined' || root === null) {
      throw new Error("rootPiece of that name doesn't exist " + name)
    }
    return root
  }

  CalculateListOfKeys (): string[] {
    const array: string[] = []
    for (const key of this.roots.keys()) {
      array.push(key)
    }
    return array
  }

  AddPiece (piece: Piece): void {
    // always add to list
    this.roots.set(piece.output, new RootPiece(piece, ''))
  }

  Size (): number {
    return this.roots.size
  }

  GetValues (): IterableIterator<RootPiece> {
    return this.roots.values()
  }

  public GenerateMapOfLeaves (): Map<string, Piece | null> {
    const map = new Map<string, Piece | null>()

    for (const value of this.roots.values()) {
      const piece = value.piece
      GenerateMapOfLeavesRecursively(piece, piece.output, map)
    }

    return map
  }
}
