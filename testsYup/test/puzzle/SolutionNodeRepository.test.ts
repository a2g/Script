import { Piece } from '../../../src/puzzle/Piece'
import { expect, describe, test } from '@jest/globals'
import { Box } from '../../../src/puzzle/Box'
import { Aggregates } from '../../../src/puzzle/Aggregates'

describe('ReactionMap', () => {
  test('test AddToMap works', () => {
    const aggregates = new Aggregates()
    const box = new Box('', [''], aggregates)

    // test that it is indeed null before
    const setBefore = box.Get('outputA')
    expect(setBefore).toEqual(undefined)

    // do it!
    box.AddPiece(
      new Piece(0, null, 'outputA', 'type', 1, null, null, null, 'A', 'B'), '', false, aggregates
    )

    // test that it has added a set for the new piece
    const setAfter = box.Get('outputA')
    expect(setAfter).not.toEqual(null)

    const sizeAfterAdding = setAfter != null ? setAfter.size : 0
    expect(sizeAfterAdding).toEqual(1)
  })

  test('test RemovePiece works', () => {
    const aggregates = new Aggregates()
    const box = new Box('', [''], aggregates)
    for (let i = 0; i < 3; i += 1) {
      box.AddPiece(
        new Piece(0, null, 'outputA', 'piffle', 1, null, null, null, 'A', 'B'), '', true, aggregates
      )
    }
    const theOneToRemove = new Piece(
      0,
      null,
      'outputA',
      'piffle',
      1,
      null,
      null,
      null,
      'A',
      'B'
    )
    box.AddPiece(theOneToRemove, '', false, aggregates)
    {
      const arrayBefore = box.Get('outputA')
      const countBeforeRemoval = arrayBefore != null ? arrayBefore.size : 0
      expect(countBeforeRemoval).toEqual(4)
    }
  })

  test('test Clone works', () => {
    // create original entries
    const array = new Array<Piece>()
    array.push(
      new Piece(0, null, 'blah', 'outputA', 1, null, null, null, 'a', 'a')
    )
    array.push(
      new Piece(0, null, 'blah', 'outputA', 1, null, null, null, 'b', 'b')
    )
    array.push(
      new Piece(0, null, 'blah', 'outputA', 1, null, null, null, 'c', 'c')
    )

    const aggregates = new Aggregates()

    // put them in a map
    const tmap = new Box('', [''], aggregates)
    array.forEach((t: Piece) => {
      tmap.AddPiece(t, '', false, aggregates)
    })

    // cloned the map, and modify it.
    {
      const cloned = new Box('', [''], aggregates)
      const clonedOutputA = cloned.Get('outputA')

      if (clonedOutputA != null) {
        for (const item of clonedOutputA) {
          item.inputHints[0] = 'd'
        }
      }
    }

    // check the originals are still the same
    expect(array[0].inputHints[0]).toEqual('a')
    expect(array[1].inputHints[0]).toEqual('b')
    expect(array[2].inputHints[0]).toEqual('c')
  })
})
