import { Piece } from './Piece'

export function GenerateArrayOfLeavesRecursively(node: Piece): Piece[] {
  let array: Piece[] = []
  let isNoInputs = true
  for (const input of node.inputs) {
    if (input != null) {
      isNoInputs = false
      const tempArray = GenerateArrayOfLeavesRecursively(input)
      array = array.concat(tempArray)
    }
  }

  if (isNoInputs) {
    array.push(node)
  }

  return array
}
