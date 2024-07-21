import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { GenerateMapOfLeavesTracingAchievementsRecursively } from './GenerateMapOfLeavesTraccingGoalsRecursively'
import { Piece } from './Piece'
import { AchievementStub } from './AchievementStub'
import { Solved } from './Solved'
import { A_WIN } from '../A_WIN'

/**
 * This started out simpler that PileOfPieces, because there
 * was only ever one piece that outputted a particular achievement.
 * But then - and probably obvious in hindsight - it was changed to handle
 * multiple pieces that can output a achievement, hence a map of arrays.
 * Oh , and a strange difference - this one contains RootPiece
 * rather than piece. RootPiece just wraps a Piece and adds a
 * cached version of 'firstNullInput' <-- why can't we just calculate?
 * yeah, that seems dodgy and subject to bugs.
 * Jan'24 - now that RootPiece has the ordered list of commands, its more
 * justifiable to have the concept of RootPiece.
 *
 */
export class AchievementStubMap {
  private readonly theMap: Map<string, AchievementStub>

  constructor (cloneIncludingLeaves: AchievementStubMap | null) {
    this.theMap = new Map<string, AchievementStub>()
    if (cloneIncludingLeaves != null) {
      for (const pair of cloneIncludingLeaves.theMap) {
        const key = pair[0]
        const achievementStub = pair[1]
        this.theMap.set(key, achievementStub.CloneIncludingLeaves())
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
      const piece = root.GetThePiece()
      if (piece != null) {
        GenerateMapOfLeavesRecursively(piece, '', isOnlyNulls, leaves)
      }
    }
    return leaves
  }

  public GenerateMapOfLeavesFromWinAchievement (): Map<string, Piece> {
    const leaves = new Map<string, Piece>()
    const achievementWords = new Set<string>()
    const winAchievement = this.GetAchievementStubIfAny()
    const piece = winAchievement?.GetThePiece()
    if (piece != null) {
      GenerateMapOfLeavesTracingAchievementsRecursively(
        piece,
        A_WIN,
        leaves,
        achievementWords,
        this
      )
    }
    return leaves
  }

  public AchievementStubByName (name: string): AchievementStub {
    const root = this.theMap.get(name)
    if (typeof root === 'undefined' || root === null) {
      throw new Error(`rootPiece of that name doesn't exist ${name}`)
    }
    return root
  }

  public CalculateListOfKeys (): string[] {
    const array: string[] = []
    for (const key of this.theMap.keys()) {
      array.push(key)
    }
    return array
  }

  public Size (): number {
    return this.theMap.size
  }

  public GetValues (): IterableIterator<AchievementStub> {
    return this.theMap.values()
  }

  public CloneAllRootPiecesAndTheirTrees (): AchievementStubMap {
    return new AchievementStubMap(this)
  }

  public Has (achievementToObtain: string): boolean {
    return this.theMap.has(achievementToObtain)
  }

  public GetAchievementStubByNameNoThrow (achievement: string): AchievementStub | undefined {
    return this.theMap.get(achievement)
  }

  public GetAchievementStubIfAny (): AchievementStub | undefined {
    return this.theMap.get(A_WIN)
  }

  AddAchievementStub (word: string, isNeeded: boolean): void {
    if (!this.theMap.has(word)) {
      console.warn(`Merged achievement word ${word}`)
      const newStub = new AchievementStub(word, [], isNeeded, Solved.Not)
      this.theMap.set(word, newStub)
    } else {
      console.warn(`Already exists: Failed to merge achievement ${word}  `)
    }
  }

  public CalculateInitialCounts (): void {
    for (const root of this.GetValues()) {
      if (root != null) {
        root.CalculateOriginalPieceCount()
      }
    }
  }

  public KeepOnlyGivenAchievementStubs (achievementsToKeep: Set<string>): void {
    for (const key of this.theMap.keys()) {
      if (!achievementsToKeep.has(key)) {
        this.theMap.delete(key)
      }
    }
  }

  IsAchievementPieceNulled (output: string): boolean {
    const stub = this.theMap.get(output)
    if (stub != null) {
      return stub.GetThePiece() == null
    }
    return false
  }
}
