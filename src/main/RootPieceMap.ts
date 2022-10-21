import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { Piece } from './Piece'
import { PileOrRootPieceMap } from './PileOrRootPieceMap'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class RootPieceMap implements PileOrRootPieceMap {
  private readonly roots: Piece[]
  // file names?

  constructor (deepCopyFromMe: RootPieceMap | null, incompletePieces: Set<Piece>) {
    this.roots = []
    if (deepCopyFromMe != null) {
      for (const piece of deepCopyFromMe.roots.values()) {
        const clonedTree = piece.ClonePieceAndEntireTree(incompletePieces)
        this.roots.push(clonedTree)
      }
    }
  }

  CloneAllRootPiecesAndTheirTrees (incompletePieces: Set<Piece>): RootPieceMap {
    return new RootPieceMap(this, incompletePieces)
  }

  Has (goalToObtain: string): boolean {
    for (const goal of this.roots) {
      if (goal.output === goalToObtain) { return true }
    }
    return false
  }

  GetRootPieceByNameNoThrow (goalToObtain: string): Piece | null {
    for (const root of this.roots) {
      if (root.output === goalToObtain) {
        return root
      }
    }
    return null
  }

  GetRootPieceByName (name: string): Piece {
    const root = this.GetRootPieceByNameNoThrow(name)
    if (typeof root === 'undefined' || root === null) {
      throw new Error("rootPiece of that name doesn't exist " + name)
    }
    return root
  }

  CalculateListOfKeys (): string[] {
    const array: string[] = []
    for (const root of this.roots) {
      array.push(root.output)
    }
    return array
  }

  AddPiece (piece: Piece): void {
    // always add to list
    this.roots.push(piece)
  }

  Size (): number {
    return this.roots.length
  }

  GetValues (): Piece[] {
    return this.roots
  }

  GetAt (index: number): Piece {
    return this.roots[index]
  }

  public GenerateMapOfLeaves (): Map<string, Piece> {
    const map = new Map<string, Piece>()

    for (const rootPiece of this.roots.values()) {
      GenerateMapOfLeavesRecursively(rootPiece, rootPiece.output, map)
    }

    return map
  }
}
