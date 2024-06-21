import { Box } from '../../../src/puzzle/Box'
import { expect, test } from '@jest/globals'
import { Aggregates } from '../../../src/puzzle/Aggregates'

test('Test GetMapOfAllStartingThings', () => {
  const aggregates = new Aggregates()
  const box = new Box('testsYup/test/puzzle/', 'Test1First.jsonc', aggregates)

  // const achievements = box.GetSetOfStartingAchievements()
  const objs = box.GetSetOfStartingProps()
  // const invs = box.GetSetOfStartingInvs()
  // assert.strictEqual(collection.length, 1);
  // expect(achievements.size).toEqual(0)
  expect(objs.size).toEqual(9)
})
