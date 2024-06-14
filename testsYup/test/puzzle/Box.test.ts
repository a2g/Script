import { Box } from '../../../src/puzzle/Box'
import { expect, test } from '@jest/globals'
import { Aggregates } from '../../../src/puzzle/Aggregates'

test('Test GetMapOfAllStartingThings', () => {
  const aggregates = new Aggregates()
  const box = new Box('testsYup/test/puzzle/', 'Test1First.jsonc', aggregates)

  // const goals = box.GetSetOfStartingGoals()
  const props = box.GetSetOfStartingProps()
  // const invs = box.GetSetOfStartingInvs()
  // assert.strictEqual(collection.length, 1);
  // expect(goals.size).toEqual(0)
  expect(props.size).toEqual(9)
})
