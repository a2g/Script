import promptSync from 'prompt-sync'
import { Piece } from '../../puzzle/Piece'
import { VisibleThingsMap } from '../../puzzle/VisibleThingsMap'
import { Validator } from '../../puzzle/Validator'
import { AchievementStub } from '../../puzzle/AchievementStub'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
const prompt = promptSync({ sigint: true })

export function PieceDeconstructionView (
  piece: Piece,
  validator: Validator,
  stub: AchievementStub, visibleThings: VisibleThingsMap, titlePath: string[]
): void {
  titlePath.push('Piece(Deconstruct)')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    console.warn(`Pieces remaining ${validator.GetNumberOfRemainingPieces()} (${validator.GetRemainingPiecesAsString()})`)
    // const output: string = (piece.spielOutput.length > piece.output.length) ? piece.spielOutput : piece.output
    const output = (piece.parent == null) ? '(stub)' : piece.output
    console.warn(`id: ${piece.id}`)
    console.warn(`output: ${output}`)
    console.warn(`type: ${piece.type}`)
    const targets = new Array<Piece | null>()
    for (let i = 0; i < piece.inputs.length; i++) {
      targets.push(piece.inputs[i])
      const inputSpiel: string = piece.inputSpiels[i]
      const type: string = piece.type
      console.warn(`input: ${i + 1}. ${inputSpiel} ${type}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an input to climb up into or (s)tarting things, (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'r') {
      validator.DeconstructGivenStubAndRecordSteps(stub)
    } else if (input === 's') {
      for (const item of visibleThings.GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= targets.length) {
        const result = targets[theNumber - 1]
        if (result != null) {
          PieceDeconstructionView(result, validator, stub, visibleThings, [...titlePath])
        } else {
          prompt('THAT WAS NULL. Hit any key to continue: ')
        }
      } else {
        prompt('OUT OF RANGE. Hit any key to continue: ')
      }
    }
  }
}
