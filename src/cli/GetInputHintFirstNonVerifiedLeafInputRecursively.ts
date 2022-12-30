import { Piece } from '../puzzle/Piece';
import { SpecialTypes } from '../puzzle/SpecialTypes';

export function GetInputHintFirstNonVerifiedLeafInputRecursively(
  piece: Piece,
  path: string,
  map: Map<string, Piece>
): string | null {
  for (let i = 0; i < piece.inputs.length; i++) {
    const input = piece.inputs[i];
    if (input != null) {
      if (input.type === SpecialTypes.VerifiedLeaf) {
        map.set(path + piece.inputHints[i], input);
      } else {
        const result = GetInputHintFirstNonVerifiedLeafInputRecursively(
          input,
          path + piece.inputHints[i],
          map
        );
        // valid  input hint? that means we short circuit and return it
        if (result != null && result.length > 0) {
          return result;
        }
      }
    } else {
      return piece.inputHints[i];
    }
  }

  // returning null is the good thing
  return null;
}
