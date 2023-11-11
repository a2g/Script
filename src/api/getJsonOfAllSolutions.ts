import { existsSync } from 'fs';
import { Suffix } from '../../Suffix';
import { Box } from '../puzzle/Box';
import { FormatText } from '../puzzle/FormatText';
import { Piece } from '../puzzle/Piece';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
import { Solution } from '../puzzle/Solution';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';

interface $INameIsAGoalChildren {
  name: string;
  isAGoalOrAuto: boolean;
  children: Array<Record<string, unknown>>;
}

export function getJsonOfAllSolutions(
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = `../${repo}/${world}/`;
  const firstBoxFilename = `${area}${Suffix.FirstBox}.jsonc`;

  if (!existsSync(path + firstBoxFilename)) {
    throw Error(
      `file doesn't exist ${path}${firstBoxFilename} ${process.cwd()}`
    );
  }

  const firstBox = new Box(path, firstBoxFilename);
  firstBox.Init();

  const allBoxes = new Set<Box>();
  firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
  const solver = new SolverViaRootPiece(firstBox);

  for (let i = 0; i < 40; i++) {
    solver.SolvePartiallyUntilCloning();
    solver.MarkGoalsAsCompletedAndMergeIfNeeded();
    const numberOfSolutions: number = solver.NumberOfSolutions();
    console.warn('Dig in to goals');
    console.warn('===============');
    console.warn(`Number of solutions in solver = ${numberOfSolutions}`);

    // display list
    let incomplete = 0;
    let listItemNumber = 0;
    for (const solution of solver.GetSolutions()) {
      console.warn(FormatText(solution.GetDisplayNamesConcatenated()));
      console.warn(FormatText(solution.GetRootMap().CalculateListOfKeys()));
      for (const array of solution.GetRootMap().GetValues()) {
        for (const item of array) {
          listItemNumber++;

          // display list item
          const status: string = item.firstNullInput;
          const { output } = item.piece;
          console.warn(`    ${listItemNumber}. ${output} (status=${status})`);
          incomplete += status.length > 0 ? 1 : 0;
        }
      }
    }

    console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`);
    if (incomplete >= listItemNumber) {
      break;
    }
  }
  const json = getJsonOfSolutionsFromSolver(solver);
  return json;
}

function getJsonOfSolutionsFromSolver(
  solver: SolverViaRootPiece
): Record<string, unknown> {
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
