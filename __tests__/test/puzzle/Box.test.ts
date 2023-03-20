import { expect } from '@open-wc/testing'
import { Box } from '../../../src/puzzle/Box.js'


test('Test GetMapOfAllStartingThings', () => {
  const box = new Box('test/puzzle/Test1First.json')
  box.Init()

  const goals = box.GetSetOfStartingGoals()
  const props = box.GetSetOfStartingProps()
  // const invs = box.GetSetOfStartingInvs()
  // assert.strictEqual(collection.length, 1);
  expect(goals.size).to.equal(0)
  expect(props.size).to.equal(9)
})

