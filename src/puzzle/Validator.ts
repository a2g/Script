import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { AchievementStub } from './AchievementStub'
import { DeconstructDoer } from './DeconstructDoer'
import { AchievementStubMap } from './AchievementStubMap'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { ChatFile } from './talk/ChatFile'
import { Validated } from './Validated'

export class Validator {
  private readonly achievementStubs: AchievementStubMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly remainingPieces: Map<string, Piece>
  private readonly chats: Map<string, ChatFile>
  private readonly solutionName
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor (name: string, startingPieces: Map<string, Set<Piece>>, startingChatFiles: Map<string, ChatFile>, stubMap: AchievementStubMap, startingThingsPassedIn: VisibleThingsMap, restrictions: Set<string> | null = null) {
    this.solutionName = name
    this.achievementStubs = new AchievementStubMap(stubMap)
    this.achievementStubs.CalculateInitialCounts()
    this.rootPieceKeysInSolvingOrder = []
    this.remainingPieces = new Map<string, Piece>()
    this.chats = new Map<string, ChatFile>()

    Box.CopyPiecesFromAtoBViaIds(startingPieces, this.remainingPieces)
    Box.CopyChatsFromAtoB(startingChatFiles, this.chats)

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

  public GetRootMap (): AchievementStubMap {
    return this.achievementStubs
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }
  /*
  public UpdateAchievementSolvedStatusesAndMergeIfNeeded (): void {
    // go through all the achievement pieces
    let areAnyUnsolved = false
    for (const achievement of this.achievementStubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const firstMissingPiece = (achievement.piece != null) ? achievement.piece.ReturnTheFirstNullInputHint() : achievement.achievementWord
      if (firstMissingPiece === '') {
        if (!achievement.IsZeroPieces()) {
          achievement.SetValidated(Validated.Validated)
          if (achievement.piece?.boxToMerge != null) {
            this.MergeBox(achievement.piece.boxToMerge)
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

  public DeconstructAllAchievementsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const stub of this.achievementStubs.GetValues()) {
      if (stub.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenStubAndRecordSteps(stub)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenStubAndRecordSteps (stub: AchievementStub): boolean {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      stub,
      this.remainingPieces,
      this.currentlyVisibleThings,
      this.chats,
      this.achievementStubs
    )

    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb =
        deconstructDoer.GetNextDoableCommandAndDeconstructTree()
      if (rawObjectsAndVerb === null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb =
          deconstructDoer.GetNextDoableCommandAndDeconstructTree()
        break
      }

      if (rawObjectsAndVerb.type !== Raw.None) {
        // this is just here for debugging!
        stub.AddCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.type}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this piece tree - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    if (deconstructDoer.IsZeroPieces()) {
      // then write the achievement we just achieved
      stub.AddCommand(
        new RawObjectsAndVerb(
          Raw.Achievement,
          `completed (${stub.GetTheAchievementWord()})`,
          '',
          stub.GetTheAchievementWord(),
          [],
          [],
          ''
        )
      )

      // also tell the solution what order the achievement was achieved
      this.rootPieceKeysInSolvingOrder.push(stub.GetTheAchievementWord())

      // Sse if any autos depend on the newly completed achievement - if so execute them
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === stub.GetTheAchievementWord()
        ) {
          const command = createCommandFromAutoPiece(piece)
          stub.AddCommand(command)
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
      const stub = this.GetRootMap().AchievementStubByName(key)
      const at = toReturn.length
      // const n = stub.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...stub.GetOrderedCommands())
    }
    return toReturn
  }

  public GetCountRecursively (): number {
    let count = 0
    for (const stub of this.achievementStubs.GetValues()) {
      count += stub.GetCountRecursively()
    }
    return count
  }

  public GetNumberOfAchievements (): number {
    return this.GetRootMap().Size()
  }

  public GetNumberOfNotYetValidated (): number {
    let numberOfNullAchievements = 0
    for (const achievement of this.GetRootMap().GetValues()) {
      numberOfNullAchievements += achievement.GetThePiece() == null ? 0 : 1
    }
    return numberOfNullAchievements
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
