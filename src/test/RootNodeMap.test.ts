// Typescript Unit test
import { RootNodeMap } from '../main/RootNodeMap.js'
import { SolutionNode } from '../main/SolutionNode.js'
import { SpecialNodes } from '../main/SpecialNodes.js'
import chai from 'chai';

describe('GenerateMapOfLeaves', () => {
  it('EnsureARootNodeThatIsAVerifiedLeafGetsAdded', () => {
    const throwaway = new Set<SolutionNode>()
    const rootNodeMap = new RootNodeMap(null, throwaway)
    const node = new SolutionNode(0, 0, 'blah', SpecialNodes.VerifiedLeaf, 1, null, null, 'c', 'c')
    rootNodeMap.AddRootNode(node)

    const result = rootNodeMap.GenerateMapOfLeaves()
    chai.assert.equal(result.size, 1)
  })
})
