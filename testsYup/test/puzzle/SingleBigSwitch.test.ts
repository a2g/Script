import { SingleFile } from '../../../src/puzzle/SingleFile'
import { expect, describe, test } from '@jest/globals'
import { join } from 'path'
import { Box } from '../../../src/puzzle/Box'

describe('SingleBigSwitch', () => {
  test('SingleBigSwitch', async () => {
    console.log(__dirname)
    const set = new Set<string>()
    const map = new Map<string, Box>()
    const file = new SingleFile(
      join(__dirname, '/../../../practice-world/'),
      'x03_access_thru_fireplace.jsonc', set, map
    )
    const pile = new Box('', [''], set, map)
    await file.copyAllPiecesToContainer(pile)
    const size = pile.Size()
    expect(size).toBe(3)
    // expect(happenings).not.toEqual(null);
    // if (happenings != null) {
    //  expect(1).not.toEqual(happenings.array.length);
    // }
  })
})
