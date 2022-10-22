import { SolverViaRootPiece } from './SolverViaRootPiece.js'
import { Piece } from './Piece.js'
import { SpecialTypes } from './SpecialTypes.js'
import { PileOfPieces } from './PileOfPieces.js'
import { FormatText } from './FormatText.js'
import { RootPieceMap } from './RootPieceMap.js'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'

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
  private readonly incompletePieces: Set<Piece>
  private readonly restrictionsEncounteredDuringSolving: Set<string>// yup these are added to
  private readonly solutionNameSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames
  private readonly startingThings: ReadonlyMap<string, Set<string>> // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree

  private isArchived: boolean

  constructor (
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: PileOfPiecesReadOnly,
    startingThingsPassedIn: ReadonlyMap<string, Set<string>>,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.incompletePieces = new Set<Piece>()
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy, this.incompletePieces)

    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces)
    this.isArchived = false

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

    // this is readonly so we don't copy it
    this.startingThings = startingThingsPassedIn
  }

  public AddRootPiece (rootPiece: Piece): void {
    this.rootPieces.AddPiece(rootPiece)
    this.incompletePieces.add(rootPiece)
  }

  Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const incompletePieces = new Set<Piece>()
    const clonedRootPieceMap =
      this.rootPieces.CloneAllRootPiecesAndTheirTrees(incompletePieces)
    this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN()).id =
      this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN()).id // not sure why do this, but looks crucial!
    const clonedSolution = new Solution(
      clonedRootPieceMap,
      this.remainingPiecesRepo,
      this.startingThings,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNameSegments
    )
    clonedSolution.SetIncompletePieces(incompletePieces)
    return clonedSolution
  }

  SetPieceIncomplete (piece: Piece | null): void {
    if (piece != null) {
      if (piece.type !== SpecialTypes.VerifiedLeaf) {
        this.incompletePieces.add(piece)
      }
    }
  }

  MarkPieceAsCompleted (piece: Piece | null): void {
    if (piece != null) {
      if (this.incompletePieces.has(piece)) {
        this.incompletePieces.delete(piece)
      }
    }
  }

  SetIncompletePieces (set: Set<Piece>): void {
    // safer to copy this - just being cautious
    this.incompletePieces.clear()
    for (const piece of set) {
      this.incompletePieces.add(piece)
    }
  }

  IsAnyPiecesIncomplete (): boolean {
    return this.incompletePieces.size > 0
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
      this.incompletePieces.clear()
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
    return this.rootPieces.GetRootPieceByName(this.GetFLAG_WIN())
  }

  GetFLAG_WIN (): string {
    return 'goal_win'
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
    this.solutionNameSegments.push(solutionName)
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

  GetRepoOfRemainingPieces (): PileOfPieces {
    // we already remove pieces from this when we use them up
    // so returning the current piece map is ok
    return this.remainingPiecesRepo
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
    return this.solutionNameSegments[this.solutionNameSegments.length - 1]
  }

  CopyNameToVirginSolution (virginSolution: Solution): void {
    for (const nameSegment of this.solutionNameSegments) {
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

  public GetRootPieceMap (): RootPieceMap {
    return this.rootPieces
  }

  GetStartingThings (): ReadonlyMap<string, Set<string>> {
    return this.startingThings
  }
}
