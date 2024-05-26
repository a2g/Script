import { expect, it } from '@jest/globals'
import { Solutions } from '../../../src/puzzle/Solutions'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const s = new Solutions('./practice-world', '03_inside_icehouse.jsonc')
    expect(s).toBeDefined()
  })
})
