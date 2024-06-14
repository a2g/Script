// import { Aggregates } from './Aggregates'
import { Aggregates } from './Aggregates'
import { Box } from './Box'
import { GoalStubMap } from './GoalStubMap'
import { Piece } from './Piece'
import { Solution } from './Solution'
import { TalkFile } from './talk/TalkFile'
import { VisibleThingsMap } from './VisibleThingsMap'

/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class Solutions {
  private readonly solutions: Solution[]
  private readonly combinedBox: Box
  // private readonly starterBox: Box
  private readonly mapOfStartingThingsAndWhoStartsWithThem: Map<string, Set<string>>
  aggregates: Aggregates

  constructor (startFolder: string, _startFile: string) {
    // this.starterBox = new Box(startFolder, [startFile])
    // const array = Array.from(this.starterBox.getAggregates().mapOfBoxes.keys())
    const array = [
      'starter.jsonc',
      'x02_tree_clearing_location_opened.jsonc',
      'x03_met_demon_first_time.jsonc',
      'x04_let_all_rpg_kids_know_about_demon.jsonc',
      'x07_access_to_library_reference_section.jsonc',
      'x17_map_now_has_football_stadium.jsonc',
      'x18_attract_groundskeeper.jsonc',
      'x19_access_to_maintenance_tunnel.jsonc',
      'x05_map_now_has_printing_works.jsonc',
      'x15_access_inside_printworks_airraid_shelter.jsonc',
      'x16_access_to_printworks_archive_machine.jsonc',
      'x04_let_all_music_kids_know_about_demon.jsonc'
    ]
    this.aggregates = new Aggregates()
    this.combinedBox = new Box(startFolder, array, this.aggregates)
    this.solutions = []

    // now lets initialize the first solution
    const solution1 = Solution.createSolution(
      this.combinedBox.GetPieces(),
      this.combinedBox.GetTalkFiles(),
      this.combinedBox.GetMapOfAllStartingThings(),
      // this.CreateGoalStubMapFromGoalWords(this.combinedBox.GetSetOfGoalWords())
      this.CreateGoalStubMapFromGoalWords(this.aggregates.setOfGoalWords)
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
  }

  public NumberOfSolutions (): number {
    return this.solutions.length
  }

  // public GetStarter (): Box {
  //  return this.starterBox
  // }

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
      solution.UpdateGoalSolvedStatuses()
    }
  }

  public RemoveSolution (solution: Solution): void {
    for (let i = 0; i < this.solutions.length; i++) {
      if (this.solutions[i] === solution) {
        this.solutions.splice(i, 1)
      }
    }
  }

  public CreateGoalStubMapFromGoalWords (setOfStrings: Set<string>): GoalStubMap {
    setOfStrings.delete('x_win')
    const rootMapFromGoalStubs = new GoalStubMap(null)
    rootMapFromGoalStubs.AddGoalStub('x_win')

    for (const goalWord of setOfStrings) {
      rootMapFromGoalStubs.AddGoalStub(goalWord)
    }
    return rootMapFromGoalStubs
  }

  public PerformThingsNeededAfterAllSolutionsFound (): void {
    this.GenerateSolutionNamesTheOldWay()
    this.KeepOnlyVisitedGoalsFromAllSolutions()
    this.FindEssentialIngredientsPerSolution()
  }

  private FindEssentialIngredientsPerSolution (): void {
    const characters = this.combinedBox.GetArrayOfCharacters()
    for (const character of characters) {
      const charactersSet = this.combinedBox.GetStartingThingsForCharacter(character)
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
  }

  public KeepOnlyVisitedGoalsFromAllSolutions (): void {
    for (const solution of this.solutions) {
      solution.KeepOnlyVisitedGoals()
    }
  }

  public GenerateSolutionNamesTheOldWay (): void {

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

  public GetStartersMapOfAllStartingThings (): VisibleThingsMap {
    return this.combinedBox.GetStartersMapOfAllStartingThings()
  }

  public GetStartingTalkFiles (): Map<string, TalkFile> {
    return this.combinedBox.GetStartingTalkFiles()
  }

  public GetStartingPieces (): Map<string, Set<Piece>> {
    return this.combinedBox.GetStartingPieces()
  }

  public GetBoxes (): IterableIterator<Box> {
    return this.aggregates.mapOfBoxes.values()
  }
}
