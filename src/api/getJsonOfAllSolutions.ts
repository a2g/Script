import { existsSync } from 'fs'
import { FormatText } from '../puzzle/FormatText'
import { join } from 'path'
import { Piece } from '../puzzle/Piece'
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb'
import { Solution } from '../puzzle/Solution'
import { Solutions } from '../puzzle/Solutions'
import { _STARTER_JSONC } from '../_STARTER_JSONC'

interface $INameIsAAchievementChildren {
  name: string
  isAAchievementOrAuto: boolean
  children: Array<Record<string, unknown>>
}

export function getJsonOfAllSolutions (
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = join(__dirname, `../../../../${repo}/${world}/${area}/`)

  const firstBoxFilename = _STARTER_JSONC

  if (!existsSync(path + firstBoxFilename)) {
    throw Error(`file doesn't exist ${path}${firstBoxFilename}`)
  }

  const solutions = new Solutions(path, firstBoxFilename)

  for (let i = 0; i < 200; i++) {
    solutions.SolvePartiallyUntilCloning()
    solutions.UpdateSolvedStatuses()
  }

  // display list
  let incomplete = 0
  let listItemNumber = 0
  for (const solution of solutions.GetSolutions()) {
    console.warn(FormatText(solution.GetSolvingPath()))
    console.warn(FormatText(solution.GetAchievementStubMap().CalculateListOfKeys()))
    for (const item of solution.GetAchievementStubMap().GetValues()) {
      listItemNumber++

      // display list item
      const output = item.GetTheAchievementWord()
      console.warn(`    ${listItemNumber}. ${output} )`)
      incomplete += item.IsSolved() ? 0 : 1
    }
  }

  console.warn(`Number of achievements incomplete ${incomplete}/${listItemNumber}`)

  const json = getJsonOfSolutionsFromSolver(solutions)
  return json
}

function getJsonOfSolutionsFromSolver (
  solutions: Solutions
): Record<string, unknown> {
  return {
    name: 'Solutions',
    children: getJsonArrayOfSolutions(solutions.GetSolutions())
  }
}

function getJsonArrayOfSolutions (
  solutions: Solution[]
): $INameIsAAchievementChildren[] {
  const toReturn = new Array<$INameIsAAchievementChildren>()
  let i = 0
  for (const solution of solutions) {
    i += 1
    toReturn.push({
      name: `Solution ${i}`,
      isAAchievementOrAuto: false,
      children: getJsonArrayOfRootPieces(solution)
    })
  }

  return toReturn
}

function getJsonArrayOfRootPieces (
  solution: Solution
): Array<Record<string, unknown>> {
  const toReturn = new Array<Record<string, unknown>>()

  // first we push this
  const listOfRootPieceArrays = solution.GetAchievementStubMap().GetValues()
  for (const rootPiece of listOfRootPieceArrays) {
    toReturn.push({
      name: rootPiece.GetTheAchievementWord(),
      isAAchievementOrAuto: false,
      children: getJsonArrayOfAllSubPieces(rootPiece.GetThePiece())
    })
  }

  /*
  // then we push the actual order of commands
  toReturn.push({
    name: 'List of Commands',
    isAAchievementOrAuto: false,
    children: getJsonArrayOfOrderedSteps(solution.GetOrderOfCommands())
  }) */
  return toReturn
}

function getJsonArrayOfAllSubPieces (piece: Piece | null): unknown[] {
  const toReturn = new Array<unknown>()
  if (piece != null) {
    let i = -1
    for (const hint of piece.inputHints) {
      i++
      const pieceOrNull = piece.inputs[i]
      if (pieceOrNull != null) {
        toReturn.push({
          name: hint,
          isAAchievementOrAuto: false,
          children: getJsonArrayOfAllSubPieces(pieceOrNull)
        })
      } else {
        toReturn.push({
          name: hint,
          isAAchievementOrAuto: false
        })
      }
    }
    if (i === -1) {
      toReturn.push({
        name: piece.output,
        isAAchievementOrAuto: false
      })
    }
  }
  return toReturn
}

export function getJsonArrayOfOrderedSteps (
  steps: RawObjectsAndVerb[]
): unknown[] {
  const toReturn = new Array<unknown>()
  let lastLocation = ''
  for (const step of steps) {
    step.PopulateSpielFields(false)// false - because we don't want ansi colors

    // big writing about why its bad
    //
    //
    //
    let newLocation = lastLocation // default to last
    if (step.objectA.startsWith('obj_')) {
      newLocation = step.objectA
    } else if (step.objectB.startsWith('obj_')) {
      newLocation = step.objectB
    }
    toReturn.push({
      name: step.mainSpiel,
      isAAchievementOrAuto: step.isAAchievementOrAuto(),
      paramA: lastLocation,
      paramB: newLocation,
      children: []
    })
    for (const speechLine of step.speechLines) {
      toReturn.push({
        name: speechLine,
        isAAchievementOrAuto: true,
        paramA: newLocation,
        paramB: newLocation,
        children: []
      })
    }

    lastLocation = newLocation
  }
  return toReturn
}
