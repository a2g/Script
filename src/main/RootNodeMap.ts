import { GenerateMapOfLeavesRecursively } from '../main/GenerateMapOfLeavesRecursively'
import { Piece } from './Piece'
/**
 * Yes, the only data here is the map.
 *
 * This is the source repository of the solution nodes
 */
export class RootNodeMap {
  private readonly goals: Piece[]
  private readonly names: string[]

  constructor (deepCopyFromMe: RootNodeMap | null, incompleteNodes: Set<Piece>) {
    this.goals = []
    this.names = []
    if (deepCopyFromMe != null) {
      for (const node of deepCopyFromMe.goals.values()) {
        const clonedTree = node.CloneNodeAndEntireTree(incompleteNodes)
        this.goals.push(clonedTree)
      }
    }
  }

  CloneAllRootNodesAndTheirTrees (incompleteNodes: Set<Piece>): RootNodeMap {
    return new RootNodeMap(this, incompleteNodes)
  }

  Has (goalToObtain: string): boolean {
    for (const goal of this.goals) {
      if (goal.output === goalToObtain) { return true }
    }

    return false
  }

  Get (goalToObtain: string): Piece | null {
    for (const goal of this.goals) {
      if (goal.output === goalToObtain) { return goal }
    }
    return null
  }

  GetKeys (): string[] {
    return this.names
  }

  AddRootNode (t: Piece): void {
    // always add to list
    this.goals.push(t)
    this.names.push(t.output)
  }

  Size (): number {
    return this.goals.length
  }

  GetRootNodeByName (name: string): Piece {
    const root = this.Get(name)
    if (typeof root === 'undefined' || root === null) { throw new Error("rootNode of that name doesn't exist") }
    return root
  }

  GetValues (): Piece[] {
    return this.goals
  }

  GetAt (index: number): Piece {
    return this.goals[index]
  }

  public GenerateMapOfLeaves (): Map<string, Piece> {
    const map = new Map<string, Piece>()

    for (const rootNode of this.GetValues()) {
      GenerateMapOfLeavesRecursively(rootNode, rootNode.output, map)
    }

    return map
  }
}
