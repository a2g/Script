import { Piece } from './Piece'
import { SpecialTypes } from './SpecialTypes'

export function GenerateMapOfLeavesRecursively (piece: Piece, path: string, map: Map<string, Piece>): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i]
    if (input != null) {
      switch (input.type) {
        case SpecialTypes.GoalExistsAndCompleted:
        case SpecialTypes.StartingThings:
        case SpecialTypes.TempGoalWasntCompleteDontStubThisOut:
        case SpecialTypes.VerifiedLeaf:
        case SpecialTypes.ZeroMatches:
          map.set(path + piece.inputHints[i], input)
          break
        default:
          GenerateMapOfLeavesRecursively(input, path + piece.inputHints[i], map)
      }
    }
  }
}
