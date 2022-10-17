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
    for (let i = 0; i < this.roots.length; i++) {
      const root = this.roots[i].inputHints[0]
      if (root === goalToObtain) {
        return this.roots[i].inputs[0]
      }
    }
    return null
  }

  GetRootPieceByName (name: string): Piece {
    const root = this.GetRootPieceByNameNoThrow(name)
    if (typeof root === 'undefined' || root === null) { throw new Error("rootPiece of that name doesn't exist") }
    return root
  }

  CalculateListOfKeys (): String[] {
    const array = []
    for (let i = 0; i < this.roots.length; i++) {
      const root = this.roots[i].inputHints[0]
      array.push(root)
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
