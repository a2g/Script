import { GetDisplayName } from '../../../src/puzzle/GetDisplayName'
import { expect, test } from '@jest/globals'

test('TestAllNamesSoFar', () => {
  // this test is here just because it looked easy to implement
  // ... which is why its not implemented yet
  const displayName = GetDisplayName('prop_broken_radio')
  expect(displayName).toEqual('[36mbroken_radio[0m')
})
