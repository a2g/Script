import { FormatText } from './FormatText'
import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively'
import { IPileOfPiecesReadOnly } from './IPileOfPiecesReadOnly'
import { Piece } from './Piece'
import { PileOfPieces } from './PileOfPieces'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { RootPiece } from './RootPiece'
import { LeafToRootTraverser } from './LeafToRootTraverser'
import { RootPieceMap } from './RootPieceMap'
import { SolverViaRootPiece } from './SolverViaRootPiece'
import { VisibleThingsMap } from './VisibleThingsMap'
import { IBoxReadOnlyWithFileMethods } from './IBoxReadOnlyWithFileMethods'

/**
 * Solution needs to be cloned.
 */
export class Solution {
  // important ones
  private readonly rootPieces: RootPieceMap
  private readonly rootPieceKeysInSolvingOrder: string[]

  private readonly remainingPiecesRepo: PileOfPieces

  // less important
  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree

  private readonly currentlyVisibleThings: VisibleThingsMap

  private readonly restrictionsEncounteredDuringSolving: Set<string> // yup these are added to

  private readonly solutionNameSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private isArchived: boolean

  private readonly isNotMergingAnyMoreBoxes: boolean

  private lastBranchingPoint: string

  constructor (
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: IPileOfPiecesReadOnly,
    solvingOrderForRootPieceKeys: string[],
    startingThingsPassedIn: VisibleThingsMap,
    isNotMergingAnyMoreBoxes: boolean,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy)
    this.isNotMergingAnyMoreBoxes = isNotMergingAnyMoreBoxes
    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces)
    this.isArchived = false
    this.lastBranchingPoint = ''
    this.rootPieceKeysInSolvingOrder = solvingOrderForRootPieceKeys.slice()

    // starting things AND currentlyVisibleThings
    this.startingThings = new VisibleThingsMap(null)
    this.currentlyVisibleThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.startingThings.Set(item[0], item[1])
        this.currentlyVisibleThings.Set(item[0], item[1])
      }
    }

    // if solutionNameSegments is passed in, we deep copy it
    this.solutionNameSegments = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solutionNameSegments.push(segment)
      }
    }

    // its restrictionsEncounteredDuringSolving is passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction)
      }
    }
  }

  public Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const clonedRootPieceMap =
      this.rootPieces.CloneAllRootPiecesAndTheirTrees()

    // When we clone we generally give everything new ids
    // but

    const clonedSolution = new Solution(
      clonedRootPieceMap,
      this.remainingPiecesRepo,
      this.rootPieceKeysInSolvingOrder,
      this.startingThings,
      this.isNotMergingAnyMoreBoxes,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNameSegments
    )
    return clonedSolution
  }

  public ProcessUntilCloning (solutions: SolverViaRootPiece): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        if (goal.piece.ProcessUntilCloning(this, solutions, '/')) {
          isBreakingDueToSolutionCloning = true
          break
        }
      }
    }

    return isBreakingDueToSolutionCloning
  }

  GetOrderOfCommands (): RawObjectsAndVerb[] {
    const toReturn: RawObjectsAndVerb[] = []
    for (const key of this.rootPieceKeysInSolvingOrder) {
      const rootGoalArray = this.GetRootMap().GetRootPieceArrayByName(key)
      for (const goalPiece of rootGoalArray) {
        const at = toReturn.length
        // const n = goalPiece.commandsCompletedInOrder.length
        toReturn.splice(at, 0, ...goalPiece.commandsCompletedInOrder)
      }
    }
    return toReturn
  }

  public GetDisplayNamesConcatenated (): string {
    let result = ''
    for (let i = 0; i < this.solutionNameSegments.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solutionNameSegments[i])
    }
    return result
  }

  public AddRestrictions (restrictions: string[]): void {
    for (const restriction of restrictions) {
      this.restrictionsEncounteredDuringSolving.add(restriction)
    }
  }

  public GetAccumulatedRestrictions (): Set<string> {
    return this.restrictionsEncounteredDuringSolving
  }

  public GetPile (): PileOfPieces {
    // we already remove pieces from this when we use them up
    // so returning the current piece map is ok
    return this.remainingPiecesRepo
  }

  public SetAsArchived (): void {
    this.isArchived = true
  }

  public IsArchived (): boolean {
    return this.isArchived
  }

  public GetLastDisplayNameSegment (): string {
    return this.solutionNameSegments[this.solutionNameSegments.length - 1]
  }

  public CopyNameToVirginSolution (virginSolution: Solution): void {
    for (const nameSegment of this.solutionNameSegments) {
      virginSolution.PushNameSegment(nameSegment)
    }
  }

  public PushNameSegment (solutionName: string): void {
    this.solutionNameSegments.push(solutionName)
  }

  public ClearNameSegments (): void {
    this.solutionNameSegments.length = 0
  }

  public FindAnyPieceMatchingIdRecursively (id: number): Piece | null {
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        const result = goal.piece.FindAnyPieceMatchingIdRecursively(id)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }

  public GetRootMap (): RootPieceMap {
    return this.rootPieces
  }

  public GetStartingThings (): VisibleThingsMap {
    return this.startingThings
  }

  public MarkGoalsAsContainingNullsAndMergeIfNeeded (): void {
    // go through all the goal pieces
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        // if there are no
        const firstMissingPiece = goal.piece.ReturnTheFirstNullInputHint()
        if (firstMissingPiece === '') {
          // there are no missing pieces - yay!
          if (goal.firstNullInput !== '') {
            goal.firstNullInput = ''
            //
            this.AddCommandsToReachGoalToList(goal)
            if (
              goal.piece.boxToMerge != null &&
              !this.isNotMergingAnyMoreBoxes
            ) {
              this.MergeBox(goal.piece.boxToMerge)
            }
          }
        }
      }
    }
  }

  public MergeBox (boxToMerge: IBoxReadOnlyWithFileMethods): void {
    boxToMerge.CopyPiecesFromBoxToPile(this.GetPile())
    boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }

  public AddCommandsToReachGoalToList (goal: RootPiece): void {
    const piece = goal.piece
    // push the commands
    const leaves = new Map<string, Piece | null>()
    GenerateMapOfLeavesRecursively(piece, '', false, leaves)
    const leafToRootTraverser = new LeafToRootTraverser(
      this.currentlyVisibleThings,
      leaves
    )
    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb =
        leafToRootTraverser.GetNextDoableCommandAndDeconstructTree()
      if (rawObjectsAndVerb == null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb =
          leafToRootTraverser.GetNextDoableCommandAndDeconstructTree()
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
        goal.commandsCompletedInOrder.push(rawObjectsAndVerb)
      }
    }

    // set the goal as visible in the currently visible things
    this.currentlyVisibleThings.Set(piece.output, new Set<string>())

    // then write the goal we just completed
    goal.commandsCompletedInOrder.push(
      new RawObjectsAndVerb(Raw.Goal, `completed (${piece.output})`, '', [], '')
    )

    // also tell the solution what order the goal was reached
    this.rootPieceKeysInSolvingOrder.push(goal.piece.output)

    // Sse if any autos depend on the newly completed goal - if so execute them
    for (const piece of this.remainingPiecesRepo.GetAutos()) {
      if (piece.inputHints.length === 2 && piece.inputHints[0] === goal.piece.output) {
        const command = LeafToRootTraverser.getCommandFromAutoPiece(piece)
        goal.commandsCompletedInOrder.push(command)

        // TODO: Need to now go and hunt through all the goal chains,
        // and find where those auto pieces should be played
        // then play them, update the leafs, adjust the visibility map, 
        // and then remove that piece from the repo
      }
    }
  }

  public AreAnyInputsNull (): boolean {
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        if (goal.firstNullInput.length > 0) {
          return true
        }
      }
    }
    return false
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public GetVisibleThingsAtTheStart (): VisibleThingsMap {
    return this.startingThings
  }

  public GetSize (): number {
    return this.remainingPiecesRepo.Size()
  }

  public setLastBranchingPoint (lastBranchingPoint: string): void {
    this.lastBranchingPoint = lastBranchingPoint
  }

  public getLastBranchingPoint (): string {
    return this.lastBranchingPoint
  }
}
