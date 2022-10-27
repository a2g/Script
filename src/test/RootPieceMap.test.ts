// Typescript Unit test
import { RootPieceMap } from '../main/RootPieceMap.js'
import { Piece } from '../main/Piece.js'
import { SpecialTypes } from '../main/SpecialTypes.js'
import chai from 'chai'

describe('GenerateMapOfLeaves', () => {
  it('EnsureARootPieceThatIsAVerifiedLeafGetsAdded', () => {
    const rootPieceMap = new RootPieceMap(null)
    const piece = new Piece(0, null, 'blah', SpecialTypes.VerifiedLeaf, 1, null, null, 'c', 'c')
    rootPieceMap.AddPiece(piece)

    const result = rootPieceMap.GenerateMapOfLeaves()
    chai.assert.equal(result.size, 1)
  })
})
