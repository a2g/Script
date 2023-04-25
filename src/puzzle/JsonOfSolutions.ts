import { Piece } from './Piece';
import { RootPiece } from './RootPiece';
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
        name: `Solution ${i}`,
        children: this.getJsonArrayOfRootPieces(
          solution.GetRootMap().GetValues()
        ),
      });
    }
    return toReturn;
  }

  private static getJsonArrayOfRootPieces(
    rootPieces: IterableIterator<RootPiece>
  ): Array<Object> {
    const toReturn = new Array<Object>();
    for (let rootPiece of rootPieces) {
      toReturn.push({
        name: rootPiece.piece.GetOutput(),
        children: this.getJsonArrayOfAllSubPieces(rootPiece.piece),
      });
    }
    return toReturn;
  }

  private static getJsonArrayOfAllSubPieces(piece: Piece): Array<Object> {
    const toReturn = new Array<Object>();
    let i = 0;
    for (let hint of piece.inputHints) {
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
    return toReturn;
  }
}
