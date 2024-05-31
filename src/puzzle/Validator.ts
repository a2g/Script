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
import { Validated } from './Validated'

export class Validator {
  private readonly goalStubs: GoalStubMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly remainingPieces: Map<number, Piece>
  private readonly talks: Map<string, TalkFile>
  private readonly solutionName

  public constructor (name: string, starter: Box, goalStubMap: GoalStubMap, startingThingsPassedIn: VisibleThingsMap) {
    this.solutionName = name
    this.goalStubs = new GoalStubMap(goalStubMap)
    this.rootPieceKeysInSolvingOrder = []
    this.remainingPieces = new Map<number, Piece>()
    this.talks = new Map<string, TalkFile>()
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

  public GetRootMap (): GoalStubMap {
    return this.goalStubs
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }
  /*
  public UpdateGoalSolvedStatusesAndMergeIfNeeded (): void {
    // go through all the goal pieces
    let areAnyUnsolved = false
    for (const goal of this.goalStubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const firstMissingPiece = (goal.piece != null) ? goal.piece.ReturnTheFirstNullInputHint() : goal.goalWord
      if (firstMissingPiece === '') {
        if (!goal.IsZeroPieces()) {
          goal.SetValidated(Validated.Validated)
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
  } */

  public MergeBox (boxToMerge: Box): void {
    console.warn(`Merging box ${boxToMerge.GetFilename()}          going into ${FormatText(this.solutionName)}`)

    Box.CopyPiecesFromAtoBViaIds(boxToMerge.GetPieces(), this.remainingPieces)
    Box.CopyTalksFromAtoB(boxToMerge.GetTalkFiles(), this.talks)
    boxToMerge.CopyGoalStubsToGivenGoalStubMap(this.goalStubs)
    // boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }

  public DeconstructGoalsAndRecordSteps (): void {
    for (const goal of this.goalStubs.GetValues()) {
      if (goal.GetValidated() === Validated.Undecided) {
        this.DeconstructSingleGoalAndRecordSteps(goal)
      }
    }
  }

  public DeconstructSingleGoalAndRecordSteps (goalStub: GoalStub): void {
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

    // So we have no more pieces in this goal - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    if (deconstructDoer.IsZeroPieces()) {
      goalStub.SetValidated(Validated.Validated)

      // merge if needed
      if (goalStub.piece?.boxToMerge != null) {
        this.MergeBox(goalStub.piece.boxToMerge)
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
