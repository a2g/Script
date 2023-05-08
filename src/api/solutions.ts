import { Piece } from '../puzzle/Piece';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
import { Solution } from '../puzzle/Solution';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';

export function solutions(solver: SolverViaRootPiece): Object {
  return {
    name: 'solutions',
    children: getJsonArrayOfSolutions(solver.GetSolutions()),
  };
}

function getJsonArrayOfSolutions(solutions: Solution[]): Array<Object> {
  const toReturn = new Array<Object>();
  let i = 0;
  for (let solution of solutions) {
    i += 1;
    toReturn.push({
      name: `Puzzle Graph ${i}`,
      children: getJsonArrayOfRootPieces(solution),
    });
  }

  return toReturn;
}

function getJsonArrayOfRootPieces(solution: Solution): Array<Object> {
  const toReturn = new Array<Object>();

  const rootPieces = solution.GetRootMap().GetValues();
  for (let rootPiece of rootPieces) {
    toReturn.push({
      name: rootPiece.piece.GetOutput(),
      isAGoal: false,
      children: getJsonArrayOfAllSubPieces(rootPiece.piece),
    });
  }
  toReturn.push({
    name: `Solution`,
    isAGoal: false,
    children: getJsonArrayOfOrderedSteps(solution.GetOrderOfGoals()),
  });
  return toReturn;
}

function getJsonArrayOfAllSubPieces(piece: Piece): Array<Object> {
  const toReturn = new Array<Object>();
  let i = -1;
  for (let hint of piece.inputHints) {
    i++;
    let pieceOrNull = piece.inputs[i];
    if (pieceOrNull != null) {
      toReturn.push({
        name: hint,
        isAGoal: false,
        children: getJsonArrayOfAllSubPieces(pieceOrNull),
      });
    } else {
      toReturn.push({
        name: hint,
        isAGoal: false,
      });
    }
  }
  if (i == -1) {
    toReturn.push({
      name: piece.output,
      isAGoal: false,
    });
  }
  return toReturn;
}

function getJsonArrayOfOrderedSteps(
  steps: Array<RawObjectsAndVerb>
): Array<Object> {
  const toReturn = new Array<Object>();
  let lastLocation = '';
  for (let step of steps) {
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
      isAGoal: step.isAGoal(),
      paramA: lastLocation,
      paramB: newLocation,
      children: [],
    });
    lastLocation = newLocation;
  }
  return toReturn;
}
