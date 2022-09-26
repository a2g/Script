import { Solution } from '../main/Solution.js';
import { GetDisplayName } from '../main/GetDisplayName.js';
import { Colors } from '../main/Colors.js';
import { AddBrackets } from '../main/AddBrackets.js';
import { SolutionNodeRepository } from '../main/SolutionNodeRepository.js';

export class SolverViaRootNode {
  private solutions: Solution[];

  private readonly mapOfStartingThingsAndWhoCanHaveThem: Map<
    string,
    Set<string>
  >;

  constructor(mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>) {
    this.solutions = [];
    this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string, Set<string>>();
    mapOfStartingThingsAndWhoCanHaveThem.forEach(
      (value: Set<string>, key: string) => {
        const newSet = new Set<string>();
        for (const item of value) {
          newSet.add(item);
        }
        this.mapOfStartingThingsAndWhoCanHaveThem.set(key, newSet);
      }
    );
  }

  InitializeByCopyingThese(
    solutionNodesMappedByInput: SolutionNodeRepository,
    mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>
  ): void {
    const solution = new Solution(
      null,
      solutionNodesMappedByInput,
      mapOfStartingThingsAndWhoCanHaveThem
    );
    this.solutions.push(solution);
    solution.FindTheFlagWinAndPutItInRootNodeMap(); // <-- do I need to call this?
  }

  IsAnyNodesUnprocessed(): boolean {
    let isAnyNodesUnprocessed = false;
    this.solutions.forEach((solution: Solution) => {
      if (solution.IsAnyNodesUnprocessed()) {
        isAnyNodesUnprocessed = true;
      }
    });
    return isAnyNodesUnprocessed;
  }

  SolvePartiallyUntilCloning(): boolean {
    let hasACloneJustBeenCreated = false;
    this.solutions.forEach((solution: Solution) => {
      if (solution.IsAnyNodesUnprocessed()) {
        if (!solution.IsArchived()) {
          if (solution.ProcessUntilCloning(this)) {
            hasACloneJustBeenCreated = true;
          }
        }
      }
    });
    return hasACloneJustBeenCreated;
  }

  SolveUntilZeroUnprocessedNodes(): void {
    do {
      this.SolvePartiallyUntilCloning();
    } while (this.IsAnyNodesUnprocessed());

    this.GenerateSolutionNamesAndPush(
      this.mapOfStartingThingsAndWhoCanHaveThem
    );
  }

  ProcessChaptersToEndAndUpdateList(): void {
    // this needs to be a member function because we are overwriting this.solutions
    const newList = [];
    for (const oldSolution of this.solutions) {
      newList.push(oldSolution);
    }
    this.solutions = newList;
  }

  GenerateSolutionNamesAndPush(
    mapOfStartingThingsAndWhoHasThem: Map<string, Set<string>>
  ): void {
    for (let i = 0; i < this.solutions.length; i += 1) {
      // now lets find out the amount leafNode name exists in all the other solutions
      const mapForCounting = new Map<string, number>();
      for (let j = 0; j < this.solutions.length; j += 1) {
        if (i !== j) {
          const otherSolution = this.solutions[j];
          const otherLeafs = otherSolution
            .GetRootNodeMap()
            .GenerateMapOfLeaves();
          for (const leafNode of otherLeafs.values()) {
            const otherLeafNodeName = leafNode.output;
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
      let minLeafNodeNameCount = 1000; // something high
      let minLeafNodeName = 'not found';

      // get the restrictions accumulated from all the solution nodes
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions();

      const currLeaves = currSolution.GetRootNodeMap().GenerateMapOfLeaves();
      for (const leafNode of currLeaves.values()) {
        const result = mapForCounting.get(leafNode.output);
        if (result !== undefined && result < minLeafNodeNameCount) {
          minLeafNodeNameCount = result;
          minLeafNodeName = leafNode.output;
        } else if (!mapForCounting.has(leafNode.output)) {
          // our leaf is no where in the leafs of other solutions - we can use it!
          minLeafNodeNameCount = 0;
          minLeafNodeName = leafNode.output;
        }

        // now we potentially add startingSet items to restrictions

        mapOfStartingThingsAndWhoHasThem.forEach(
          (characters: Set<string>, key: string) => {
            if (key === leafNode.output) {
              for (const character of characters) {
                accumulatedRestrictions.add(character);
              }
            }
          }
        );
      }

      const term: string =
        accumulatedRestrictions.size > 0
          ? AddBrackets(GetDisplayName(Array.from(accumulatedRestrictions)))
          : '';
      const solutionName = `sol_${minLeafNodeName}${Colors.Reset}${term}`;
      currSolution.PushNameSegment(solutionName);
    }
  }

  GetSolutions(): Solution[] {
    return this.solutions;
  }
}
