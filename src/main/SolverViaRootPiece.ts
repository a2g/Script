import { Solution } from './Solution.js'
import { GetDisplayName } from './GetDisplayName.js'
import { Colors } from './Colors.js'
import { AddBrackets } from './AddBrackets.js'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'

export class SolverViaRootPiece {
  private solutions: Solution[]

  private readonly mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>

  constructor (mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>) {
    this.solutions = []
    this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string, Set<string>>()
    mapOfStartingThingsAndWhoCanHaveThem.forEach(
      (value: Set<string>, key: string) => {
        const newSet = new Set<string>()
        for (const item of value) {
          newSet.add(item)
        }
        this.mapOfStartingThingsAndWhoCanHaveThem.set(key, newSet)
      }
    )
  }

  InitializeByCopyingThese (
    solutionPiecesMappedByInput: PileOfPiecesReadOnly,
    mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>
  ): void {
    const solution = new Solution(
      null,
      solutionPiecesMappedByInput,
      mapOfStartingThingsAndWhoCanHaveThem
    )
    this.solutions.push(solution)

    solution.FindTheGoalWinAndPutItInRootPieceMap() // <-- do I need to call this?
  }

  IsAnyPiecesUnprocessed (): boolean {
    let isAnyPiecesUnprocessed = false
    this.solutions.forEach((solution: Solution) => {
      if (solution.IsAnyPiecesIncomplete()) {
        isAnyPiecesUnprocessed = true
      }
    })
    return isAnyPiecesUnprocessed
  }

  SolvePartiallyUntilCloning (): boolean {
    let hasACloneJustBeenCreated = false
    this.solutions.forEach((solution: Solution) => {
      if (solution.IsAnyPiecesIncomplete()) {
        if (!solution.IsArchived()) {
          if (solution.ProcessUntilCloning(this)) {
            hasACloneJustBeenCreated = true
          }
        }
      }
    })
    return hasACloneJustBeenCreated
  }

  SolveUntilZeroUnprocessedPieces (): void {
    do {
      this.SolvePartiallyUntilCloning()
    } while (this.IsAnyPiecesUnprocessed())

    this.GenerateSolutionNamesAndPush(
      this.mapOfStartingThingsAndWhoCanHaveThem
    )
  }

  ProcessChaptersToEndAndUpdateList (): void {
    // this needs to be a member function because we are overwriting this.solutions
    const newList = []
    for (const oldSolution of this.solutions) {
      newList.push(oldSolution)
    }
    this.solutions = newList
  }

  GenerateSolutionNamesAndPush (
    mapOfStartingThingsAndWhoHasThem: Map<string, Set<string>>
  ): void {
    for (let i = 0; i < this.solutions.length; i += 1) {
      // now lets find out the amount leafPiece name exists in all the other solutions
      const mapForCounting = new Map<string, number>()
      for (let j = 0; j < this.solutions.length; j += 1) {
        if (i !== j) {
          const otherSolution = this.solutions[j]
          const otherLeafs = otherSolution
            .GetRootPieceMap()
            .GenerateMapOfLeaves()
          for (const leafPiece of otherLeafs.values()) {
            const otherLeafPieceName = leafPiece.output
            let otherLeafPieceNameCount = 0
            const result = mapForCounting.get(otherLeafPieceName)
            if (result !== undefined) {
              otherLeafPieceNameCount = result
            }
            mapForCounting.set(otherLeafPieceName, otherLeafPieceNameCount + 1)
          }
        }
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i]
      let minLeafPieceNameCount = 1000 // something high
      let minLeafPieceName = ' not found'

      // get the restrictions accumulated from all the solution pieces
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions()

      const currLeaves = currSolution.GetRootPieceMap().GenerateMapOfLeaves()
      for (const leafPieces of currLeaves.values()) {
        const result = mapForCounting.get(leafPieces.output)
        if (result !== undefined && result < minLeafPieceNameCount) {
          minLeafPieceNameCount = result
          minLeafPieceName = leafPieces.output
        } else if (!mapForCounting.has(leafPieces.output)) {
          // our leaf is no where in the leafs of other solutions - we can use it!
          minLeafPieceNameCount = 0
          minLeafPieceName = leafPieces.output
        }

        // now we potentially add startingSet items to restrictions
        mapOfStartingThingsAndWhoHasThem.forEach(
          (characters: Set<string>, key: string) => {
            if (key === leafPieces.output) {
              for (const character of characters) {
                accumulatedRestrictions.add(character)
              }
            }
          }
        )
      }

      const term: string =
        accumulatedRestrictions.size > 0
          ? AddBrackets(GetDisplayName(Array.from(accumulatedRestrictions)))
          : ''
      const solutionName = `sol_${minLeafPieceName}${Colors.Reset}${term}`
      currSolution.PushNameSegment(solutionName)
    }
  }

  GetSolutions (): Solution[] {
    return this.solutions
  }
}
