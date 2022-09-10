// Typescript Unit test
import assert = require('assert')
import { ReadOnlyJsonSingle } from 'main/ReadOnlyJsonSingle'

describe('SceneSingle', () => {
  it('Test GetMapOfAllStartingThings', () => {
    const json = new ReadOnlyJsonSingle('./tests/TestHighPermutationSolution.json')

    // this failed recently
    const map = json.GetMapOfAllStartingThings()
    // assert.strictEqual(collection.length, 1);
    assert.ok(true)
    assert.strictEqual(map.size, 14)
    assert.ok(map.has('inv_shared_toy'))
    const set = map.get('inv_shared_toy')
    if (set != null) {
      assert.strictEqual(set.size, 4)
      assert.ok(set.has('char1'))
      assert.ok(set.has('char2'))
      assert.ok(set.has('char3'))
      assert.ok(set.has('char4'))
    }
  })
})
