import { SolverViaRootPiece } from './SolverViaRootPiece.js'
import { Piece } from './Piece.js'
import { PileOfPieces } from './PileOfPieces.js'
import { FormatText } from './FormatText.js'
import { RootPieceMap } from './RootPieceMap.js'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'
import { VisibleThingsMap } from './VisibleThingsMap.js'
import { ReverseTraverser } from './ReverseTraverser.js'
import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively.js'
import { RawObjectsAndVerb } from './RawObjectsAndVerb.js'
import { Raw } from './Raw.js'

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
  private readonly startingThings: Map<string, Set<string>> // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree
  private readonly currentlyVisibleThings: VisibleThingsMap

  private readonly restrictionsEncounteredDuringSolving: Set<string>// yup these are added to
  private readonly solutionNameSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private isArchived: boolean
  private readonly isMergingOk: boolean
  private readonly commandCompletedInOrder: string[]

  constructor (
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: PileOfPiecesReadOnly,
    startingThingsPassedIn: ReadonlyMap<string, Set<string>>,
    isMergingOk: boolean = false,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy)
    this.isMergingOk = isMergingOk
    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces)
    this.isArchived = false
    this.commandCompletedInOrder = []

    this.startingThings = new Map<string, Set<string>>()
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn) {
        this.startingThings.set(item[0], item[1])
      }
    }

    this.currentlyVisibleThings = new VisibleThingsMap(this.startingThings)

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
      this.isMergingOk,
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

  GetStartingThings (): Map<string, Set<string>> {
    return this.startingThings
  }

  MarkGoalsAsContainingNullsAndMergeIfNeeded (): void {
    for (const goal of this.rootPieces.GetValues()) {
      const firstMissingPiece = goal.piece.ReturnTheFirstNullInputHint()
      if (firstMissingPiece === '') { // there are no missing pieces - yay!
        if (goal.firstNullInput !== '') {
          goal.firstNullInput = ''
          //
          this.GenerateCommandsAndAddToMap(goal.piece)
          if (goal.piece.merge != null && this.isMergingOk) {
            goal.piece.merge.CopyPiecesFromBoxToPile(this.GetPile())
            goal.piece.merge.CopyStartingThingCharsToGivenMap(this.startingThings)
          }
        }
      }
    }
  }

  GenerateCommandsAndAddToMap (piece: Piece): void {
    // first the goal
    this.commandCompletedInOrder.push(piece.output)

    // then the commands
    const leaves = new Map<string, Piece | null>()
    GenerateMapOfLeavesRecursively(piece, '', leaves)
    this.currentlyVisibleThings.Set(piece.output, new Set<string>())
    const reverseTraverser = new ReverseTraverser(this.currentlyVisibleThings, leaves)
    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j++) {
      rawObjectsAndVerb = reverseTraverser.GetNextDoableCommandAndDeconstructTree()

      if (rawObjectsAndVerb == null) { // all out of moves!
        break
      }

      /*
      const characters = box.GetArrayOfCharacters()
      for (const character of characters) {
        const startingSet = box.GetStartingThingsForCharacter(character)
        const hasObjectA: boolean = startingSet.has(rawObjectsAndVerb.objectA)
        const hasObjectB: boolean = startingSet.has(rawObjectsAndVerb.objectB)

        if (hasObjectA) { rawObjectsAndVerb.appendStartingCharacterForA(character) }
        if (hasObjectB) { rawObjectsAndVerb.appendStartingCharacterForB(character) }
      } */

      if (rawObjectsAndVerb.type !== Raw.None) {
        // this is just here for debugging!
        this.commandCompletedInOrder.push('    ' + rawObjectsAndVerb.AsDisplayString())
      }

      if (rawObjectsAndVerb.type === Raw.You_have_won_the_game) {
        // this is just here for debugging!
        console.log(reverseTraverser.GetNextDoableCommandAndDeconstructTree())
        break
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

  GetOrderOfGoals (): string[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The following is how to clone in js
    return this.commandCompletedInOrder.map(x => x)
  }

  GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  GetVisibleThingsAtTheStart (): ReadonlyMap<string, Set<string>> {
    return this.startingThings
  }
}
