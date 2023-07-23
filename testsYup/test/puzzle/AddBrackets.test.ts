import { expect, test } from '@jest/globals';
import { AddBrackets } from '../../../src/puzzle/AddBrackets';

test('AddBrackets', () => {
  expect(AddBrackets('blah', true)).toBe('(blah)');
});
