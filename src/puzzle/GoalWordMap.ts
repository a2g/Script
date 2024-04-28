import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { GenerateMapOfLeavesTracingGoalsRecursively } from './GenerateMapOfLeavesTraccingGoalsRecursively'
import { Piece } from './Piece'
import { GoalWord } from './GoalWord'
import { TalkFile } from './talk/TalkFile'
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
export class GoalWordMap {
  private readonly roots: Map<string, GoalWord>

  constructor (cloneIncludingLeaves: GoalWordMap | null) {
    this.roots = new Map<string, GoalWord>()
    if (cloneIncludingLeaves != null) {
      for (const pair of cloneIncludingLeaves.roots) {
        const key = pair[0]
        const goalWord = pair[1]
        this.roots.set(key, goalWord.CloneIncludingLeaves())
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
      if (root.piece != null) {
        GenerateMapOfLeavesRecursively(root.piece, '', isOnlyNulls, leaves)
      }
    }
    return leaves
  }

  public GenerateMapOfLeavesFromWinGoal (): Map<string, Piece> {
    const leaves = new Map<string, Piece>()
    const winGoal = this.GetWinGoalIfAny()
    if (winGoal?.piece != null) {
      GenerateMapOfLeavesTracingGoalsRecursively(
        winGoal.piece,
        'x_win',
        leaves,
        this
      )
    }
    return leaves
  }

  public GoalWordByName (name: string): GoalWord {
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

  public GetValues (): IterableIterator<GoalWord> {
    return this.roots.values()
  }

  public CloneAllRootPiecesAndTheirTrees (): GoalWordMap {
    return new GoalWordMap(this)
  }

  public Has (goalToObtain: string): boolean {
    return this.roots.has(goalToObtain)
  }

  public GetGoalWordByNameNoThrow (goal: string): GoalWord | undefined {
    return this.roots.get(goal)
  }

  private GetWinGoalIfAny (): GoalWord | undefined {
    return this.roots.get('x_win')
  }

  /*
  public RemovePieceById (id: number): void {
    for (const piece of this.roots.values()) {
      if (piece.piece.id === id) {
        this.roots.delete(piece.piece.output)
        return
      }
    }
    throw new Error("Id was not found, and couldn't remove")
  } */

  AddTalkFile (_talkFile: TalkFile): void {

  }

  AddGoalWord (word: string): void {
    if (!this.roots.has(word)) {
      console.warn(`Merged goal word ${word}`)
      this.roots.set(word, new GoalWord(word, [], false))
    } else {
      console.warn(`Already exists: Failed to merge goal ${word}  `)
    }
  }
}
