import { Piece } from './Piece';
import { SpecialTypes } from './SpecialTypes';

export function GenerateMapOfLeavesRecursively(
  piece: Piece,
  path: string,
  map: Map<string, Piece | null>
): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i];
    switch (input != null ? input.type : 'null') {
      case SpecialTypes.CompletedElsewhere:
      case SpecialTypes.ExistsFromBeginning:
      case SpecialTypes.VerifiedLeaf:
        if (!piece.output.startsWith('goal')) {
          map.set(`${path}/${piece.inputHints[i]}`, piece);
        }
        break;
      default:
        if (input != null) {
          GenerateMapOfLeavesRecursively(
            input,
            `${path}/${piece.inputHints[i]}`,
            map
          );
        }
    }
  }
}
