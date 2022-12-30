import { AddBrackets } from './AddBrackets.js';
import { Colors } from './Colors.js';
import { GenerateMapOfLeavesRecursively } from './GenerateMapOfLeavesRecursively.js';
import { GetDisplayName } from './GetDisplayName.js';
import { IBoxReadOnly } from './IBoxReadOnly.js';
import { Piece } from './Piece.js';
import { PileOfPieces } from './PileOfPieces.js';
import { RootPieceMap } from './RootPieceMap.js';
import { Solution } from './Solution.js';

function GenerateMapOfLeaves(rootMap: RootPieceMap): Map<string, Piece | null> {
  const map = new Map<string, Piece | null>();

  for (const value of rootMap.GetValues()) {
    const { piece } = value;
    GenerateMapOfLeavesRecursively(piece, piece.output, map);
  }

  return map;
}

/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class SolverViaRootPiece {
  private solutions: Solution[];

  private readonly mapOfStartingThingsAndWhoCanHaveThem: Map<
    string,
    Set<string>
  >;

  constructor(box: IBoxReadOnly) {
    const startingThingsAndWhoCanHaveThem = box.GetMapOfAllStartingThings();

    const pile = new PileOfPieces(null);
    box.CopyPiecesFromBoxToPile(pile);

    const rootMap = new RootPieceMap(null);
    const boxes = new Set<IBoxReadOnly>();
    box.CollectAllReferencedBoxesRecursively(boxes);
    for (const subBox of boxes) {
      subBox.CopyGoalPiecesToContainer(rootMap);
    }

    const firstSolution = new Solution(
      rootMap,
      pile,
      startingThingsAndWhoCanHaveThem,
      box.IsMergingOk()
    );
    this.solutions = [];
    this.solutions.push(firstSolution);

    this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string, Set<string>>();
    const map = firstSolution.GetStartingThings();
    for (const thing of map.GetIterableIterator()) {
      const key = thing[0];
      const items = thing[1];
      const newSet = new Set<string>();
      for (const item of items) {
        newSet.add(item);
      }
      this.mapOfStartingThingsAndWhoCanHaveThem.set(key, newSet);
    }

    this.GenerateSolutionNamesAndPush();
  }

  public NumberOfSolutions(): number {
    return this.solutions.length;
  }

  public AreAnyInputsNull(): boolean {
    for (const solution of this.solutions) {
      solution.MarkGoalsAsContainingNullsAndMergeIfNeeded();
      if (solution.AreAnyInputsNull()) {
        return true;
      }
    }
    return false;
  }

  public SolvePartiallyUntilCloning(): boolean {
    let hasACloneJustBeenCreated = false;
    this.solutions.forEach((solution: Solution) => {
      if (solution.AreAnyInputsNull()) {
        if (!solution.IsArchived()) {
          if (solution.ProcessUntilCloning(this)) {
            hasACloneJustBeenCreated = true;
          }
        }
      }
    });
    return hasACloneJustBeenCreated;
  }

  public GetSolutions(): Solution[] {
    return this.solutions;
  }

  public MarkGoalsAsCompletedAndMergeIfNeeded(): void {
    for (const solution of this.solutions) {
      solution.MarkGoalsAsContainingNullsAndMergeIfNeeded();
    }
  }

  public GenerateSolutionNamesAndPush(): void {
    for (let i = 0; i < this.solutions.length; i += 1) {
      // now lets find out the amount leafPiece name exists in all the other solutions
      const mapForCounting = new Map<string, number>();
      for (let j = 0; j < this.solutions.length; j += 1) {
        if (i !== j) {
          const otherSolution = this.solutions[j];
          const otherLeafs = GenerateMapOfLeaves(otherSolution.GetRootMap());
          for (const leafPiece of otherLeafs.values()) {
            if (leafPiece != null) {
              const otherLeafPieceName = leafPiece.output;
              let otherLeafPieceNameCount = 0;
              const result = mapForCounting.get(otherLeafPieceName);
              if (result !== undefined) {
                otherLeafPieceNameCount = result;
              }
              mapForCounting.set(
                otherLeafPieceName,
                otherLeafPieceNameCount + 1
              );
            }
          }
        }
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i];
      let minLeafPieceNameCount = 1000; // something high
      let minLeafPieceName = ' zero solutions so cant generate solution name';

      // get the restrictions accumulated from all the solution pieces
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions();

      const currLeaves = GenerateMapOfLeaves(currSolution.GetRootMap());
      for (const leaf of currLeaves.values()) {
        if (leaf != null) {
          const result = mapForCounting.get(leaf.output);
          if (result !== undefined && result < minLeafPieceNameCount) {
            minLeafPieceNameCount = result;
            minLeafPieceName = leaf.output;
          } else if (!mapForCounting.has(leaf.output)) {
            // our leaf is no where in the leafs of other solutions - we can use it!
            minLeafPieceNameCount = 0;
            minLeafPieceName = leaf.output;
          }

          // now we potentially add startingSet items to restrictions
          this.mapOfStartingThingsAndWhoCanHaveThem.forEach(
            (characters: Set<string>, key: string) => {
              if (key === leaf.output) {
                for (const character of characters) {
                  accumulatedRestrictions.add(character);
                }
              }
            }
          );
        }
      }

      const term: string =
        accumulatedRestrictions.size > 0
          ? AddBrackets(GetDisplayName(Array.from(accumulatedRestrictions)))
          : '';
      const solutionName = `Solution name: ${minLeafPieceName}${Colors.Reset}${term}`;
      currSolution.PushNameSegment(solutionName);
    }
  }
}
