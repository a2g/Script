import { FormatText } from './FormatText'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { GoalWord } from './GoalWord'
import { DeconstructDoer } from './DeconstructDoer'
import { GoalWordMap } from './GoalWordMap'
import { SolutionCollection } from './SolutionCollection'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { TalkFile } from './talk/TalkFile'
import { Job } from './Job'
let globalSolutionId = 101
/**
 * Solution needs to be cloned.
 */
export class Solution {
  // important ones
  private readonly goalWords: GoalWordMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  private readonly remainingPieces: Map<string, Set<Piece>>
  private readonly talks: Map<string, TalkFile>
  private readonly setOfDoubles: Set<string>

  // less important
  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly essentialIngredients: Set<string> // yup these are added to
  private readonly solvingPathSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames
  private readonly performMergeInstructions: boolean
  private readonly id: number

  private constructor (
    id: number,
    pieces: Map<string, Set<Piece>>,
    talks: Map<string, TalkFile>,
    startingThingsPassedIn: VisibleThingsMap,
    goalWordsToCopy: GoalWordMap | null,
    setOfDoublesForMerging: Set<string>|null,
    solvingOrderForRootPieceKeys: string[],
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.id = id
    this.goalWords = new GoalWordMap(goalWordsToCopy)
    this.performMergeInstructions = !(setOfDoublesForMerging == null)
    this.setOfDoubles = new Set<string>()
    setOfDoublesForMerging?.forEach(x => { this.setOfDoubles.add(x) })
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
    this.solvingPathSegments = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solvingPathSegments.push(segment)
      }
      // this.solutionNameSegments.push(`${this.id}`)
    } else {
      this.solvingPathSegments.push(`${this.id}`)
    }

    // its restrictionsEncounteredDuringSolving is passed in we deep copy it
    this.essentialIngredients = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.essentialIngredients.add(restriction)
      }
    }
  }

  public static createSolution (
    pieces: Map<string, Set<Piece>>,
    talks: Map<string, TalkFile>,
    startingThingsPassedIn: VisibleThingsMap,
    goalWords: GoalWordMap | null,
    setOfDoublesForMerging: Set<string>|null,
    solvingOrderForRootPieceKeys: string[]|null = null,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ): Solution {
    globalSolutionId++
    const solvingOrder = (solvingOrderForRootPieceKeys != null) ? solvingOrderForRootPieceKeys : []
    return new Solution(globalSolutionId, pieces, talks, startingThingsPassedIn, goalWords, setOfDoublesForMerging, solvingOrder, restrictions, nameSegments)
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
      this.remainingPieces,
      this.talks,
      this.startingThings,
      clonedRootPieceMap,
      this.setOfDoubles,
      this.rootPieceKeysInSolvingOrder,
      this.essentialIngredients,
      this.solvingPathSegments
    )

    return clonedSolution
  }

  public ProcessUntilCloning (solutions: SolutionCollection): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const goalWord of this.goalWords.GetValues()) {
      if (!goalWord.IsSolved()) {
        if (goalWord.ProcessPiecesAndReturnWhetherAnyPlaced(this, solutions, '/', Job.Cloning)) {
          isBreakingDueToSolutionCloning = true
          break
        }
      }
    }

    return isBreakingDueToSolutionCloning
  }

  IterateOverGoalMapWhilstSkippingCloningUntilExhausted (solutions: SolutionCollection): void {
    for (; ;) {
      let wasAnyPiecesPlaced = false
      for (const goalWord of this.goalWords.GetValues()) {
        if (!goalWord.IsSolved()) {
          if (goalWord.ProcessPiecesAndReturnWhetherAnyPlaced(this, solutions, '/', Job.PiecePlacing)) {
            wasAnyPiecesPlaced = true
          }
        }
      }

      const wasAnyBoxesMerged = this.MarkGoalsAsCompletedAndReturnWhetherBoxesWereMerged()
      if (!wasAnyBoxesMerged && !wasAnyPiecesPlaced) {
        return
      }
    }
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

  public GetSolvingPath (): string {
    let result = 'sol_'
    for (let i = 0; i < this.solvingPathSegments.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solvingPathSegments[i])
    }
    return result
  }

  public AddToListOfEssentials (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }

  public GetEssentialIngredients (): Set<string> {
    return this.essentialIngredients
  }

  public PushSolvingPathSegment (solutionName: string): void {
    this.solvingPathSegments.push(solutionName)
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

  public MarkGoalsAsCompletedAndReturnWhetherBoxesWereMerged (): boolean {
    // go through all the goal pieces
    let wereAnyBoxesMerged = false
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
            wereAnyBoxesMerged = true
          }
        }
      }
    }
    return wereAnyBoxesMerged
  }

  public MergeBox (boxToMerge: Box): void {
    console.warn(`Merging box ${boxToMerge.GetFilename()}          going into ${FormatText(this.GetSolvingPath())}`)

    Box.CopyPiecesFromAtoB(boxToMerge.GetPieces(), this.remainingPieces)
    Box.CopyTalksFromAtoB(boxToMerge.GetTalkFiles(), this.talks)
    boxToMerge.CopyGoalWordsToGivenGoalWordMap(this.goalWords)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }

  /**
   * #### So by this stage, the root hs been entirely filled out
   * Adds commands to reach goal to list
   * @param goalStruct
   */
  public AddCommandsToReachGoalToList (goalStruct: GoalWord): void {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      goalStruct,
      this.currentlyVisibleThings,
      this.GetTalkFiles()
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

  public GetNumberOfPiecesRemaining (): number {
    return this.remainingPieces.size
  }

  public GetTalkFiles (): Map<string, TalkFile> {
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
