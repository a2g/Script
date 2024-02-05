import { existsSync } from 'fs'
import { Box } from './Box'
import { Dialog } from './dialog/Dialog'
import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { GenerateMapOfLeavesTracingGoalsRecursively } from './GenerateMapOfLeavesTraccingGoalsRecursively'
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap'
import { Piece } from './Piece'
import { RootPiece } from './RootPiece'
/**
 * This started out simpler that PileOfPieces, because there
 * was only ever one piece that outputted a particular goal.
 * But then - and probably obvious in hindsight - it was changed to handle
 * multiple pieces that can output a goal, hence a map of arrays.
 * Oh , and a strange difference - this one contains RootPiece
 * rather than piece. RootPiece just wraps a Piece and adds a
 * cached version of 'firstNullInput' <-- why can't we just calculate?
 * yeah, that seems dodgy and subject to bugs.
 * Jan'24 - now that RootPiece has the ordered list of commands, its more
 * justifiable to have the concept of RootPiece.
 *
 */
export class RootPieceMap implements IPileOrRootPieceMap {
  private readonly roots: Map<string, RootPiece[]>

  constructor(deepCopyFromMe: RootPieceMap | null) {
    this.roots = new Map<string, RootPiece[]>()
    if (deepCopyFromMe != null) {
      for (const pair of deepCopyFromMe.roots) {
        const key = pair[0]
        const value = pair[1]
        const array = new Array<RootPiece>()
        this.roots.set(key, [])
        for (const rootPiece of value) {
          const clonedTree: Piece = rootPiece.piece.ClonePieceAndEntireTree()
          array.push(new RootPiece(clonedTree, rootPiece.GetCommandsCompletedInOrder(), rootPiece.IsSolved()))
        }
        this.roots.set(key, array)
      }
    }
  }

  public AddPiece(piece: Piece, folder = '', isNoFile = true): void {
    if (piece.type.startsWith('AUTO_GOAL1_MET') ||
      piece.type.startsWith('GOAL1_MET')) {
      const goal1 = piece.output
      if (goal1 !== 'x-win' && !isNoFile) {
        const file = `${goal1}.jsonc`
        if (!existsSync(folder + file)) {
          throw new Error(
            `Ensure "isNoFile" needs to be marked for goal ${goal1} of ${piece.type} in ${goal1}, because the following file doesn't exist ${folder}`
          )
        }
        piece.boxToMerge = new Box(folder, file)
      }

      // initialize array, if it hasn't yet been
      if (this.roots.get(piece.output) == null) {
        this.roots.set(piece.output, new Array<RootPiece>())
      }
      // always add to list
      this.roots.get(piece.output)?.push(new RootPiece(piece, []))
    }
  }

  /**
   * this is only here for the ui method.
   * @isOnlyNulls if its only null leaves to be returned
   * @returns unsolved root nodes
   */
  public GenerateMapOfLeavesFromAllRoots(
    isOnlyNulls: boolean
  ): Map<string, Piece> {
    const leaves = new Map<string, Piece>()
    for (const array of this.GetValues()) {
      for (const root of array) {
        GenerateMapOfLeavesRecursively(root.piece, '', isOnlyNulls, leaves)
      }
    }
    return leaves
  }

  public GenerateMapOfLeavesFromWinGoal(): Map<string, Piece> {
    const allWinGaols = this.GetAllWinGoals()
    const leaves = new Map<string, Piece>()
    if (allWinGaols?.length === 1) {
      const winGoal = allWinGaols[0]
      GenerateMapOfLeavesTracingGoalsRecursively(
        winGoal.piece,
        'x-win',
        leaves,
        this
      )
    }
    return leaves
  }

  public GetRootPieceArrayByName(name: string): RootPiece[] {
    const root = this.roots.get(name)
    if (typeof root === 'undefined' || root === null) {
      throw new Error(`rootPiece of that name doesn't exist ${name}`)
    }
    return root
  }

  public RemoveAllWithName(name: string): void {
    this.roots.delete(name)
  }

  public CalculateListOfKeys(): string[] {
    const array: string[] = []
    for (const key of this.roots.keys()) {
      array.push(key)
    }
    return array
  }

  public Size(): number {
    return this.roots.size
  }

  public GetValues(): IterableIterator<RootPiece[]> {
    return this.roots.values()
  }

  public CloneAllRootPiecesAndTheirTrees(): RootPieceMap {
    return new RootPieceMap(this)
  }

  public Has(goalToObtain: string): boolean {
    return this.roots.has(goalToObtain)
  }

  public GetRootPieceArrayByNameNoThrow(goal: string): RootPiece[] | undefined {
    return this.roots.get(goal)
  }

  public GetAllWinGoals(): RootPiece[] | undefined {
    return this.roots.get('x-win')
  }

  public RemoveAllWinGoals(): void {
    this.roots.delete('x-win')
  }

  public RemovePieceById(id: number): void {
    for (const array of this.roots.values()) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].piece.id === id) {
          array.splice(i, 1)
          return
        }
      }
    }
    throw new Error("Id was not found, and couldn't remove")
  }

  public AddDialog(dialog: Dialog) {
    //do nothing
  }
}
