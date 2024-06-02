import { existsSync } from 'fs'
import { Aggregates } from './Aggregates'
import { Box } from './Box'
import { IsPieceOutputtingAGoal } from './IsPieceOutputtingAGoal'
import { Piece } from './Piece'

export function AddPiece (piece: Piece, folder = '', isNoFile = true, piecesMappedByOutput: Map<string, Set<Piece>>, setOfGoalWords: Set<string>, aggregates: Aggregates): void {
  if (IsPieceOutputtingAGoal(piece)) {
    const goal1 = piece.output
    setOfGoalWords.add(goal1)
    aggregates.setOfGoalStubs.add(goal1)
    // if not file exists for goal name
    // then throw an exception, unless
    //  - xwin
    //  - isNoFile flag ==true
    // this will force addressing whether
    // the problem is due to renaming <-- commonly is!
    // or if it doesn't need one then
    // we force to add isNoFile
    //
    // if we only added a file if it existed
    // then the error would be hidden and
    // would be subtle to discover
    if (goal1 !== 'x_win' && !isNoFile) {
      const file = `${goal1}.jsonc`
      if (!existsSync(folder + file)) {
        throw new Error(
          `Ensure "isNoFile" needs to be marked for goal ${goal1} of ${piece.type} in ${goal1}, because the following file doesn't exist ${folder}`
        )
      }

      let box = aggregates.mapOfBoxes.get(file)
      if (box == null) {
        /* this map not only collects all the boxes */
        /* but prevents two pieces that output same goal from */
        /* processing the same file */
        box = new Box(folder, [file])
        aggregates.mapOfBoxes.set(file, box)
      }
      piece.boxToMerge = box
    }
  }

  // initialize array, if it hasn't yet been
  if (!piecesMappedByOutput.has(piece.output)) {
    piecesMappedByOutput.set(piece.output, new Set<Piece>())
  }
  piecesMappedByOutput.get(piece.output)?.add(piece)

  // do the same again with aggregates
  if (!aggregates.piecesMapped.has(piece.output)) {
    aggregates.piecesMapped.set(piece.output, new Set<Piece>())
  }
  aggregates.piecesMapped.get(piece.output)?.add(piece)
}
