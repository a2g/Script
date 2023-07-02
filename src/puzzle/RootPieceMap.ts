import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively';
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap';
import { Piece } from './Piece';
import { RootPiece } from './RootPiece';
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution pieces
 */
export class RootPieceMap implements IPileOrRootPieceMap {
  private readonly roots: Map<string, RootPiece[]>;
  // file names?

  constructor(deepCopyFromMe: RootPieceMap | null) {
    this.roots = new Map<string, RootPiece[]>();
    if (deepCopyFromMe != null) {
      for (const pair of deepCopyFromMe.roots) {
        const key = pair[0];
        const value = pair[1];
        let array = [];
        this.roots.set(key, []);
        for (const rootPiece of value) {
          const clonedTree = rootPiece.piece.ClonePieceAndEntireTree();
          array.push(new RootPiece(clonedTree, rootPiece.firstNullInput));
        }
        this.roots.set(key, array);
      }
    }
  }

  public CloneAllRootPiecesAndTheirTrees(): RootPieceMap {
    return new RootPieceMap(this);
  }

  public Has(goalToObtain: string): boolean {
    return this.roots.has(goalToObtain);
  }

  public GetRootPieceArrayByNameNoThrow(
    goalToObtain: string
  ): RootPiece[] | undefined {
    return this.roots.get(goalToObtain);
  }

  public GetRootPieceArrayByName(name: string): RootPiece[] {
    const root = this.roots.get(name);
    if (typeof root === 'undefined' || root === null) {
      throw new Error(`rootPiece of that name doesn't exist ${name}`);
    }
    return root;
  }

  public CalculateListOfKeys(): string[] {
    const array: string[] = [];
    for (const key of this.roots.keys()) {
      array.push(key);
    }
    return array;
  }

  public AddPiece(piece: Piece): void {
    // always add to list
    let array: RootPiece[] | undefined = []
    if (this.roots.get(piece.output) != null) {
      array = this.roots.get(piece.output)
    } else {
      this.roots.set(piece.output, array)
    }

    if (array != null) {
      array.push(new RootPiece(piece, 'Unsolved'));
    }
  }

  public Size(): number {
    return this.roots.size;
  }

  public GetValues(): IterableIterator<RootPiece[]> {
    return this.roots.values();
  }

  /**
   * this is only here for the ui method.
   *
   * @returns unsolved root nodes
   */
  public GenerateMapOfLeaves(): Map<string, Piece | null> {
    const leaves = new Map<string, Piece | null>();
    for (const array of this.GetValues()) {
      for (const root of array) {
        GenerateMapOfLeavesRecursively(root.piece, '', leaves);
      }
    }
    return leaves;
  }
}
