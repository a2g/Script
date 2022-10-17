import { Box } from './Box.js'
import { Happener } from './Happener.js'
import { PileOfPieces } from './PileOfPieces.js'
import _ from '../../jigsaw.json'

export function ProcessAutos (happener: Happener, solutionPieceMap: PileOfPieces): void {
  const flags = happener.GetCurrentlyTrueFlags()
  const invs = happener.GetCurrentVisibleInventory()
  const props = happener.GetCurrentVisibleProps()

  const autos = solutionPieceMap.GetAutos()
  for (const piece of autos) {
    if (piece.type === _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON) {
      const box = new Box(piece.output)
      box.CopyPiecesFromBoxToPile(solutionPieceMap)
      happener.MergeNewThingsFromScene(box)
      continue
    }
    let numberSatisified = 0
    for (const inputName of piece.inputHints) {
      if (inputName.startsWith('prop_')) {
        if (props.includes(inputName)) {
          numberSatisified = numberSatisified + 1
        }
      } else if (inputName.startsWith('inv_')) {
        if (invs.includes(inputName)) {
          numberSatisified++
        }
      } else if (inputName.startsWith('flag_')) {
        if (flags.includes(inputName)) {
          numberSatisified++
        }
      }
    };
    if (numberSatisified === piece.inputHints.length) {
      if (piece.output.startsWith('prop_')) {
        console.log('Auto: prop set visible ' + piece.output)
        happener.SetPropVisible(piece.output, true)
      } else if (piece.output.startsWith('flag_')) {
        console.log('Auto: flag set to true ' + piece.output)
        happener.SetFlagValue(piece.output, 1)
      } else if (piece.output.startsWith('inv_')) {
        console.log('Auto: inv set to visible ' + piece.output)
        happener.SetInvVisible(piece.output, true)
      }
    }
  }
}
