import { Piece } from './Piece';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Solution } from './Solution';
import { SolverViaRootPiece } from './SolverViaRootPiece';

export class JsonOfSolutions {
  static getJsonObjectContainingSolutions(solver: SolverViaRootPiece): Object {
    return {
      name: 'solutions',
      children: this.getJsonArrayOfSolutions(solver.GetSolutions()),
    };
  }

  private static getJsonArrayOfSolutions(solutions: Solution[]): Array<Object> {
    const toReturn = new Array<Object>();
    let i = 0;
    for (let solution of solutions) {
      i += 1;
      toReturn.push({
        name: `Puzzle Graph ${i}`,
        children: this.getJsonArrayOfRootPieces(solution),
      });
    }

    return toReturn;
  }

  private static getJsonArrayOfRootPieces(solution: Solution): Array<Object> {
    const toReturn = new Array<Object>();

    const rootPieces = solution.GetRootMap().GetValues();
    for (let rootPiece of rootPieces) {
      toReturn.push({
        name: rootPiece.piece.GetOutput(),
        children: this.getJsonArrayOfAllSubPieces(rootPiece.piece),
      });
    }
    toReturn.push({
      name: `Solution`,
      children: this.getJsonArrayOfOrderedSteps(solution.GetOrderOfGoals()),
    });
    return toReturn;
  }

  private static getJsonArrayOfAllSubPieces(piece: Piece): Array<Object> {
    const toReturn = new Array<Object>();
    let i = -1;
    for (let hint of piece.inputHints) {
      i++;
      let pieceOrNull = piece.inputs[i];
      if (pieceOrNull != null) {
        toReturn.push({
          name: hint,
          children: this.getJsonArrayOfAllSubPieces(pieceOrNull),
        });
      } else {
        toReturn.push({
          name: hint,
        });
      }
    }
    if (i == -1) {
      toReturn.push({
        name: piece.output,
      });
    }
    return toReturn;
  }

  private static getJsonArrayOfOrderedSteps(
    steps: Array<RawObjectsAndVerb>
  ): Array<Object> {
    const toReturn = new Array<Object>();
    for (let step of steps) {
      toReturn.push({
        name: step.AsDisplayString(false),
        children: [],
      });
    }
    return toReturn;
  }
}
