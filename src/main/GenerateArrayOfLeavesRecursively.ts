import { SolutionNode } from 'jigsaw/SolutionNode'

export function GenerateArrayOfLeavesRecursively(node: SolutionNode): SolutionNode[] {
  let array: Array<SolutionNode> = []
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
