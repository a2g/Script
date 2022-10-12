// Typescript Unit test
import { expect } from '@open-wc/testing'
import chai from 'chai'
import { Box } from '../main/Box'

describe('SceneSingle', () => {
  it('Test GetMapOfAllStartingThings', () => {
    const box = new Box('./tests/TestHighPermutationSolution.json')

    // this failed recently
    const map = box.GetMapOfAllStartingThings()
    // assert.strictEqual(collection.length, 1);
    expect(map.size).to.equal(14)
    expect(map.has('inv_shared_toy'))
    const set = map.get('inv_shared_toy')
    if (set != null) {
      chai.assert.equal(set.size, 4)
      chai.expect(set).to.have.keys('char1')
      chai.expect(set).to.have.keys('char2')
      chai.expect(set).to.have.keys('char3')
      chai.expect(set).to.have.keys('char4')
    }
  })
})
