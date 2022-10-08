import { existsSync } from 'fs'
import { SolverViaRootNode } from '../main/SolverViaRootNode.js'
import { SolutionNode } from '../main/SolutionNode.js'
import { SpecialNodes } from '../main/SpecialNodes.js'
import { SolutionNodeRepository } from '../main/SolutionNodeRepository.js'
import { ReadOnlyJsonSingle } from '../main/ReadOnlyJsonSingle.js'
import { FormatText } from '../main/FormatText.js'
import { RootNodeMap } from '../main/RootNodeMap.js'
import _ from '../../jigsaw.json'

/**
 * Solution needs to be cloned.
 */
export class Solution {
  // non aggregates
  private readonly solutionNames: string[]

  goals: RootNodeMap

  remainingNodesRepo: SolutionNodeRepository

  isArchived: boolean

  // aggregates
  unprocessedLeaves: Set<SolutionNode>

  startingThings: ReadonlyMap<string, Set<string>> // this is updated dynamically in GetNextDoableCommandAndDesconstructTree

  readonly restrictionsEncounteredDuringSolving: Set<string>

  constructor (
    rootNodeMapToCopy: RootNodeMap | null,
    copyThisMapOfPieces: SolutionNodeRepository,
    startingThingsPassedIn: ReadonlyMap<string, Set<string>>,
    restrictions: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.unprocessedLeaves = new Set<SolutionNode>()
    this.goals = new RootNodeMap(rootNodeMapToCopy, this.unprocessedLeaves)

    this.remainingNodesRepo = new SolutionNodeRepository(copyThisMapOfPieces)
    this.isArchived = false

    // if it is passed in, we deep copy it
    this.solutionNames = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solutionNames.push(segment)
      }
    }

    // its its passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>()
    if (restrictions != null) {
      for (const restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction)
      }
    }

    // this is readonly so we don't copy it
    this.startingThings = startingThingsPassedIn
  }

  public AddRootNode (rootNode: SolutionNode): void {
    this.goals.AddRootNode(rootNode)
    this.unprocessedLeaves.add(rootNode)
  }

  FindTheFlagWinAndPutItInRootNodeMap (): void {
    const flagWinSet = this.remainingNodesRepo.Get('flag_win')
    if (flagWinSet === undefined) {
      throw new Error('flag_win was undefined')
    }
    if (flagWinSet.size !== 1) {
      throw new Error('flag_win was not equal to 1')
    }
    for (const flagWin of flagWinSet) {
      this.AddRootNode(flagWin)
    }
  }

  Clone (): Solution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root node is needed..
    // so we clone the whole tree and pass it in
    const incompleteNodes = new Set<SolutionNode>()
    const clonedRootNodeMap =
      this.goals.CloneAllRootNodesAndTheirTrees(incompleteNodes)
    this.goals.GetRootNodeByName('flag_win').id =
      this.goals.GetRootNodeByName('flag_win').id // not sure why do this, but looks crucial!
    const clonedSolution = new Solution(
      clonedRootNodeMap,
      this.remainingNodesRepo,
      this.startingThings,
      this.restrictionsEncounteredDuringSolving,
      this.solutionNames
    )
    clonedSolution.SetIncompleteNodes(incompleteNodes)
    return clonedSolution
  }

  SetNodeIncomplete (node: SolutionNode | null): void {
    if (node != null) {
      if (node.type !== SpecialNodes.VerifiedLeaf) {
        this.unprocessedLeaves.add(node)
      }
    }
  }

  MarkNodeAsCompleted (node: SolutionNode | null): void {
    if (node != null) {
      if (this.unprocessedLeaves.has(node)) {
        this.unprocessedLeaves.delete(node)
      }
    }
  }

  SetIncompleteNodes (set: Set<SolutionNode>): void {
    // safer to copy this - just being cautious
    this.unprocessedLeaves = new Set<SolutionNode>()
    for (const node of set) {
      this.unprocessedLeaves.add(node)
    }
  }

  IsAnyNodesUnprocessed (): boolean {
    return this.unprocessedLeaves.size > 0
  }

  ProcessUntilCloning (solutions: SolverViaRootNode): boolean {
    let isBreakingDueToSolutionCloning = false
    let max = this.goals.Size()
    for (let i = 0; i < max; i += 1) {
      const goal = this.goals.GetAt(i)
      if (goal.ProcessUntilCloning(this, solutions, '/')) {
        isBreakingDueToSolutionCloning = true
        break
      }
      max = this.goals.Size()
    }

    if (!isBreakingDueToSolutionCloning) {
      // then this means the root node has rolled to completion
      this.unprocessedLeaves.clear()
    }
    return isBreakingDueToSolutionCloning
  }

  GetUnprocessedLeaves (): Set<SolutionNode> {
    return this.unprocessedLeaves
  }

  GetFlagWin (): SolutionNode {
    return this.goals.GetRootNodeByName('flag_win')
  }

  HasAnyNodesThatOutputObject (objectToObtain: string): boolean {
    return this.remainingNodesRepo.Has(objectToObtain)
  }

  GetNodesThatOutputObject (objectToObtain: string): SolutionNode[] | undefined {
    // since the remainingNodes are a map index by output node
    // then a remainingNodes.Get will retrieve all matching nodes.
    const result: Set<SolutionNode> | undefined =
      this.remainingNodesRepo.Get(objectToObtain)
    if (result != null) {
      const blah: SolutionNode[] = []
      for (const item of result) {
        if (item.count >= 1) {
          const twin = item.conjoint

          // I see what I've done here.
          // In the case of conjoint then there would be two items
          //  returned that are actually joined.
          // in this case, we HACK it to return only one. This needs to change.
          // TODO: fix the above
          if (twin === 0) {
            blah.push(item)
          } else if (this.remainingNodesRepo.ContainsId(twin)) {
            blah.push(item)
          }
        }
      }
      return blah
    }
    return []
  }

  RemoveNode (node: SolutionNode): void {
    this.remainingNodesRepo.RemoveNode(node)
  }

  PushNameSegment (solutionName: string): void {
    this.solutionNames.push(solutionName)
  }

  GetDisplayNamesConcatenated (): string {
    let result = ''
    for (let i = 0; i < this.solutionNames.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solutionNames[i])
    }
    return result
  }

  AddRestrictions (restrictions: string[]): void {
    for (const restriction of restrictions) {
      this.restrictionsEncounteredDuringSolving.add(restriction)
    }
  }

  GetAccumulatedRestrictions (): Set<string> {
    return this.restrictionsEncounteredDuringSolving
  }

  GetRepoOfRemainingNodes (): SolutionNodeRepository {
    // we already remove nodes from this when we use them up
    // so returning the current node map is ok
    return this.remainingNodesRepo
  }

  MergeInNodesForChapterCompletion (goalFlag: string): void {
    const autos = this.remainingNodesRepo.GetAutos()
    for (const node of autos) {
      // find the auto that imports json
      if (node.inputHints[0] === goalFlag) {
        if (node.type === _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON) {
          if (existsSync(node.output)) {
            const json = new ReadOnlyJsonSingle(node.output)
            this.remainingNodesRepo.MergeInNodesFromScene(json)
          }
        }
      }
    }
  }

  GetMapOfVisibleThings (): ReadonlyMap<string, Set<string>> {
    return this.startingThings
  }

  SetAsArchived (): void {
    this.isArchived = true
  }

  IsArchived (): boolean {
    return this.isArchived
  }

  GetLastDisplayNameSegment (): string {
    return this.solutionNames[this.solutionNames.length - 1]
  }

  CopyNameToVirginSolution (virginSolution: Solution): void {
    for (const nameSegment of this.solutionNames) {
      virginSolution.PushNameSegment(nameSegment)
    }
  }

  FindNodeWithSomeInputForConjointToAttachTo (
    theConjoint: SolutionNode | null
  ): SolutionNode | null {
    for (const rootNode of this.goals.GetValues()) {
      const node = this.FindFirstAttachmentLeafForConjointRecursively(
        theConjoint,
        rootNode
      )
      if (node !== null) {
        return node
      }
    }
    return null
  }

  FindFirstAttachmentLeafForConjointRecursively (
    theConjoint: SolutionNode | null,
    nodeToSearch: SolutionNode | null
  ): SolutionNode | null {
    // isn't kept up to date, so we traverse, depth first.
    if (theConjoint != null && nodeToSearch != null) {
      for (let i = 0; i < nodeToSearch.inputs.length; i += 1) {
        // if its non null, then we can't attach the conjoint there...but we can recurse
        if (nodeToSearch.inputs[i] != null) {
          // check if we can attach the conjoint there
          if (nodeToSearch.inputHints[i] === theConjoint.output) {
            return nodeToSearch
          }
          // else search inside
          return this.FindFirstAttachmentLeafForConjointRecursively(
            theConjoint,
            nodeToSearch.inputs[i]
          )
        }
      }
    }

    return null
  }

  FindAnyNodeMatchingIdRecursively (id: number): SolutionNode | null {
    for (const goal of this.goals.GetValues()) {
      const result = goal.FindAnyNodeMatchingIdRecursively(id)
      if (result != null) {
        return result
      }
    }
    return null
  }

  public GetMapOfRootPieces (): RootNodeMap {
    return this.goals
  }
}
