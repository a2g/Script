import { expect, it } from '@jest/globals'
import { SpecialTypes } from '../../../src/puzzle/SpecialTypes'

describe('Special Types', () => {
  it('should convert blank', () => {
    expect(SpecialTypes.VerifiedLeaf).toBe('VerifiedLeaf')
  })
})
