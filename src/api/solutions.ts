import { Piece } from '../puzzle/Piece';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
import { Solution } from '../puzzle/Solution';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';

interface $INameIsAGoalChildren {
  name: string;
  isAGoalOrAuto: boolean;
  children: Array<Record<string, unknown>>;
}

export function solutions(solver: SolverViaRootPiece): Record<string, unknown> {
  return {
    name: 'Solutions',
    children: getJsonArrayOfSolutions(solver.GetSolutions()),
  };
}

function getJsonArrayOfSolutions(
  solutions: Solution[]
): Array<$INameIsAGoalChildren> {
  const toReturn = new Array<$INameIsAGoalChildren>();
  let i = 0;
  for (const solution of solutions) {
    i += 1;
    toReturn.push({
      name: `Solution ${i}`,
      isAGoalOrAuto: false,
      children: getJsonArrayOfRootPieces(solution),
    });
  }

  return toReturn;
}

function getJsonArrayOfRootPieces(
  solution: Solution
): Array<Record<string, unknown>> {
  const toReturn = new Array<Record<string, unknown>>();

  const rootPieces = solution.GetRootMap().GetValues();
  for (const array of rootPieces) {
    for (const rootPiece of array) {
      toReturn.push({
        name: rootPiece.piece.GetOutput(),
        isAGoalOrAuto: false,
        children: getJsonArrayOfAllSubPieces(rootPiece.piece),
      });
    }
  }
  toReturn.push({
    name: `List of Commands`,
    isAGoalOrAuto: false,
    children: getJsonArrayOfOrderedSteps(solution.GetOrderOfCommands()),
  });
  return toReturn;
}

function getJsonArrayOfAllSubPieces(piece: Piece): Array<unknown> {
  const toReturn = new Array<unknown>();
  let i = -1;
  for (const hint of piece.inputHints) {
    i++;
    const pieceOrNull = piece.inputs[i];
    if (pieceOrNull != null) {
      toReturn.push({
        name: hint,
        isAGoalOrAuto: false,
        children: getJsonArrayOfAllSubPieces(pieceOrNull),
      });
    } else {
      toReturn.push({
        name: hint,
        isAGoalOrAuto: false,
      });
    }
  }
  if (i == -1) {
    toReturn.push({
      name: piece.output,
      isAGoalOrAuto: false,
    });
  }
  return toReturn;
}

function getJsonArrayOfOrderedSteps(
  steps: Array<RawObjectsAndVerb>
): Array<unknown> {
  const toReturn = new Array<unknown>();
  let lastLocation = '';
  for (const step of steps) {
    // big writing about why its bad
    //
    //
    //
    let newLocation = lastLocation; // default to last
    if (step.objectA.startsWith('prop_')) {
      newLocation = step.objectA;
    } else if (step.objectB.startsWith('prop_')) {
      newLocation = step.objectB;
    }

    toReturn.push({
      name: step.AsDisplayString(false),
      isAGoalOrAuto: step.isAGoalOrAuto(),
      paramA: lastLocation,
      paramB: newLocation,
      children: [],
    });
    lastLocation = newLocation;
  }
  return toReturn;
}
