import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { GenerateMapOfLeavesTracingGoalsRecursively } from './GenerateMapOfLeavesTraccingGoalsRecursively'
import { Piece } from './Piece'
import { GoalStub } from './GoalStub'
import { Solved } from './Solved'

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
export class GoalStubMap {
  private readonly roots: Map<string, GoalStub>

  constructor (cloneIncludingLeaves: GoalStubMap | null) {
    this.roots = new Map<string, GoalStub>()
    if (cloneIncludingLeaves != null) {
      for (const pair of cloneIncludingLeaves.roots) {
        const key = pair[0]
        const goalStub = pair[1]
        this.roots.set(key, goalStub.CloneIncludingLeaves())
      }
    }
  }

  /**
   * this is only here for the ui method.
   * @isOnlyNulls if its only null leaves to be returned
   * @returns unsolved root nodes
   */
  public GenerateMapOfLeavesFromAllRoots (
    isOnlyNulls: boolean
  ): Map<string, Piece> {
    const leaves = new Map<string, Piece>()
    for (const root of this.GetValues()) {
      const piece = root.GetPiece()
      if (piece != null) {
        GenerateMapOfLeavesRecursively(piece, '', isOnlyNulls, leaves)
      }
    }
    return leaves
  }

  public GenerateMapOfLeavesFromWinGoal (): Map<string, Piece> {
    const leaves = new Map<string, Piece>()
    const winGoal = this.GetWinGoalIfAny()
    const piece = winGoal?.GetPiece()
    if (piece != null) {
      GenerateMapOfLeavesTracingGoalsRecursively(
        piece,
        'x_win',
        leaves,
        this
      )
    }
    return leaves
  }

  public GoalStubByName (name: string): GoalStub {
    const root = this.roots.get(name)
    if (typeof root === 'undefined' || root === null) {
      throw new Error(`rootPiece of that name doesn't exist ${name}`)
    }
    return root
  }

  public CalculateListOfKeys (): string[] {
    const array: string[] = []
    for (const key of this.roots.keys()) {
      array.push(key)
    }
    return array
  }

  public Size (): number {
    return this.roots.size
  }

  public GetValues (): IterableIterator<GoalStub> {
    return this.roots.values()
  }

  public CloneAllRootPiecesAndTheirTrees (): GoalStubMap {
    return new GoalStubMap(this)
  }

  public Has (goalToObtain: string): boolean {
    return this.roots.has(goalToObtain)
  }

  public GetGoalStubByNameNoThrow (goal: string): GoalStub | undefined {
    return this.roots.get(goal)
  }

  private GetWinGoalIfAny (): GoalStub | undefined {
    return this.roots.get('x_win')
  }

  AddGoalStub (word: string): void {
    if (!this.roots.has(word)) {
      console.warn(`Merged goal word ${word}`)
      this.roots.set(word, new GoalStub(word, [], Solved.Not))
    } else {
      console.warn(`Already exists: Failed to merge goal ${word}  `)
    }
  }

  public CalculateInitialCounts (): void {
    for (const root of this.GetValues()) {
      if (root != null) {
        root.CalculateOriginalPieceCount()
      }
    }
  }
}
