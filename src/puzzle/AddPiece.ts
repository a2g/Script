import { existsSync } from 'fs'
import { Aggregates } from './Aggregates'
import { Box } from './Box'
import { IsPieceOutputtingAAchievement } from './IsPieceOutputtingAAchievement'
import { Piece } from './Piece'
import { A_WIN } from '../A_WIN'
import { _STARTER } from '../_STARTER'

export function AddPiece (piece: Piece, folder = '', isNoFile = true, box: Box, aggregates: Aggregates): void {
  if (IsPieceOutputtingAAchievement(piece)) {
    const achievementAchievement = piece.output
    box.GetSetOfAchievementWords().add(achievementAchievement)
    aggregates.setOfachievementAchievements.add(achievementAchievement)
    // if not file exists for achievement name
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
    if (achievementAchievement !== A_WIN && !isNoFile) {
      const file = `${achievementAchievement}.jsonc`
      if (!existsSync(folder + file)) {
        throw new Error(
          `Ensure "isNoFile" needs to be marked for achievement ${achievementAchievement} of ${piece.type} in ${achievementAchievement}, because the following file doesn't exist ${folder}`
        )
      }

      let childBox = aggregates.mapOfBoxes.get(file)
      if (childBox == null) {
        /* this map not only collects all the boxes */
        /* but prevents two pieces that output same achievement from */
        /* processing the same file */
        childBox = new Box(folder, file, aggregates)
      }
      piece.boxToMerge = childBox
    }
  }

  // add more connections in the dependency tree
  const nameOfBox = box.GetFileNameWithoutExtension()
  if (nameOfBox !== _STARTER && nameOfBox != null) {
    piece.inputHints.push(nameOfBox)
    piece.inputs.push(null)
  }

  // initialize array, if it hasn't yet been
  if (!box.GetPieces().has(piece.output)) {
    box.GetPieces().set(piece.output, new Set<Piece>())
  }
  box.GetPieces().get(piece.output)?.add(piece)

  // do the same again with aggregates
  if (!aggregates.piecesMapped.has(piece.output)) {
    aggregates.piecesMapped.set(piece.output, new Set<Piece>())
  }
  aggregates.piecesMapped.get(piece.output)?.add(piece)
}
