import { expect, it } from '@jest/globals'
import { SolverViaRootPiece } from '../../../src/puzzle/SolverViaRootPiece'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const s = new SolverViaRootPiece('./practice-world', '03_inside_icehouse.jsonc')
    expect(s).toBeDefined()
  })
})
