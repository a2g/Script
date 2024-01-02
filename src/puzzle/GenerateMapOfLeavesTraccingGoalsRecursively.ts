import { Piece } from './Piece'
import { RootPieceMap } from './RootPieceMap'
import { SpecialTypes } from './SpecialTypes'

export function GenerateMapOfLeavesTracingGoalsRecursively (
  piece: Piece,
  path: string,
  map: Map<string, Piece | null>,
  rootPieceMap: RootPieceMap
): void {
  for (let i = 0; i < piece.inputs.length; i += 1) {
    const input = piece.inputs[i]
    const inputType = input == null ? 'null' : input.type
    // either set an entry in the leaf map or not...
    switch (inputType) {
      case SpecialTypes.CompletedElsewhere: {
        const goals = rootPieceMap.GetRootPieceArrayByName(piece.inputHints[i])
        // Generating name ran may have to multiple with same name');
        for (const goal of goals) {
          GenerateMapOfLeavesTracingGoalsRecursively(
            goal.piece,
            goal.piece.GetOutput(),
            map,
            rootPieceMap
          )
        }
        break
      }
      case SpecialTypes.ExistsFromBeginning:
      case SpecialTypes.VerifiedLeaf:
      case 'null':
        map.set(`${path}/${piece.inputHints[i]}`, input)
        break
    }

    // and recurve deeper
    if (input != null) {
      GenerateMapOfLeavesTracingGoalsRecursively(
        input,
        `${path}/${piece.inputHints[i]}`,
        map,
        rootPieceMap
      )
    }
  }
}
