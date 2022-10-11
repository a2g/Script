import { existsSync } from 'fs'
import { SolverViaRootPiece } from './SolverViaRootPiece.js'
import { Piece } from './Piece.js'
import { SpecialTypes } from './SpecialTypes.js'
import { PileOfPieces } from './PileOfPieces.js'
import { ReadOnlyJsonSingle } from '../main/ReadOnlyJsonSingle.js'
import { FormatText } from '../main/FormatText.js'
import { RootPieceMap } from './RootPieceMap.js'
import _ from '../../jigsaw.json'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'

/**
 * Solution needs to be cloned.
 */
export class Solution {
  // non aggregates
  private readonly solutionNames: string[]

  rootPieces: RootPieceMap

  remainingPiecesRepo: PileOfPieces

  isArchived: boolean

  // aggregates
  unprocessedLeaves: Set<Piece>

  startingThings: ReadonlyMap<string, Set<string>> // this is updated dynamically in GetNextDoableCommandAndDesconstructTree

  readonly restrictionsEncounteredDuringSolving: Set<string>

  constructor (
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: PileOfPiecesReadOnly,
    startingThingsPassedIn: ReadonlyMap<string, Set<string>>,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.unprocessedLeaves = new Set<Piece>()
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy, this.unprocessedLeaves)

    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces)
    this.isArchived = false

    // if it is passed in, we deep copy it
    this.solutionNames = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solutionNames.push(segment)
      }
    }

    // its its passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction)
      }
    }

    // this is readonly so we don't copy it
    this.startingThings = startingThingsPassedIn
  }

  public AddRootPiece (rootPiece: Piece): void {
    this.rootPieces.AddRootPiece(rootPiece)
    this.unprocessedLeaves.add(rootPiece)
  }

  FindTheFlagWinAndPutItInRootPieceMap (): void {
    const flagWinSet = this.remainingPiecesRepo.Get('flag_win')
    if (flagWinSet === undefined) {
      throw new Error('flag_win was undefined')
    }
    if (flagWinSet.size !== 1) {
      throw new Error('flag_win was not equal to 1')
    }
    for (const flagWin of flagWinSet) {
      this.AddRootPiece(flagWin)
    }
  }

  Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const incompletePieces = new Set<Piece>()
    const clonedRootPieceMap =
      this.rootPieces.CloneAllRootPiecesAndTheirTrees(incompletePieces)
    this.rootPieces.GetRootPieceByName('flag_win').id =
      this.rootPieces.GetRootPieceByName('flag_win').id // not sure why do this, but looks crucial!
    const clonedSolution = new Solution(
      clonedRootPieceMap,
      this.remainingPiecesRepo,
      this.startingThings,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNames
    )
    clonedSolution.SetIncompletePieces(incompletePieces)
    return clonedSolution
  }

  SetPieceIncomplete (piece: Piece | null): void {
    if (piece != null) {
      if (piece.type !== SpecialTypes.VerifiedLeaf) {
        this.unprocessedLeaves.add(piece)
      }
    }
  }

  MarkPieceAsCompleted (piece: Piece | null): void {
    if (piece != null) {
      if (this.unprocessedLeaves.has(piece)) {
        this.unprocessedLeaves.delete(piece)
      }
    }
  }

  SetIncompletePieces (set: Set<Piece>): void {
    // safer to copy this - just being cautious
    this.unprocessedLeaves = new Set<Piece>()
    for (const piece of set) {
      this.unprocessedLeaves.add(piece)
    }
  }

  IsAnyPiecesUnprocessed (): boolean {
    return this.unprocessedLeaves.size > 0
  }

  ProcessUntilCloning (solutions: SolverViaRootPiece): boolean {
    let isBreakingDueToSolutionCloning = false
    let max = this.rootPieces.Size()
    for (let i = 0; i < max; i += 1) {
      const goal = this.rootPieces.GetAt(i)
      if (goal.ProcessUntilCloning(this, solutions, '/')) {
        isBreakingDueToSolutionCloning = true
        break
      }
      max = this.rootPieces.Size()
    }

    if (!isBreakingDueToSolutionCloning) {
      // then this means the root piece has rolled to completion
      this.unprocessedLeaves.clear()
    }
    return isBreakingDueToSolutionCloning
  }

  GetUnprocessedLeaves (): Set<Piece> {
    return this.unprocessedLeaves
  }

  GetFlagWin (): Piece {
    return this.rootPieces.GetRootPieceByName('flag_win')
  }

  HasAnyPiecesThatOutputObject (objectToObtain: string): boolean {
    return this.remainingPiecesRepo.Has(objectToObtain)
  }

  GetPiecesThatOutputObject (objectToObtain: string): Piece[] | undefined {
    // since the remainingPieces are a map index by output piece
    // then a remainingPieces.Get will retrieve all matching pieces.
    const result: Set<Piece> | undefined =
      this.remainingPiecesRepo.Get(objectToObtain)
    if (result != null) {
      const blah: Piece[] = []
      for (const item of result) {
        if (item.count >= 1) {
          const twin = item.conjoint

          // I see what I've done here.
          // In the case of conjoint then there would be two items
          //  returned that are actually joined.
          // in this case, we HACK it to return only one. This needs to change.
          // TODO: fix the above
          if (twin === 0) {
            blah.push(item)
          } else if (this.remainingPiecesRepo.ContainsId(twin)) {
            blah.push(item)
          }
        }
      }
      return blah
    }
    return []
  }

  RemovePiece (piece: Piece): void {
    this.remainingPiecesRepo.RemovePiece(piece)
  }

  PushNameSegment (solutionName: string): void {
    this.solutionNames.push(solutionName)
  }

  GetDisplayNamesConcatenated (): string {
    let result = ''
    for (let i = 0; i < this.solutionNames.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solutionNames[i])
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

  GetRepoOfRemainingPieces (): PileOfPieces {
    // we already remove pieces from this when we use them up
    // so returning the current piece map is ok
    return this.remainingPiecesRepo
  }

  MergeInPiecesForChapterCompletion (goalFlag: string): void {
    const autos = this.remainingPiecesRepo.GetAutos()
    for (const piece of autos) {
      // find the auto that imports json
      if (piece.inputHints[0] === goalFlag) {
        if (piece.type === _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON) {
          if (existsSync(piece.output)) {
            const json = new ReadOnlyJsonSingle(piece.output)
            this.remainingPiecesRepo.MergeInPiecesFromScene(json)
          }
        }
      }
    }
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
    return this.solutionNames[this.solutionNames.length - 1]
  }

  CopyNameToVirginSolution (virginSolution: Solution): void {
    for (const nameSegment of this.solutionNames) {
      virginSolution.PushNameSegment(nameSegment)
    }
  }

  FindPieceWithSomeInputForConjointToAttachTo (
    theConjoint: Piece | null
  ): Piece | null {
    for (const rootPiece of this.rootPieces.GetValues()) {
      const piece = this.FindFirstAttachmentLeafForConjointRecursively(
        theConjoint,
        rootPiece
      )
      if (piece !== null) {
        return piece
      }
    }
    return null
  }

  FindFirstAttachmentLeafForConjointRecursively (
    theConjoint: Piece | null,
    pieceToSearch: Piece | null
  ): Piece | null {
    // isn't kept up to date, so we traverse, depth first.
    if (theConjoint != null && pieceToSearch != null) {
      for (let i = 0; i < pieceToSearch.inputs.length; i += 1) {
        // if its non null, then we can't attach the conjoint there...but we can recurse
        if (pieceToSearch.inputs[i] != null) {
          // check if we can attach the conjoint there
          if (pieceToSearch.inputHints[i] === theConjoint.output) {
            return pieceToSearch
          }
          // else search inside
          return this.FindFirstAttachmentLeafForConjointRecursively(
            theConjoint,
            pieceToSearch.inputs[i]
          )
        }
      }
    }

    return null
  }

  FindAnyPieceMatchingIdRecursively (id: number): Piece | null {
    for (const goal of this.rootPieces.GetValues()) {
      const result = goal.FindAnyPieceMatchingIdRecursively(id)
      if (result != null) {
        return result
      }
    }
    return null
  }

  public GetMapOfRootPieces (): RootPieceMap {
    return this.rootPieces
  }
}
