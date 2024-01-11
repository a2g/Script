import { Piece } from './Piece'
import { SpecialTypes } from './SpecialTypes'

/**
 * #### Description
 * Drills down on a piece, and generates map of leaves tracing goals recursively.
 * The difference between this and @ref GenerateMapOfLeavesTracingGoalsRecursively
 * is that this one drills down on pieces of type CompletedElsewhere - this
 * other one does not.
 * #### Example
 * GenerateMapOfLeavesTracingGoalsRecursively(
       winGoal.piece,
       '99_win',
       true
       leaves
     )
 * #### Links
 * See also @ref GenerateMapOfLeavesTracingGoalsRecursively
 * @param piece piece the piece to drill down on
 * @param path this is a helper for telling where we are in the recursion
 * @param isOnlyNulls this was the cause of a very hard to find bug in solving!
 * @param map any discovered leaves are put in here, keyed by path
 */

export function GenerateMapOfLeavesRecursively (
  piece: Piece,
  path: string,
  isOnlyNulls: boolean,
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
        if (isOnlyNulls && inputType != null) {
          continue
        }
        map.set(`${path}/${piece.inputHints[i]}`, input)
        break
    }

    // and recurve deeper
    if (input != null) {
      GenerateMapOfLeavesRecursively(
        input,
        `${path}/${piece.inputHints[i]}`,
        isOnlyNulls,
        map
      )
    }
  }
}
