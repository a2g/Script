import { Piece } from './Piece'

export function GenerateArrayOfLeavesRecursively (piece: Piece): Piece[] {
  let array: Piece[] = []
  let isNoInputs = true
  for (const input of piece.inputs) {
    if (input != null) {
      isNoInputs = false
      const tempArray = GenerateArrayOfLeavesRecursively(input)
      array = array.concat(tempArray)
    }
  }

  if (isNoInputs) {
    array.push(piece)
  }

  return array
}
