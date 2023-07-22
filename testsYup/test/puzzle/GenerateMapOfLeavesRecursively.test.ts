import { GenerateMapOfLeavesRecursively } from '../../../src/puzzle/GenerateMapOfLeavesRecursively';
import { Piece } from '../../../src/puzzle/Piece';

test('Test GetMapOfAllStartingThings', () => {
  const map = new Map<string, Piece | null>();
  // eslint-disable-next-line no-return-assign, no-param-reassign
  const piece = new Piece(1, null, 'theOutput', '', 1, null, null, 'a', 'b'); // eslint-disable-line no-return-assign, no-param-reassign
  GenerateMapOfLeavesRecursively(piece, '', map);

  expect(map.size).toEqual(1);
});
