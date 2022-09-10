import { SolutionNode } from './SolutionNode'

export function GenerateArrayOfLeavesRecursively (node: SolutionNode/*, path: string */): SolutionNode[] {
  let array = new Array<SolutionNode>()
  let isNoInputs = true
  for (const input of node.inputs) {
    if (input != null) {
      isNoInputs = false
      const tempArray = GenerateArrayOfLeavesRecursively(input/*, path + node.inputHints[i] */)
      array = array.concat(tempArray)
    }
  }

  if (isNoInputs) {
    array.push(node)
  }

  return array
}
