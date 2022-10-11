import { Piece } from './Piece'
import { SpecialTypes } from './SpecialTypes'

export function GenerateMapOfLeavesRecursively (piece: Piece, path: string, map: Map<string, Piece>): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i]
    if (input != null) {
      if (input.type === SpecialTypes.VerifiedLeaf) { map.set(path + piece.inputHints[i], input) } else { GenerateMapOfLeavesRecursively(input, path + piece.inputHints[i], map) }
    }
  }
}
