import { Piece } from './Piece';
import { RootPiece } from './RootPiece';
import { Solution } from './Solution';
import { SolverViaRootPiece } from './SolverViaRootPiece';

export class JsonOfSolutions {
  static getJsonObjectContainingSolutions(solver: SolverViaRootPiece): Object {
    const jsonArray = {
      solutions: this.getJsonArrayOfSolutions(solver.GetSolutions()),
    };
    return jsonArray;
  }

  private static getJsonArrayOfSolutions(solutions: Solution[]): Array<Object> {
    const toReturn = new Array<Object>();
    let i = 0;
    for (let solution of solutions) {
      i += 1;
      toReturn.push({
        solutionName: `Solution ${i}`,
        rootNodes: this.getJsonArrayOfRootPieces(
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
        firstNullInput: rootPiece.piece.GetOutput(),
        inputs: this.getJsonArrayOfAllSubPieces(rootPiece.piece),
      });
    }
    return toReturn;
  }

  private static getJsonArrayOfAllSubPieces(piece: Piece): Array<Object> {
    const toReturn = new Array<Object>();
    let i = 0;
    for (let hintName of piece.inputHints) {
      let pieceOrNull = piece.inputs[i];
      if (pieceOrNull != null) {
        toReturn.push({
          hintName: hintName,
          children: this.getJsonArrayOfAllSubPieces(pieceOrNull),
        });
      } else {
        toReturn.push({
          hintName: hintName,
        });
      }
    }
    return toReturn;
  }
}
