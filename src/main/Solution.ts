import { SolverViaRootPiece } from './SolverViaRootPiece.js'
import { Piece } from './Piece.js'
import { PileOfPieces } from './PileOfPieces.js'
import { FormatText } from './FormatText.js'
import { RootPieceMap } from './RootPieceMap.js'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'

/**
 * Solution needs to be cloned.
 * Where do you solve your jigsaws? Do you use the dinner table, or
 * do you have a special wooden board, so you can move it off the table when
 * you want to have dinner? That's what this its a dedicated surface for
 * storing the root pieces, which are your targets for adding pieces to,
 * and the pile of pieces you take the pieces from.
 *
 * Unlike your dining table, this SolvingBoard has the ability to clone
 * itself whenever we encounter something that you don't encounter with
 * a tabletop jigsaw:
 * when the knobs (output) of TWO pieces can fit into a given 'hole' (input)'.
 * This really breaks the puzzle solving analogy.
 */
export class Solution {
  // important ones
  private readonly rootPieces: RootPieceMap
  private readonly remainingPiecesRepo: PileOfPieces

  // less important

  private readonly restrictionsEncounteredDuringSolving: Set<string>// yup these are added to
  private readonly solutionNameSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames
  private readonly startingThings: Map<string, Set<string>> // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree

  private isArchived: boolean

  constructor (
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: PileOfPiecesReadOnly,
    startingThingsPassedIn: ReadonlyMap<string, Set<string>>,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy)

    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces)
    this.isArchived = false

    // if it is passed in, we deep copy it
    this.solutionNameSegments = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solutionNameSegments.push(segment)
      }
    }

    // its its passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction)
      }
    }

    this.startingThings = new Map<string, Set<string>>()
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn) {
        this.startingThings.set(item[0], item[1])
      }
    }
  }

  Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const incompletePieces = new Set<Piece>()
    const clonedRootPieceMap =
      this.rootPieces.CloneAllRootPiecesAndTheirTrees(incompletePieces)
    this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN()).piece.id =
      this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN()).piece.id // not sure why do this, but looks crucial!
    const clonedSolution = new Solution(
      clonedRootPieceMap,
      this.remainingPiecesRepo,
      this.startingThings,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNameSegments
    )
    return clonedSolution
  }

  ProcessUntilCloning (solutions: SolverViaRootPiece): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const value of this.rootPieces.GetValues()) {
      if (value.piece.ProcessUntilCloning(this, solutions, '/')) {
        isBreakingDueToSolutionCloning = true
        break
      }
    }

    return isBreakingDueToSolutionCloning
  }

  /**
   * This method is only for debugging. I should remove it completely?
   */
  /*
  GetIncompletePieces (): Set<Piece> {
    return this.incompletePieces
  } */

  GetGoalWin (): Piece {
    return this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN()).piece
  }

  GetFLAG_WIN (): string {
    return 'goal_win'
  }

  GetDisplayNamesConcatenated (): string {
    let result = ''
    for (let i = 0; i < this.solutionNameSegments.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solutionNameSegments[i])
    }
    return result
  }

  AddRestrictions (restrictions: string[]): void {
    for (const restriction of restrictions) {
      this.restrictionsEncounteredDuringSolving.add(restriction)
    }
  }

  GetAccumulatedRestrictions (): Set<string> {
    return this.restrictionsEncounteredDuringSolving
  }

  GetPile (): PileOfPieces {
    // we already remove pieces from this when we use them up
    // so returning the current piece map is ok
    return this.remainingPiecesRepo
  }

  GetMapOfVisibleThings (): ReadonlyMap<string, Set<string>> {
    return this.startingThings
  }

  SetAsArchived (): void {
    this.isArchived = true
  }

  IsArchived (): boolean {
    return this.isArchived
  }

  GetLastDisplayNameSegment (): string {
    return this.solutionNameSegments[this.solutionNameSegments.length - 1]
  }

  CopyNameToVirginSolution (virginSolution: Solution): void {
    for (const nameSegment of this.solutionNameSegments) {
      virginSolution.PushNameSegment(nameSegment)
    }
  }

  PushNameSegment (solutionName: string): void {
    this.solutionNameSegments.push(solutionName)
  }

  FindAnyPieceMatchingIdRecursively (id: number): Piece | null {
    for (const goal of this.rootPieces.GetValues()) {
      const result = goal.piece.FindAnyPieceMatchingIdRecursively(id)
      if (result != null) {
        return result
      }
    }
    return null
  }

  public GetRootMap (): RootPieceMap {
    return this.rootPieces
  }

  GetStartingThings (): ReadonlyMap<string, Set<string>> {
    return this.startingThings
  }

  MarkGoalsAsContainingNullsAndMergeIfNeeded (): void {
    for (const goal of this.rootPieces.GetValues()) {
      goal.firstNullInput = goal.piece.ReturnTheFirstNullInputHint()
      if (goal.firstNullInput === '') {
        if (goal.piece.merge != null) {
          goal.piece.merge.CopyPiecesFromBoxToPile(this.GetPile())
          goal.piece.merge.CopyStartingThingCharsToGivenMap(this.startingThings)
        }
      }
    }
  }

  AreAnyInputsNull (): boolean {
    for (const goal of this.rootPieces.GetValues()) {
      if (goal.firstNullInput.length > 0) {
        return true
      }
    }
    return false
  }
}
