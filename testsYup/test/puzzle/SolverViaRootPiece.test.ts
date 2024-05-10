import { expect, it } from '@jest/globals'
import { SolutionCollection } from '../../../src/puzzle/SolutionCollection'
import { Box } from '../../../src/puzzle/Box'
import { Aggregates } from '../../../src/puzzle/Aggregates'
import { GetDoubles } from '../../../src/puzzle/GetDoubles'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const aggregates = new Aggregates()
    const box = new Box('./practice-world', ['03_inside_icehouse.jsonc'], aggregates)
    expect(box.GetArrayOfProps().length).toBe(2)
    const s = new SolutionCollection(box, GetDoubles(aggregates.piecesMapped))
    expect(s).toBeDefined()
  })
})
