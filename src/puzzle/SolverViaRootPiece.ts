import { Box } from './Box'
import { GoalWordMap } from './GoalWordMap'
import { Solution } from './Solution'

/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class SolverViaRootPiece {
  private readonly solutions: Solution[]
  private readonly startingBox: Box

  private readonly mapOfStartingThingsAndWhoStartsWithThem: Map<
  string,
  Set<string>
  >

  private readonly isMergeBoxToBeCalled: boolean

  constructor (startingBox: Box, isMergeBoxToBeCalled: boolean) {
    this.solutions = []
    this.startingBox = startingBox
    this.isMergeBoxToBeCalled = isMergeBoxToBeCalled

    const solution1 = Solution.createSolution(
      this.CreateRootMapFromGoalWords(startingBox.GetSetOfGoalWords()),
      startingBox.GetPiecesMappedByOutput(),
      startingBox.GetTalks(),
      startingBox.GetMapOfAllStartingThings(),
      this.isMergeBoxToBeCalled
    )
    this.solutions.push(solution1)

    this.mapOfStartingThingsAndWhoStartsWithThem = new Map<string, Set<string>>()
    const staringThings = solution1.GetStartingThings()
    for (const thing of staringThings.GetIterableIterator()) {
      const key = thing[0]
      // characters is mostly an empty set
      // because because less than one percent of objects
      // are constrained to a particular character
      const characters = thing[1]
      const newSet = new Set<string>()
      for (const character of characters) {
        newSet.add(character)
      }
      this.mapOfStartingThingsAndWhoStartsWithThem.set(key, newSet)
    }

    this.GenerateSolutionNamesAndPush()
  }

  public NumberOfSolutions (): number {
    return this.solutions.length
  }

  public SolvePartiallyUntilCloning (): boolean {
    let hasACloneJustBeenCreated = false
    const solutions = this.solutions
    for (const solution of solutions) {
      if (solution.IsUnsolved()) {
        if (solution.ProcessUntilCloning(this)) {
          hasACloneJustBeenCreated = true
          break// breaking here at a smaller step, allows catching of bugs as soon as they occur
        }
      }
    }
    return hasACloneJustBeenCreated
  }

  public GetSolutions (): Solution[] {
    return this.solutions
  }

  public MarkGoalsAsCompletedAndMergeIfNeeded (): void {
    for (const solution of this.solutions) {
      solution.MarkGoalsAsContainingNullsAndMergeIfNeeded()
    }
  }

  public RemoveSolution (solution: Solution): void {
    for (let i = 0; i < this.solutions.length; i++) {
      if (this.solutions[i] === solution) {
        this.solutions.splice(i, 1)
      }
    }
  }

  public CreateRootMapFromGoalWords (set: Set<string>): GoalWordMap {
    const rootMapFromGoalWords = new GoalWordMap(null)
    for (const goal of set) {
      rootMapFromGoalWords.AddGoalWord(goal)
    }
    return rootMapFromGoalWords
  }

  public GenerateSolutionNamesAndPush (): void {
    const characters = this.startingBox.GetArrayOfCharacters()
    for (const character of characters) {
      const charactersSet = this.startingBox.GetStartingThingsForCharacter(character)
      for (const solution of this.solutions) {
        const arrayOfCommands = solution.GetOrderOfCommands()
        for (const command of arrayOfCommands) {
          const hasObjectA: boolean = charactersSet.has(command.objectA)
          const hasObjectB: boolean = charactersSet.has(command.objectB)
          if (hasObjectA || hasObjectB) {
            solution.AddToListOfEssentials([character])
          }
        }
      }
    }
    /*
    for (let i = 0; i < this.solutions.length; i++) {
      // now lets find out the amount leafNode name exists in all the other solutions
      const mapForCounting = new Map<string, number>()
      for (let j = 0; j < this.solutions.length; j++) {
        if (i === j) {
          continue
        }
        const otherSolution = this.solutions[j]
        const otherLeafs = otherSolution
          .GetRootMap()
          .GenerateMapOfLeavesFromWinGoal()
        for (const leafNode of otherLeafs.values()) {
          if (leafNode != null) {
            const otherLeafNodeName = leafNode.GetOutput()
            let otherLeafNodeNameCount = 0
            const result = mapForCounting.get(otherLeafNodeName)
            if (result !== undefined) {
              otherLeafNodeNameCount = result
            }
            mapForCounting.set(otherLeafNodeName, otherLeafNodeNameCount + 1)
          }
        }
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i]
      let minLeafNodeNameCount = 1000 // something high
      let minLeafNodeName = ''

      // get the restrictions accumulated from all the solution nodes
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions()

      // GenerateMapOfLeaves
      const currLeaves = currSolution
        .GetRootMap()
        .GenerateMapOfLeavesFromWinGoal()
      for (const leafNode of currLeaves.values()) {
        if (leafNode != null) {
          const result = mapForCounting.get(leafNode.GetOutput())
          if (result !== undefined && result < minLeafNodeNameCount) {
            minLeafNodeNameCount = result
            minLeafNodeName = leafNode.GetOutput()
          } else if (!mapForCounting.has(leafNode.GetOutput())) {
            // our leaf is no where in the leafs of other solutions - we can use it!
            minLeafNodeNameCount = 0
            minLeafNodeName = leafNode.GetOutput()
          }

          // now we potentially add startingSet items to restrictions
          this.mapOfStartingThingsAndWhoCanHaveThem.forEach(
            (characters: Set<string>, key: string) => {
              if (key === leafNode.GetOutput()) {
                for (const character of characters) {
                  accumulatedRestrictions.add(character)
                }
              }
            }
          )
        }
      }

      if (minLeafNodeName !== '') {
        if (!currSolution.GetLastDisplayNameSegment().startsWith('sol_')) {
          currSolution.PushDisplayNameSegment(
            'sol_' +
            minLeafNodeName +
            Colors.Reset +
            (accumulatedRestrictions.size > 0
              ? AddBrackets(GetDisplayName(Array.from(accumulatedRestrictions)))
              : '')
          )
        }
      }
    } */
  }
}
