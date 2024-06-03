import promptSync from 'prompt-sync'
import { Piece } from '../puzzle/Piece'
import { VisibleThingsMap } from '../puzzle/VisibleThingsMap'
import { Validator } from '../puzzle/Validator'
import { GoalStub } from '../puzzle/GoalStub'
const prompt = promptSync({ sigint: true })

export function ValidatePieceRecursive (
  piece: Piece,
  validator: Validator,
  goalStub: GoalStub, visibleThings: VisibleThingsMap
): void {
  for (; ;) {
    const id = piece.id
    const output: string = piece.spielOutput > piece.output ? piece.spielOutput : piece.output
    console.warn(`output: ${output} id: ${id}`)
    const targets = new Array<Piece | null>()
    for (let i = 0; i < piece.inputs.length; i++) {
      targets.push(piece.inputs[i])
      const inputSpiel: string = piece.inputSpiels[i]
      console.warn(`input: ${i + 1}. ${inputSpiel}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an input to dig down on or (s)tarting things, (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'r') {
      validator.DeconstructGivenGoalAndRecordSteps(goalStub)
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
          ValidatePieceRecursive(result, validator, goalStub, visibleThings)
        } else {
          prompt('THAT WAS NULL. Hit any key to continue: ')
        }
      } else {
        prompt('OUT OF RANGE. Hit any key to continue: ')
      }
    }
  }
}
