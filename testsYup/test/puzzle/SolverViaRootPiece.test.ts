import { expect, it } from '@jest/globals'
import { SolverViaRootPiece } from '../../../src/puzzle/SolverViaRootPiece'
import { Box } from '../../../src/puzzle/Box'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const set = new Set<string>()
    const map = new Map<string, Box>()
    const box = new Box('./practice-world', ['03_inside_icehouse.jsonc'], set, map)
    expect(box.GetArrayOfProps().length).toBe(2)
    const s = new SolverViaRootPiece(box, true)
    expect(s).toBeDefined()
  })
})
