import { expect, test } from '@jest/globals';
import { AlleviateBrackets } from '../../../src/puzzle/AlleviateBrackets';
test('AddBrackets', () => {
  expect(AlleviateBrackets('(blah)')).toBe('blah');
});
