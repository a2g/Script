import { expect } from '@open-wc/testing'
import { Piece } from '../../src/puzzle/Piece.js'
import { PileOfPieces } from '../../src/puzzle/PileOfPieces.js'

describe('ReactionMap', () => {
  it('test AddToMap works', () => {
    const pile = new PileOfPieces(null)

    // test that it is indeed null before
    const setBefore = pile.Get('outputA')
    expect(setBefore).to.equal(undefined)

    // do it!
    pile.AddPiece(new Piece(0, null, 'outputA', 'type', 1, null, null, 'A', 'B'))

    // test that it has added a set for the new piece
    const setAfter = pile.Get('outputA')
    expect(setAfter).not.to.equal(null)

    const sizeAfterAdding = (setAfter != null) ? setAfter.size : 0
    expect(sizeAfterAdding).to.equal(1)
  })

  it('test RemovePiece works', () => {
    const blah = new PileOfPieces(null)
    for (let i = 0; i < 3; i += 1) {
      blah.AddPiece(new Piece(0, null, 'outputA', 'piffle', 1, null, null, 'A', 'B'))
    }
    const theOneToRemove = new Piece(0, null, 'outputA', 'piffle', 1, null, null, 'A', 'B')
    blah.AddPiece(theOneToRemove)
    {
      const arrayBefore = blah.Get('outputA')
      const countBeforeRemoval = (arrayBefore != null) ? arrayBefore.size : 0
      expect(countBeforeRemoval).to.equal(4)
    }

    blah.RemovePiece(theOneToRemove)

    {
      const arrayAfter = blah.Get('outputA')
      const countAfterRemoval = (arrayAfter != null) ? arrayAfter.size : 0
      expect(countAfterRemoval).to.equal(3)
    }
  })

  it('test Clone works', () => {
    // create original entries
    const array = []
    array.push(new Piece(0, null, 'blah', 'outputA', 1, null, null, 'a', 'a'))
    array.push(new Piece(0, null, 'blah', 'outputA', 1, null, null, 'b', 'b'))
    array.push(new Piece(0, null, 'blah', 'outputA', 1, null, null, 'c', 'c'))

    // put them in a map
    const tmap = new PileOfPieces(null)
    array.forEach((t: Piece) => {
      tmap.AddPiece(t)
    })

    // cloned the map, and modify it.
    {
      const cloned = new PileOfPieces(tmap)
      const clonedOutputA = cloned.Get('outputA')

      if (clonedOutputA != null) {
        for (const item of clonedOutputA) {
          item.inputHints[0] = 'd'
        }
      }
    }

    // check the originals are still the same
    expect(array[0].inputHints[0]).to.equal('a')
    expect(array[1].inputHints[0]).to.equal('b')
    expect(array[2].inputHints[0]).to.equal('c')
  })
})
