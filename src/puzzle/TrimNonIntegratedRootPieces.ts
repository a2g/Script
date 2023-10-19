import assert from 'assert';
import { Solution } from './Solution';

export function TrimNonIntegratedRootPieces(solution: Solution): void {
  const roots = solution.GetRootMap();
  const win_goal = roots.GetRootPieceArrayByNameNoThrow('win_goal');
  assert(win_goal != null);
}
