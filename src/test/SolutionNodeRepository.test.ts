import { expect } from '@open-wc/testing'
import { Piece } from '../main/Piece'
import { PileOfPieces } from '../main/PileOfPieces'
describe('ReactionMap', () => {
  it('test AddToMap works', () => {
    const blah = new PileOfPieces(null)

    // test that it is indeed null before
    const arrayBefore = blah.Get('outputA')
    expect(arrayBefore).to.equal(undefined)

    // do it!
    blah.AddPiece(new Piece(0, 0, 'outputA', 'type', 1, null, null, 'A', 'B'))

    // test that it adds an array if the array is not yet null.
    const arrayAfter = blah.Get('outputA')
    expect(arrayAfter).to.equal(null)

    const countAfterAdding = (arrayAfter != null) ? arrayAfter.size : 0
    expect(countAfterAdding).to.equal(1)
  })

  it('test RemovePiece works', () => {
    const blah = new PileOfPieces(null)
    for (let i = 0; i < 3; i += 1) {
      blah.AddPiece(new Piece(0, 0, 'outputA', 'piffle', 1, null, null, 'A', 'B'))
    }
    const theOneToRemove = new Piece(0, 0, 'outputA', 'piffle', 1, null, null, 'A', 'B')
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
    array.push(new Piece(0, 0, 'blah', 'outputA', 1, null, null, 'a', 'a'))
    array.push(new Piece(0, 0, 'blah', 'outputA', 1, null, null, 'b', 'b'))
    array.push(new Piece(0, 0, 'blah', 'outputA', 1, null, null, 'c', 'c'))

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
    expect(array[2].inputHints[0]).to.equal('v')
  })
})
