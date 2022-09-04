import assert = require('assert')
import { GetDisplayName } from '../src/GetDisplayName'

describe('GetDisplayName', () => {
  it('TestAllNamesSoFar', () => {
    // this test is here just because it looked easy to implement
    // ... which is why its not implemented yet
    const displayName = GetDisplayName('prop_broken_radio')
    assert.equal('[36mbroken_radio[0m', displayName)
  })
})
