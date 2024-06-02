import { FormatText } from './FormatText'
import { Piece } from './Piece'

import { GoalStubMap } from './GoalStubMap'
import { Solutions } from './Solutions'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { TalkFile } from './talk/TalkFile'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { Solved } from './Solved'

let globalSolutionId = 101
/**
 * Solution needs to be cloned.
 */
export class Solution {
  // important ones
  private readonly goalStubs: GoalStubMap
  private readonly remainingPieces: Map<string, Set<Piece>>
  private readonly talks: Map<string, TalkFile>

  // less important

  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree
  private readonly essentialIngredients: Set<string> // yup these are added to
  private readonly solvingPathSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private readonly id: number

  private constructor (
    id: number,
    pieces: Map<string, Set<Piece>>,
    talks: Map<string, TalkFile>,
    startingThingsPassedIn: VisibleThingsMap,
    goalStubsToCopy: GoalStubMap | null,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.id = id
    this.goalStubs = new GoalStubMap(goalStubsToCopy)
    this.talks = new Map<string, TalkFile>()
    this.remainingPieces = new Map<string, Set<Piece>>()

    // pieces
    Box.CopyTalksFromAtoB(talks, this.talks)
    Box.CopyPiecesFromAtoB(pieces, this.remainingPieces)

    // starting things AND currentlyVisibleThings
    this.startingThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.startingThings.Set(item[0], item[1])
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
    goalStubs: GoalStubMap | null,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ): Solution {
    globalSolutionId++
    return new Solution(globalSolutionId, pieces, talks, startingThingsPassedIn, goalStubs, restrictions, nameSegments)
  }

  public Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const clonedRootPieceMap =
      this.goalStubs.CloneAllRootPiecesAndTheirTrees()

    // When we clone we generally give everything new ids
    // but

    const clonedSolution = Solution.createSolution(
      this.remainingPieces,
      this.talks,
      this.startingThings,
      clonedRootPieceMap,
      this.essentialIngredients,
      this.solvingPathSegments
    )

    return clonedSolution
  }

  public ProcessUntilCloning (solutions: Solutions): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const goalStub of this.goalStubs.GetValues()) {
      if (!goalStub.IsSolved()) {
        if (goalStub.ProcessUntilCloning(this, solutions, '/')) {
          isBreakingDueToSolutionCloning = true
          break
        }
      }
    }

    return isBreakingDueToSolutionCloning
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
    for (const goalStub of this.goalStubs.GetValues()) {
      const piece = goalStub.GetPiece()
      if (piece != null) {
        const result = piece.FindAnyPieceMatchingIdRecursively(id)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }

  public GetGoalStubMap (): GoalStubMap {
    return this.goalStubs
  }

  public GetStartingThings (): VisibleThingsMap {
    return this.startingThings
  }

  public UpdateGoalSolvedStatuses (): void {
    // go through all the goal pieces
    for (const goalStub of this.goalStubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const piece = goalStub.GetPiece()
      const firstMissingPiece = (piece != null) ? piece.ReturnTheFirstNullInputHint() : goalStub.GetGoalWord()
      if (firstMissingPiece === '') {
        if (!goalStub.IsSolved()) {
          goalStub.SetSolved(Solved.Solved)
        }
      }
    }
  }

  public IsUnsolved (): boolean {
    for (const goal of this.goalStubs.GetValues()) {
      if (!goal.IsSolved()) {
        return true
      }
    }
    return false
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

  public GetOrderOfCommands (): RawObjectsAndVerb[] {
    throw new Error('this is moved to Solution2')
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
