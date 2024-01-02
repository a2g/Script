import { expect, it } from '@jest/globals'
import { SolverViaRootPiece } from '../../../src/puzzle/SolverViaRootPiece'
import { Box } from '../../../src/puzzle/Box'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const box = new Box('./practice-world', '03_inside_icehouse.jsonc')
    expect(box.GetArrayOfProps().length).toBe(2)
    const s = new SolverViaRootPiece(box)
    expect(s).toBeDefined()
  })
})
