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
  private readonly remainingPieces: Map<string, Piece>
  private readonly talks: Map<string, TalkFile>
  private readonly solutionName
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor (name: string, startingPieces: Map<string, Set<Piece>>, startingTalkFiles: Map<string, TalkFile>, goalStubMap: GoalStubMap, startingThingsPassedIn: VisibleThingsMap, restrictions: Set<string> | null = null) {
    this.solutionName = name
    this.goalStubs = new GoalStubMap(goalStubMap)
    this.goalStubs.CalculateInitialCounts()
    this.rootPieceKeysInSolvingOrder = []
    this.remainingPieces = new Map<string, Piece>()
    this.talks = new Map<string, TalkFile>()

    Box.CopyPiecesFromAtoBViaIds(startingPieces, this.remainingPieces)
    Box.CopyTalksFromAtoB(startingTalkFiles, this.talks)

    this.currentlyVisibleThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.currentlyVisibleThings.Set(item[0], item[1])
      }
    }

    // its restrictionsEncounteredDuringSolving is passed in we deep copy it
    this.essentialIngredients = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.essentialIngredients.add(restriction)
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

  public DeconstructAllGoalsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const goal of this.goalStubs.GetValues()) {
      if (goal.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenGoalAndRecordSteps(goal)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenGoalAndRecordSteps (goalStub: GoalStub): boolean {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      goalStub,
      this.remainingPieces,
      this.currentlyVisibleThings,
      this.talks,
      this.goalStubs
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
        goalStub.PushCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.type}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this goal - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    if (deconstructDoer.IsZeroPieces()) {
      // then write the goal we just completed
      goalStub.PushCommand(
        new RawObjectsAndVerb(
          Raw.Goal,
          `completed (${goalStub.GetGoalWord()})`,
          '',
          goalStub.GetGoalWord(),
          [],
          [],
          ''
        )
      )

      // also tell the solution what order the goal was reached
      this.rootPieceKeysInSolvingOrder.push(goalStub.GetGoalWord())

      // Sse if any autos depend on the newly completed goal - if so execute them
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === goalStub.GetGoalWord()
        ) {
          const command = createCommandFromAutoPiece(piece)
          goalStub.PushCommand(command)
        }
      }
    }
    return true
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

  public GetCountRecursively (): number {
    let count = 0
    for (const goalWord of this.goalStubs.GetValues()) {
      count += goalWord.GetCountRecursively()
    }
    return count
  }

  public GetNumberOfGoals (): number {
    return this.GetRootMap().Size()
  }

  public GetNumberOfNotYetValidated (): number {
    let numberOfClearedGoals = 0
    for (const rootGoal of this.GetRootMap().GetValues()) {
      numberOfClearedGoals += rootGoal.IsGoalCleared() ? 0 : 1
    }
    return numberOfClearedGoals
  }

  public GetNumberOfRemainingPieces (): number {
    return this.remainingPieces.size
  }

  GetRemainingPiecesAsString (): string {
    let stringOfPieceIds = ''
    for (const piece of this.remainingPieces.values()) {
      stringOfPieceIds += `${piece.id}-${piece.output}, `
    }
    return stringOfPieceIds
  }

  public AddToListOfEssentials (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }
}
