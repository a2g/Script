import { existsSync } from 'fs'
import { FilenameSuffixes } from '../../FilenameSuffixes'
import { FormatText } from '../puzzle/FormatText'
import { join } from 'path'
import { Piece } from '../puzzle/Piece'
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb'
import { Solution } from '../puzzle/Solution'
import { Solutions } from '../puzzle/Solutions'

interface $INameIsAGoalChildren {
  name: string
  isAGoalOrAuto: boolean
  children: Array<Record<string, unknown>>
}

export function getJsonOfAllSolutions (
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = join(__dirname, `../../../../${repo}/${world}/${area}/`)

  const firstBoxFilename = `${FilenameSuffixes.Starter}.jsonc`

  if (!existsSync(path + firstBoxFilename)) {
    throw Error(`file doesn't exist ${path}${firstBoxFilename}`)
  }

  const solutions = new Solutions(path, firstBoxFilename)

  for (let i = 0; i < 40; i++) {
    solutions.SolvePartiallyUntilCloning()
    solutions.MarkGoalsAsCompletedAndMergeIfNeeded()
    const numberOfSolutions: number = solutions.NumberOfSolutions()
    console.warn('Dig in to goals')
    console.warn('===============')
    console.warn(`Number of solutions in solutions = ${numberOfSolutions}`)

    // display list
    let incomplete = 0
    let listItemNumber = 0
    for (const solution of solutions.GetSolutions()) {
      console.warn(FormatText(solution.GetSolvingPath()))
      console.warn(FormatText(solution.GetGoalStubMap().CalculateListOfKeys()))
      for (const item of solution.GetGoalStubMap().GetValues()) {
        listItemNumber++

        // display list item
        const status = item.IsSolved() ? 'Solved' : 'Unsolved'
        const output = item.GetGoalWord()
        const piece = item.GetPiece()
        console.warn(`    ${listItemNumber}. ${output} (root = ${(piece != null) ? 'found' : 'null'} status=${status})`)
        incomplete += item.IsSolved() ? 0 : 1
      }
    }

    console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`)
    if (incomplete >= listItemNumber) {
      break
    }
  }
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
): $INameIsAGoalChildren[] {
  const toReturn = new Array<$INameIsAGoalChildren>()
  let i = 0
  for (const solution of solutions) {
    i += 1
    toReturn.push({
      name: `Solution ${i}`,
      isAGoalOrAuto: false,
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
  const listOfRootPieceArrays = solution.GetGoalStubMap().GetValues()
  for (const rootPiece of listOfRootPieceArrays) {
    toReturn.push({
      name: rootPiece.GetGoalWord(),
      isAGoalOrAuto: false,
      children: getJsonArrayOfAllSubPieces(rootPiece.GetPiece())
    })
  }

  // then we push the actual order of commands
  toReturn.push({
    name: 'List of Commands',
    isAGoalOrAuto: false,
    children: getJsonArrayOfOrderedSteps(solution.GetOrderOfCommands())
  })
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
          isAGoalOrAuto: false,
          children: getJsonArrayOfAllSubPieces(pieceOrNull)
        })
      } else {
        toReturn.push({
          name: hint,
          isAGoalOrAuto: false
        })
      }
    }
    if (i === -1) {
      toReturn.push({
        name: piece.output,
        isAGoalOrAuto: false
      })
    }
  }
  return toReturn
}

function getJsonArrayOfOrderedSteps (
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
    if (step.objectA.startsWith('prop_')) {
      newLocation = step.objectA
    } else if (step.objectB.startsWith('prop_')) {
      newLocation = step.objectB
    }
    toReturn.push({
      name: step.mainSpiel,
      isAGoalOrAuto: step.isAGoalOrAuto(),
      paramA: lastLocation,
      paramB: newLocation,
      children: []
    })
    for (const speechLine of step.speechLines) {
      toReturn.push({
        name: speechLine,
        isAGoalOrAuto: true,
        paramA: newLocation,
        paramB: newLocation,
        children: []
      })
    }

    lastLocation = newLocation
  }
  return toReturn
}
