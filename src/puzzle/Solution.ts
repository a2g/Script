import { FormatText } from './FormatText'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { GoalWord } from './GoalWord'
import { DeconstructDoer } from './DeconstructDoer'
import { GoalWordMap } from './GoalWordMap'
import { SolverViaRootPiece } from './SolverViaRootPiece'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { TalkFile } from './talk/TalkFile'
let globalSolutionId = 101
/**
 * Solution needs to be cloned.
 */
export class Solution {
  // important ones
  private readonly goalWords: GoalWordMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  public readonly remainingPieces: Map<string, Set<Piece>>
  public readonly talks: Map<string, TalkFile>

  // less important
  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree

  private readonly currentlyVisibleThings: VisibleThingsMap

  private readonly restrictionsEncounteredDuringSolving: Set<string> // yup these are added to

  private readonly solutionNameSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private readonly performMergeInstructions: boolean

  private readonly id: number

  private constructor (
    id: number,
    goalWordsToCopy: GoalWordMap | null,
    pieces: Map<string, Set<Piece>>,
    talks: Map<string, TalkFile>,
    solvingOrderForRootPieceKeys: string[],
    startingThingsPassedIn: VisibleThingsMap,
    isNotMergingAnyMoreBoxes: boolean,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.id = id
    this.goalWords = new GoalWordMap(goalWordsToCopy)
    this.performMergeInstructions = isNotMergingAnyMoreBoxes
    this.talks = new Map<string, TalkFile>()
    this.remainingPieces = new Map<string, Set<Piece>>()
    this.rootPieceKeysInSolvingOrder = solvingOrderForRootPieceKeys.slice()

    // pieces
    Box.CopyTalksFromAtoB(talks, this.talks)
    Box.CopyPiecesFromAtoB(pieces, this.remainingPieces)

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
      // this.solutionNameSegments.push(`${this.id}`)
    } else {
      this.solutionNameSegments.push(`${this.id}`)
    }

    // its restrictionsEncounteredDuringSolving is passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction)
      }
    }
  }

  public static createSolution (
    goalWords: GoalWordMap | null,
    pieces: Map<string, Set<Piece>>,
    talks: Map<string, TalkFile>,
    solvingOrderForRootPieceKeys: string[],
    startingThingsPassedIn: VisibleThingsMap,
    isNotMergingAnyMoreBoxes: boolean,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ): Solution {
    globalSolutionId++
    return new Solution(globalSolutionId, goalWords, pieces, talks, solvingOrderForRootPieceKeys, startingThingsPassedIn, isNotMergingAnyMoreBoxes, restrictions, nameSegments)
  }

  public Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const clonedRootPieceMap =
      this.goalWords.CloneAllRootPiecesAndTheirTrees()

    // When we clone we generally give everything new ids
    // but

    const clonedSolution = Solution.createSolution(
      clonedRootPieceMap,
      this.remainingPieces,
      this.talks,
      this.rootPieceKeysInSolvingOrder,
      this.startingThings,
      this.performMergeInstructions,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNameSegments
    )

    return clonedSolution
  }

  public ProcessUntilCloning (solutions: SolverViaRootPiece): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const goalWord of this.goalWords.GetValues()) {
      if (!goalWord.IsSolved()) {
        if (goalWord.ProcessUntilCloning(this, solutions, '/')) {
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
      const goalPiece = this.GetRootMap().GoalWordByName(key)
      const at = toReturn.length
      // const n = goalPiece.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...goalPiece.GetCommandsCompletedInOrder())
    }
    return toReturn
  }

  public GetDisplayNamesConcatenated (): string {
    let result = 'sol_'
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

  public PushDisplayNameSegment (solutionName: string): void {
    this.solutionNameSegments.push(solutionName)
  }

  public FindAnyPieceMatchingIdRecursively (id: number): Piece | null {
    for (const goal of this.goalWords.GetValues()) {
      if (goal.piece != null) {
        const result = goal.piece.FindAnyPieceMatchingIdRecursively(id)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }

  public GetRootMap (): GoalWordMap {
    return this.goalWords
  }

  public GetStartingThings (): VisibleThingsMap {
    return this.startingThings
  }

  public MarkGoalsAsContainingNullsAndMergeIfNeeded (): void {
    // go through all the goal pieces
    for (const goal of this.goalWords.GetValues()) {
      // if there are no places to attach pieces it will return null
      const firstMissingPiece = (goal.piece != null) ? goal.piece.ReturnTheFirstNullInputHint() : goal.goalHint
      if (firstMissingPiece === '') {
        if (!goal.IsSolved()) {
          goal.SetSolved()
          // we do this before merging boxes, because it
          // has a step where it goes through all the boxes
          // yet to be merged - and modifies them!
          this.AddCommandsToReachGoalToList(goal)
          if (goal.piece?.boxToMerge != null &&
            this.performMergeInstructions
          ) {
            this.MergeBox(goal.piece.boxToMerge)
          }
        }
      }
    }
  }

  public MergeBox (boxToMerge: Box): void {
    console.warn(`Merging box ${boxToMerge.GetFilename()}          going into ${FormatText(this.GetDisplayNamesConcatenated())}`)

    Box.CopyPiecesFromAtoB(boxToMerge.piecesMappedByOutput, this.remainingPieces)
    Box.CopyTalksFromAtoB(boxToMerge.GetTalks(), this.talks)
    boxToMerge.CopyGoalWordsToGivenGoalWordMap(this.goalWords)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }

  /**
   * #### So by this stage, the root hs been entirely filled out
   *
   * #### Version
   * since: V1.0.0
   * #### Example
   *
   * #### Links
   *
   *
   * Adds commands to reach goal to list
   * @param goalStruct
   */
  public AddCommandsToReachGoalToList (goalStruct: GoalWord): void {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      goalStruct,
      this.currentlyVisibleThings,
      this.GetTalks()
    )
    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb =
        deconstructDoer.GetNextDoableCommandAndDeconstructTree()
      if (rawObjectsAndVerb == null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb =
          deconstructDoer.GetNextDoableCommandAndDeconstructTree()
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
        goalStruct.PushCommand(rawObjectsAndVerb)
      }
    }

    // set the goal as completed in the currently visible things
    this.currentlyVisibleThings.Set(goalStruct.goalHint, new Set<string>())

    // then write the goal we just completed
    goalStruct.PushCommand(
      new RawObjectsAndVerb(
        Raw.Goal,
        `completed (${goalStruct.goalHint})`,
        '',
        goalStruct.goalHint,
        [],
        [],
        ''
      )
    )

    // also tell the solution what order the goal was reached
    this.rootPieceKeysInSolvingOrder.push(goalStruct.goalHint)

    // Sse if any autos depend on the newly completed goal - if so execute them
    for (const piece of this.GetAutos()) {
      if (
        piece.inputHints.length === 2 &&
        piece.inputHints[0] === goalStruct.goalHint
      ) {
        const command = createCommandFromAutoPiece(piece)
        goalStruct.PushCommand(command)
      }
    }
  }

  public IsUnsolved (): boolean {
    for (const goal of this.goalWords.GetValues()) {
      if (!goal.IsSolved()) {
        return true
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
    return this.remainingPieces.size
  }

  public GetTalks (): Map<string, TalkFile> {
    return this.talks
  }

  public GetAutos (): Piece[] {
    const toReturn: Piece[] = []
    this.remainingPieces.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (piece.type.startsWith('AUTO')) {
          toReturn.push(piece)
        }
      })
    })
    return toReturn
  }

  public GetPiecesThatOutputString (objectToObtain: string): Set<Piece> {
    // since the remainingPieces are a map index by output piece
    // then a remainingPieces.Get will retrieve all matching pieces.
    // BUT...
    // we want it to return a random empty set if not found
    // and for now, it seems like it was changed to a slow
    // iteration through the map to match - possibly for debugging.
    for (const pair of this.remainingPieces) {
      if (pair[0] === objectToObtain) {
        return pair[1]
      }
    }
    return new Set<Piece>()
  }

  public RemovePiece (piece: Piece): void {
    if (piece.reuseCount - 1 <= 0) {
      const key = piece.output
      if (this.remainingPieces.has(key)) {
        const oldSet = this.remainingPieces.get(key)
        if (oldSet != null) {
          // console.warn(" old size = "+oldSet.size);
          oldSet.delete(piece)
          // console.warn(" newSize = "+oldSet.size);
        }
      } else {
        piece.SetCount(piece.reuseCount - 1)
        console.warn(`trans.count is now ${piece.reuseCount}`)
      }
    }
  }
}
