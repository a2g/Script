import { expect, it } from '@jest/globals'
import { Stringify } from '../../../src/puzzle/Stringify.js'

describe('Stringify', () => {
  it('should convert blank', () => {
    expect(Stringify(null)).toBe('')
  })
})
