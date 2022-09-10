import { ReadOnlyJsonSingle } from './ReadOnlyJsonSingle'
import { SolutionNode } from './SolutionNode'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution nodes
 */
export class SolutionNodeRepository {
  private readonly solutionNodeMap: Map<string, Set<SolutionNode>>

  constructor (cloneFromMe: SolutionNodeRepository | null) {
    this.solutionNodeMap = new Map<string, Set<SolutionNode>>()
    if (cloneFromMe != null) {
      for (const set of cloneFromMe.solutionNodeMap.values()) {
        if (set.size > 0) {
          const clonedSet = new Set<SolutionNode>()
          const throwawaySet = new Set<SolutionNode>()
          let outputName = ''
          for (const node of set) {
            const clonedNode = node.CloneNodeAndEntireTree(throwawaySet)
            clonedSet.add(clonedNode)
            outputName = clonedNode.output
          }
          this.solutionNodeMap.set(outputName, clonedSet)
        }
      }
    }
  }

  GetAutos (): SolutionNode[] {
    const toReturn = new Array<SolutionNode>()
    this.solutionNodeMap.forEach((value: Set<SolutionNode>) => {
      value.forEach((node: SolutionNode) => {
        if (node.type.startsWith('AUTO')) {
          toReturn.push(node)
        }
      })
    })
    return toReturn
  }

  HasAnyNodesThatOutputObject (objectToObtain: string): boolean {
    return this.solutionNodeMap.has(objectToObtain)
  }

  GetNodesThatOutputObject (objectToObtain: string): Set<SolutionNode> | undefined {
    return this.solutionNodeMap.get(objectToObtain)
  }

  Has (objectToObtain: string): boolean {
    return this.solutionNodeMap.has(objectToObtain)
  }

  Get (objectToObtain: string): Set<SolutionNode> | undefined {
    return this.solutionNodeMap.get(objectToObtain)
  }

  GetValues (): IterableIterator<Set<SolutionNode>> {
    return this.solutionNodeMap.values()
  }

  AddToMap (t: SolutionNode): void {
    // initiatize array, if it hasn't yet been
    if (!this.solutionNodeMap.has(t.output)) {
      this.solutionNodeMap.set(t.output, new Set<SolutionNode>())
    }
    // always add to list
    this.solutionNodeMap.get(t.output)?.add(t)
  }

  RemoveNode (node: SolutionNode): void {
    if (node.count - 1 <= 0) {
      const key = node.output
      if (this.solutionNodeMap.has(key)) {
        const oldSet = this.solutionNodeMap.get(key)
        if (oldSet != null) {
          // console.log(" old size = "+oldSet.size);
          oldSet.delete(node)
          // console.log(" newSize = "+oldSet.size);
        }
      } else {
        node.count--
        console.log(`trans.count is now ${node.count}`)
      }
    }
  }

  Size (): number {
    let count = 0
    for (const set of this.solutionNodeMap.values()) {
      count += set.size
    }
    return count
  }

  MergeInNodesFromScene (json: ReadOnlyJsonSingle): void {
    json.AddAllSolutionNodesToGivenMap(this)
  }

  ContainsId (idToMatch: number): boolean {
    for (const set of this.solutionNodeMap.values()) {
      for (const node of set) {
        if (node.id === idToMatch) { return true }
      }
    }
    return false
  }
}
