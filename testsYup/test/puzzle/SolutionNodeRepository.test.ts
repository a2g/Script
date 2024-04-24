import { Piece } from '../../../src/puzzle/Piece'
import { expect, describe, test } from '@jest/globals'
import { Box } from '../../../src/puzzle/Box'

describe('ReactionMap', () => {
  test('test AddToMap works', () => {
    const set = new Set<string>()
    const map = new Map<string, Box>()
    const box = new Box('', '', set, map)

    // test that it is indeed null before
    const setBefore = box.Get('outputA')
    expect(setBefore).toEqual(undefined)

    // do it!
    box.AddPiece(
      new Piece(0, null, 'outputA', 'type', 1, null, null, null, 'A', 'B'), '', false, set, map
    )

    // test that it has added a set for the new piece
    const setAfter = box.Get('outputA')
    expect(setAfter).not.toEqual(null)

    const sizeAfterAdding = setAfter != null ? setAfter.size : 0
    expect(sizeAfterAdding).toEqual(1)
  })

  test('test RemovePiece works', () => {
    const map = new Map<string, Box>()
    const set = new Set<string>()
    const box = new Box('', '', set, map)
    for (let i = 0; i < 3; i += 1) {
      box.AddPiece(
        new Piece(0, null, 'outputA', 'piffle', 1, null, null, null, 'A', 'B'), '', true, set, map
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
    box.AddPiece(theOneToRemove, '', false, set, map)
    {
      const arrayBefore = box.Get('outputA')
      const countBeforeRemoval = arrayBefore != null ? arrayBefore.size : 0
      expect(countBeforeRemoval).toEqual(4)
    }

    box.RemovePiece(theOneToRemove)

    {
      const arrayAfter = box.Get('outputA')
      const countAfterRemoval = arrayAfter != null ? arrayAfter.size : 0
      expect(countAfterRemoval).toEqual(3)
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

    // put them in a map
    const set = new Set<string>()
    const map = new Map<string, Box>()
    const tmap = new Box('', '', set, map)
    array.forEach((t: Piece) => {
      tmap.AddPiece(t, '', false, set, map)
    })

    // cloned the map, and modify it.
    {
      const cloned = new Box('', '', set, map)
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
