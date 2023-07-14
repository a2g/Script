import { Piece } from './Piece';
import { SpecialTypes } from './SpecialTypes';

export function GenerateMapOfLeavesRecursively(
  piece: Piece,
  path: string,
  map: Map<string, Piece | null>,
  isSettingMapOnNull: boolean = true
): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i];
    if (input != null || isSettingMapOnNull) {
      switch (input != null ? input.type : 'null') {
        case SpecialTypes.CompletedElsewhere:
        case SpecialTypes.ExistsFromBeginning:
        case SpecialTypes.VerifiedLeaf:
        case 'null':
          if (isSettingMapOnNull) {
            map.set(`${path}/${piece.inputHints[i]}`, input);
            break;
          }
      }
    }

    if (input != null) {
      GenerateMapOfLeavesRecursively(
        input,
        `${path}/${piece.inputHints[i]}`,
        map,
        true
      );
    }
  }
}
