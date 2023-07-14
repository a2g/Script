import { FormatText } from './FormatText';
import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively';
import { IPileOfPiecesReadOnly } from './IPileOfPiecesReadOnly';
import { Piece } from './Piece';
import { PileOfPieces } from './PileOfPieces';
import { Raw } from './Raw';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { ReverseTraverser } from './ReverseTraverser';
import { RootPieceMap } from './RootPieceMap';
import { SolverViaRootPiece } from './SolverViaRootPiece';
import { VisibleThingsMap } from './VisibleThingsMap';

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
  private readonly rootPieces: RootPieceMap;

  private readonly remainingPiecesRepo: PileOfPieces;

  // less important
  private readonly startingThings: VisibleThingsMap; // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree

  private readonly currentlyVisibleThings: VisibleThingsMap;

  private readonly restrictionsEncounteredDuringSolving: Set<string>; // yup these are added to

  private readonly solutionNameSegments: string[]; // these get assigned by SolverViaRootPiece.GenerateNames

  private isArchived: boolean;

  private readonly isMergingOk: boolean;

  private readonly commandCompletedInOrder: Array<RawObjectsAndVerb>;

  constructor(
    rootPieceMapToCopy: RootPieceMap | null,
    copyThisMapOfPieces: IPileOfPiecesReadOnly,
    startingThingsPassedIn: VisibleThingsMap,
    isMergingOk: boolean = false,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.rootPieces = new RootPieceMap(rootPieceMapToCopy);
    this.isMergingOk = isMergingOk;
    this.remainingPiecesRepo = new PileOfPieces(copyThisMapOfPieces);
    this.isArchived = false;
    this.commandCompletedInOrder = [];

    this.startingThings = new VisibleThingsMap(null);
    this.currentlyVisibleThings = new VisibleThingsMap(null);
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.startingThings.Set(item[0], item[1]);
        this.currentlyVisibleThings.Set(item[0], item[1]);
      }
    }

    // if it is passed in, we deep copy it
    this.solutionNameSegments = [];
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solutionNameSegments.push(segment);
      }
    }

    // its its passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>();
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction);
      }
    }
  }

  public Clone(): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const clonedRootPieceMap = this.rootPieces.CloneAllRootPiecesAndTheirTrees();

    // When we clone we generally give everything new ids
    // but

    const clonedSolution = new Solution(
      clonedRootPieceMap,
      this.remainingPiecesRepo,
      this.startingThings,
      this.isMergingOk,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNameSegments
    );
    return clonedSolution;
  }

  public ProcessUntilCloning(solutions: SolverViaRootPiece): boolean {
    let isBreakingDueToSolutionCloning = false;
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        if (goal.piece.ProcessUntilCloning(this, solutions, '/')) {
          isBreakingDueToSolutionCloning = true;
          break;
        }
      }
    }

    return isBreakingDueToSolutionCloning;
  }

  /**
   * This method is only for debugging. I should remove it completely?
   */
  /*
  GetIncompletePieces (): Set<Piece> {
    return this.incompletePieces
  } */

  public GetDisplayNamesConcatenated(): string {
    let result = '';
    for (let i = 0; i < this.solutionNameSegments.length; i += 1) {
      const symbol = i === 0 ? '' : '/';
      result += symbol + FormatText(this.solutionNameSegments[i]);
    }
    return result;
  }

  public AddRestrictions(restrictions: string[]): void {
    for (const restriction of restrictions) {
      this.restrictionsEncounteredDuringSolving.add(restriction);
    }
  }

  public GetAccumulatedRestrictions(): Set<string> {
    return this.restrictionsEncounteredDuringSolving;
  }

  public GetPile(): PileOfPieces {
    // we already remove pieces from this when we use them up
    // so returning the current piece map is ok
    return this.remainingPiecesRepo;
  }

  public SetAsArchived(): void {
    this.isArchived = true;
  }

  public IsArchived(): boolean {
    return this.isArchived;
  }

  public GetLastDisplayNameSegment(): string {
    return this.solutionNameSegments[this.solutionNameSegments.length - 1];
  }

  public CopyNameToVirginSolution(virginSolution: Solution): void {
    for (const nameSegment of this.solutionNameSegments) {
      virginSolution.PushNameSegment(nameSegment);
    }
  }

  public PushNameSegment(solutionName: string): void {
    this.solutionNameSegments.push(solutionName);
  }

  public ClearNameSegments(): void {
    this.solutionNameSegments.length = 0;
  }

  public FindAnyPieceMatchingIdRecursively(id: number): Piece | null {
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        const result = goal.piece.FindAnyPieceMatchingIdRecursively(id);
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }

  public GetRootMap(): RootPieceMap {
    return this.rootPieces;
  }

  public GetStartingThings(): VisibleThingsMap {
    return this.startingThings;
  }

  public MarkGoalsAsContainingNullsAndMergeIfNeeded(): void {
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        const firstMissingPiece = goal.piece.ReturnTheFirstNullInputHint();
        if (firstMissingPiece === '') {
          // there are no missing pieces - yay!
          if (goal.firstNullInput !== '') {
            goal.firstNullInput = '';
            //
            this.GenerateCommandsAndAddToMap(goal.piece);
            if (goal.piece.merge != null && this.isMergingOk) {
              goal.piece.merge.CopyPiecesFromBoxToPile(this.GetPile());
              goal.piece.merge.CopyStartingThingCharsToGivenMap(
                this.startingThings
              );
              goal.piece.merge.CopyStartingThingCharsToGivenMap(
                this.currentlyVisibleThings
              );
            }
          }
        }
      }
    }
  }

  public GenerateCommandsAndAddToMap(piece: Piece): void {
    // push the commands
    const leaves = new Map<string, Piece | null>();
    GenerateMapOfLeavesRecursively(piece, '', leaves, true);
    const reverseTraverser = new ReverseTraverser(
      this.currentlyVisibleThings,
      leaves
    );
    let rawObjectsAndVerb: RawObjectsAndVerb | null = null;
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb = reverseTraverser.GetNextDoableCommandAndDeconstructTree();
      if (rawObjectsAndVerb == null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb = reverseTraverser.GetNextDoableCommandAndDeconstructTree();
        break;
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
        this.commandCompletedInOrder.push(rawObjectsAndVerb);
      }

      if (rawObjectsAndVerb.type === Raw.PenultimateStep) {
        // this is just here for debugging!
        console.warn(reverseTraverser.GetNextDoableCommandAndDeconstructTree());
        break;
      }
    }

    // set the goal as visible in the currently visible things
    this.currentlyVisibleThings.Set(piece.output, new Set<string>());

    // then write the goal we just completed
    this.commandCompletedInOrder.push(
      new RawObjectsAndVerb(Raw.Goal, `completed (${piece.output})`, '', [], '')
    );
  }

  public AreAnyInputsNull(): boolean {
    for (const array of this.rootPieces.GetValues()) {
      for (const goal of array) {
        if (goal.firstNullInput.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  public GetOrderOfCommands(): Array<RawObjectsAndVerb> {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The following is how to clone in js
    return this.commandCompletedInOrder.map(x => x);
  }

  public GetVisibleThingsAtTheMoment(): VisibleThingsMap {
    return this.currentlyVisibleThings;
  }

  public GetVisibleThingsAtTheStart(): VisibleThingsMap {
    return this.startingThings;
  }

  public GetSize() {
    return this.remainingPiecesRepo.Size();
  }
}
