// Typescript Unit test
import { RootPieceMap } from '../main/RootPieceMap.js'
import { Piece } from '../main/Piece.js'
import { SpecialTypes } from '../main/SpecialTypes.js'
import chai from 'chai'

describe('GenerateMapOfLeaves', () => {
  it('EnsureARootNodeThatIsAVerifiedLeafGetsAdded', () => {
    const throwaway = new Set<Piece>()
    const rootNodeMap = new RootPieceMap(null, throwaway)
    const node = new Piece(0, 0, 'blah', SpecialTypes.VerifiedLeaf, 1, null, null, 'c', 'c')
    rootNodeMap.AddRootNode(node)

    const result = rootNodeMap.GenerateMapOfLeaves()
    chai.assert.equal(result.size, 1)
  })
})
