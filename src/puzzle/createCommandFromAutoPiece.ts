import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'

export function createCommandFromAutoPiece (piece: Piece): RawObjectsAndVerb {
  let text = 'auto using ('
  for (const inputName of piece.inputHints) {
    const inputName2: string = inputName
    text += `${inputName2} `
  }
  console.warn(text)

  return new RawObjectsAndVerb(
    Raw.Auto,
    piece.inputHints[0],
    piece.output,
    piece.getRestrictions(),
    piece.type
  )
}
