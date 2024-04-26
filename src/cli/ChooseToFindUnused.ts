import { Box } from '../puzzle/Box'
import { Piece } from '../puzzle/Piece'

export function ChooseToFindUnused (box: Box): void {
  const invs = box.GetArrayOfInvs()
  const props = box.GetArrayOfProps()
  // eslint-disable-next-line no-undef
  const it: IterableIterator<Set<Piece>> = box.GetPieceIterator()

  for (const set of it) {
    for (const piece of set) {
      // In order to process the output with all the inputs
      // we put it in the list of inputs, and simple process the inputs.
      piece.inputHints.push(piece.output)
      piece.inputs.push(null)
      for (const inputName of piece.inputHints) {
        const invIndex = invs.indexOf(inputName)
        if (invIndex >= 0) {
          invs.splice(invIndex, 1)
        }
        const propIndex = props.indexOf(inputName)
        if (propIndex > 0) {
          props.splice(propIndex, 1)
        }
      }
    }
  }

  console.warn('Unused props:')
  props.forEach((name: string) => {
    console.warn(name)
  })

  console.warn('Unused invs:')
  invs.forEach((name: string) => {
    console.warn(name)
  })
}
