import { FormatText } from './FormatText'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { GoalStub } from './GoalStub'
import { DeconstructDoer } from './DeconstructDoer'
import { GoalStubMap } from './GoalStubMap'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { TalkFile } from './talk/TalkFile'

export class Validator {
  private readonly goalStubs: GoalStubMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly remainingPieces: Map<number, Piece>
  private readonly talks: Map<string, TalkFile>
  private readonly solutionName
  private isSolved: boolean

  public constructor (name: string, starter: Box, goalStubMap: GoalStubMap, startingThingsPassedIn: VisibleThingsMap) {
    this.solutionName = name
    this.goalStubs = new GoalStubMap(goalStubMap)
    this.rootPieceKeysInSolvingOrder = []
    this.remainingPieces = new Map<number, Piece>()
    this.talks = new Map<string, TalkFile>()
    this.isSolved = false
    Box.CopyPiecesFromAtoBViaIds(starter.GetPieces(), this.remainingPieces)
    Box.CopyTalksFromAtoB(starter.GetTalkFiles(), this.talks)

    this.currentlyVisibleThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.currentlyVisibleThings.Set(item[0], item[1])
      }
    }
  }

  public GetName (): string {
    return this.solutionName
  }

  public IsUnsolved (): boolean {
    return !this.isSolved
  }

  public GetRootMap (): GoalStubMap {
    return this.goalStubs
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public UpdateGoalSolvedStatusesAndMergeIfNeeded (): void {
    // go through all the goal pieces
    let areAnyUnsolved = false
    for (const goal of this.goalStubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const firstMissingPiece = (goal.piece != null) ? goal.piece.ReturnTheFirstNullInputHint() : goal.goalWord
      if (firstMissingPiece === '') {
        if (!goal.IsSolved()) {
          goal.SetSolved()
          if (goal.piece?.boxToMerge != null) {
            this.MergeBox(goal.piece.boxToMerge)
          }
        }
      } else {
        areAnyUnsolved = true
      }
    }
    if (!areAnyUnsolved) {
      this.isSolved = true
    }
  }

  public MergeBox (boxToMerge: Box): void {
    console.warn(`Merging box ${boxToMerge.GetFilename()}          going into ${FormatText(this.solutionName)}`)

    Box.CopyPiecesFromAtoBViaIds(boxToMerge.GetPieces(), this.remainingPieces)
    Box.CopyTalksFromAtoB(boxToMerge.GetTalkFiles(), this.talks)
    boxToMerge.CopyGoalStubsToGivenGoalStubMap(this.goalStubs)
    // boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }

  public MatchLeavesAndRemoveFromGoalMap (): void {
    for (const goal of this.goalStubs.GetValues()) {
      this.AddCommandsToReachGoalToList(goal)
    }
  }

  public AddCommandsToReachGoalToList (goalStub: GoalStub): void {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      goalStub,
      this.currentlyVisibleThings,
      this.talks
    )
    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb =
        deconstructDoer.GetNextDoableCommandAndDeconstructTree(this.remainingPieces)
      if (rawObjectsAndVerb == null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb =
          deconstructDoer.GetNextDoableCommandAndDeconstructTree(this.remainingPieces)
        break
      }

      if (rawObjectsAndVerb.type !== Raw.None) {
        // this is just here for debugging!
        goalStub.PushCommand(rawObjectsAndVerb)
      }
    }

    // set the goal as completed in the currently visible things
    this.currentlyVisibleThings.Set(goalStub.goalWord, new Set<string>())

    // then write the goal we just completed
    goalStub.PushCommand(
      new RawObjectsAndVerb(
        Raw.Goal,
        `completed (${goalStub.goalWord})`,
        '',
        goalStub.goalWord,
        [],
        [],
        ''
      )
    )

    // also tell the solution what order the goal was reached
    this.rootPieceKeysInSolvingOrder.push(goalStub.goalWord)

    // Sse if any autos depend on the newly completed goal - if so execute them
    for (const piece of this.GetAutos()) {
      if (
        piece.inputHints.length === 2 &&
        piece.inputHints[0] === goalStub.goalWord
      ) {
        const command = createCommandFromAutoPiece(piece)
        goalStub.PushCommand(command)
      }
    }
  }

  public GetAutos (): Piece[] {
    const toReturn: Piece[] = []
    this.remainingPieces.forEach((piece: Piece) => {
      if (piece.type.startsWith('AUTO')) {
        toReturn.push(piece)
      }
    })
    return toReturn
  }

  public GetOrderOfCommands (): RawObjectsAndVerb[] {
    const toReturn: RawObjectsAndVerb[] = []
    for (const key of this.rootPieceKeysInSolvingOrder) {
      const goalPiece = this.GetRootMap().GoalStubByName(key)
      const at = toReturn.length
      // const n = goalPiece.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...goalPiece.GetCommandsCompletedInOrder())
    }
    return toReturn
  }
}
