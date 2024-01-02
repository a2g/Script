import promptSync from 'prompt-sync'
import { Piece } from '../puzzle/Piece'
import { RootPieceMap } from '../puzzle/RootPieceMap'
const prompt = promptSync({ sigint: true })

export function NavigatePieceRecursive (
  piece: Piece,
  rootPieceMap: RootPieceMap
): void {
  for (;;) {
    const output: string = piece.output
    console.warn(`output: ${output}`)
    const targets = new Array<Piece | null>()
    for (let i = 0; i < piece.inputs.length; i++) {
      targets.push(piece.inputs[i])
      const inputHint: string = piece.inputHints[i]
      console.warn(`input: ${i + 1}. ${inputHint}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an input to dig down on or (b)ack: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= targets.length) {
        const result = targets[theNumber - 1]
        if (result != null) {
          NavigatePieceRecursive(result, rootPieceMap)
        } else {
          prompt('THAT WAS NULL. Hit any key to continue: ')
        }
      } else {
        prompt('OUT OF RANGE. Hit any key to continue: ')
      }
    }
  }
}
