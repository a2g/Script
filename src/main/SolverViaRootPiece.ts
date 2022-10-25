import { Solution } from './Solution.js'
import { GetDisplayName } from './GetDisplayName.js'
import { Colors } from './Colors.js'
import { AddBrackets } from './AddBrackets.js'

export class SolverViaRootPiece {
  private solutions: Solution[]

  private readonly mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>

  constructor (firstSolution: Solution) {
    this.solutions = []
    this.solutions.push(firstSolution)

    this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string, Set<string>>()
    const map: ReadonlyMap<string, Set<string>> = firstSolution.GetStartingThings()
    for (const thing of map) {
      const key = thing[0]
      const items = thing[1]
      const newSet = new Set<string>()
      for (const item of items) {
        newSet.add(item)
      }
      this.mapOfStartingThingsAndWhoCanHaveThem.set(key, newSet)
    }
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

    this.GenerateSolutionNamesAndPush()
  }

  ProcessChaptersToEndAndUpdateList (): void {
    // this needs to be a member function because we are overwriting this.solutions
    const newList = []
    for (const oldSolution of this.solutions) {
      newList.push(oldSolution)
    }
    this.solutions = newList
  }

  GenerateSolutionNamesAndPush (): void {
    for (let i = 0; i < this.solutions.length; i += 1) {
      // now lets find out the amount leafPiece name exists in all the other solutions
      const mapForCounting = new Map<string, number>()
      for (let j = 0; j < this.solutions.length; j += 1) {
        if (i !== j) {
          const otherSolution = this.solutions[j]
          const otherLeafs = otherSolution
            .GetRootMap()
            .GenerateMapOfLeaves()
          for (const leafPiece of otherLeafs.values()) {
            if (leafPiece != null) {
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
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i]
      let minLeafPieceNameCount = 1000 // something high
      let minLeafPieceName = ' not found'

      // get the restrictions accumulated from all the solution pieces
      const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions()

      const currLeaves = currSolution.GetRootMap().GenerateMapOfLeaves()
      for (const leaf of currLeaves.values()) {
        if (leaf != null) {
          const result = mapForCounting.get(leaf.output)
          if (result !== undefined && result < minLeafPieceNameCount) {
            minLeafPieceNameCount = result
            minLeafPieceName = leaf.output
          } else if (!mapForCounting.has(leaf.output)) {
            // our leaf is no where in the leafs of other solutions - we can use it!
            minLeafPieceNameCount = 0
            minLeafPieceName = leaf.output
          }

          // now we potentially add startingSet items to restrictions
          this.mapOfStartingThingsAndWhoCanHaveThem.forEach(
            (characters: Set<string>, key: string) => {
              if (key === leaf.output) {
                for (const character of characters) {
                  accumulatedRestrictions.add(character)
                }
              }
            }
          )
        }
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
