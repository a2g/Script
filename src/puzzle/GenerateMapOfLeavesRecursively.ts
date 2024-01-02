import { Piece } from './Piece'
import { SpecialTypes } from './SpecialTypes'

export function GenerateMapOfLeavesRecursively (
  piece: Piece,
  path: string,
  map: Map<string, Piece | null>
): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i]
    const inputType = input == null ? 'null' : input.type
    // either set an entry in the leaf map or not...
    switch (inputType) {
      case SpecialTypes.CompletedElsewhere:
      case SpecialTypes.ExistsFromBeginning:
      case SpecialTypes.VerifiedLeaf:
      case 'null':
        map.set(`${path}/${piece.inputHints[i]}`, input)
        break
    }

    // and recurve deeper
    if (input != null) {
      GenerateMapOfLeavesRecursively(
        input,
        `${path}/${piece.inputHints[i]}`,
        map
      )
    }
  }
}
