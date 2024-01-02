import { AddBrackets } from './AddBrackets';
import { Colors } from './Colors';
import { GetDisplayName } from './GetDisplayName';
import { IBoxReadOnly } from './IBoxReadOnly';
import { RootPieceMap } from './RootPieceMap';
import { Solution } from './Solution';

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
    // we collect the other boxes, but only for
    // collecting all rootmap
    const rootMap = new RootPieceMap(null);
    const boxes = new Map<string, IBoxReadOnly>();
    box.CollectAllReferencedBoxesRecursively(boxes);
    for (const subBox of boxes.values()) {
      subBox.CopyGoalPiecesToContainer(rootMap);
    }

    const allWinGoal = rootMap.GetAllWinGoals();
    if (allWinGoal == null || allWinGoal.length == 0) {
      throw new Error(`No 99_win was found among the ${boxes.size} boxes`);
    }
    rootMap.RemoveAllWinGoals();

    this.solutions = [];
    for (const winGoal of allWinGoal) {
      // ..everything else comes from the single box passed in
      const newRootMap = rootMap.CloneAllRootPiecesAndTheirTrees();
      newRootMap.AddPiece(winGoal.piece);

      const firstSolution = new Solution(
        newRootMap,
        box.GetNewPileOfPieces(),
        box.GetMapOfAllStartingThings(),
        box.IsMergingOk()
      );
      this.solutions.push(firstSolution);
    }

    this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string, Set<string>>();
    const map = this.solutions[0].GetStartingThings();
    for (const thing of map.GetIterableIterator()) {
      const key = thing[0];
      const items = thing[1];
      const newSet = new Set<string>();
      for (const itemName of items) {
        newSet.add(itemName);
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

  public RemoveSolution(solution: Solution): void {
    for (let i = 0; i < this.solutions.length; i++) {
      if (this.solutions[i] === solution) {
        this.solutions.splice(i, 1);
      }
    }
  }

  public GenerateSolutionNamesAndPush(): void {
    for (let i = 0; i < this.solutions.length; i++) {
      // now lets find out the amount leafNode name exists in all the other solutions
      const mapForCounting = new Map<string, number>();
      for (let j = 0; j < this.solutions.length; j++) {
        if (i === j) {
          continue;
        }
        const otherSolution = this.solutions[j];
        const otherLeafs = otherSolution
          .GetRootMap()
          .GenerateMapOfLeavesFromWinGoal();
        for (const leafNode of otherLeafs.values()) {
          if (leafNode != null) {
            const otherLeafNodeName = leafNode.GetOutput();
            let otherLeafNodeNameCount = 0;
            const result = mapForCounting.get(otherLeafNodeName);
            if (result !== undefined) {
              otherLeafNodeNameCount = result;
            }
            mapForCounting.set(otherLeafNodeName, otherLeafNodeNameCount + 1);
          }
        }
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i];
      currSolution.ClearNameSegments();
      let minLeafNodeNameCount = 1000; // something high
      let minLeafNodeName = '';

      // get the restrictions accumulated from all the solution nodes
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions();

      //GenerateMapOfLeaves
      const currLeaves = currSolution
        .GetRootMap()
        .GenerateMapOfLeavesFromWinGoal();
      for (const leafNode of currLeaves.values()) {
        if (leafNode != null) {
          const result = mapForCounting.get(leafNode.GetOutput());
          if (result !== undefined && result < minLeafNodeNameCount) {
            minLeafNodeNameCount = result;
            minLeafNodeName = leafNode.GetOutput();
          } else if (!mapForCounting.has(leafNode.GetOutput())) {
            // our leaf is no where in the leafs of other solutions - we can use it!
            minLeafNodeNameCount = 0;
            minLeafNodeName = leafNode.GetOutput();
          }

          // now we potentially add startingSet items to restrictions
          this.mapOfStartingThingsAndWhoCanHaveThem.forEach(
            (characters: Set<string>, key: string) => {
              if (key === leafNode.GetOutput()) {
                for (const character of characters) {
                  accumulatedRestrictions.add(character);
                }
              }
            }
          );
        }
      }

      currSolution.PushNameSegment(
        'sol_' +
          minLeafNodeName +
          Colors.Reset +
          (accumulatedRestrictions.size > 0
            ? AddBrackets(GetDisplayName(Array.from(accumulatedRestrictions)))
            : '')
      );
    }
  }
}
