// Typescript Unit test
import { RootPieceMap } from '../main/RootPieceMap.js'
import { Piece } from '../main/Piece.js'
import { SpecialTypes } from '../main/SpecialTypes.js'
import chai from 'chai'

describe('GenerateMapOfLeaves', () => {
  it('EnsureARootPieceThatIsAVerifiedLeafGetsAdded', () => {
    const throwaway = new Set<Piece>()
    const rootPieceMap = new RootPieceMap(null, throwaway)
    const piece = new Piece(0, 0, 'blah', SpecialTypes.VerifiedLeaf, 1, null, null, 'c', 'c')
    rootPieceMap.AddRootPiece(piece)

    const result = rootPieceMap.GenerateMapOfLeaves()
    chai.assert.equal(result.size, 1)
  })
})
