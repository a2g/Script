import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively.js'
import { Piece } from './Piece.js'
import { PileOrRootPieceMap } from './PileOrRootPieceMap.js'
import { RootPiece } from './RootPiece.js'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class RootPieceMap implements PileOrRootPieceMap {
  private readonly roots: Map<string, RootPiece>
  // file names?

  constructor (deepCopyFromMe: RootPieceMap | null) {
    this.roots = new Map<string, RootPiece>()
    if (deepCopyFromMe != null) {
      for (const pair of deepCopyFromMe.roots) {
        const key = pair[0]
        const value = pair[1]
        const clonedTree = value.piece.ClonePieceAndEntireTree()
        this.roots.set(key, new RootPiece(clonedTree, value.firstNullInput))
      }
    }
  }

  CloneAllRootPiecesAndTheirTrees (): RootPieceMap {
    return new RootPieceMap(this)
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
      throw new Error(`rootPiece of that name doesn't exist ${name}`)
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
    this.roots.set(piece.output, new RootPiece(piece, 'Default'))
  }

  Size (): number {
    return this.roots.size
  }

  GetValues (): IterableIterator<RootPiece> {
    return this.roots.values()
  }

  /**
   * returns unsolved root nodes
   *
   * this is only here for the ui method
   * */
  GenerateMapOfLeaves (): Map<string, Piece | null> {
    const leaves = new Map<string, Piece | null>()
    for (const root of this.GetValues()) {
      GenerateMapOfLeavesRecursively(root.piece, '', leaves)
    }
    return leaves
  }
}
