import assert from 'assert'
import { Solution } from './Solution'

export function TrimNonIntegratedRootPieces (solution: Solution): void {
  const roots = solution.GetRootMap()
  const win = roots.GetGoalWordByNameNoThrow('x_win')
  assert(win != null)
}
