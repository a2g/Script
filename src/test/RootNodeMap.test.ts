// Typescript Unit test
import assert = require('assert')
import { RootNodeMap } from 'main/RootNodeMap'
import { SolutionNode } from 'main/SolutionNode'
import { SpecialNodes } from 'main/SpecialNodes'

describe('GenerateMapOfLeaves', () => {
  it('EnsureARootNodeThatIsAVerifiedLeafGetsAdded', () => {
    const throwaway = new Set<SolutionNode>()
    const rootNodeMap = new RootNodeMap(null, throwaway)
    const node = new SolutionNode(0, 0, 'blah', SpecialNodes.VerifiedLeaf, 1, null, null, 'c', 'c')
    rootNodeMap.AddRootNode(node)

    const result = rootNodeMap.GenerateMapOfLeaves()
    assert.equal(1, result.size)
  })
})
