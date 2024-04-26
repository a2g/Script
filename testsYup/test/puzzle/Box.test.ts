import { Box } from '../../../src/puzzle/Box'
import { expect, test } from '@jest/globals'

test('Test GetMapOfAllStartingThings', () => {
  const set = new Set<string>()
  const map = new Map<string, Box>()
  const box = new Box('testsYup/test/puzzle/', ['Test1First.jsonc'], set, map)

  const goals = box.GetSetOfStartingGoals()
  const props = box.GetSetOfStartingProps()
  // const invs = box.GetSetOfStartingInvs()
  // assert.strictEqual(collection.length, 1);
  expect(goals.size).toEqual(0)
  expect(props.size).toEqual(9)
})
