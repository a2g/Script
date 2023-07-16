import assert from 'assert';
import { Solution } from './Solution';

export function TrimNonIntegratedRootPieces(solution: Solution): void {
  const roots = solution.GetRootMap();
  const goal_win = roots.GetRootPieceArrayByNameNoThrow('goal_win');
  assert(goal_win != null);
}
