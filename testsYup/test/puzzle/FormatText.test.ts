import { expect, test } from '@jest/globals';
import { Colors } from '../../../src/puzzle/Colors';
import { FormatText } from '../../../src/puzzle/FormatText';

test('should render inv_ in green', () => {
  expect(FormatText('inv_blah')).toBe(Colors.Green + 'blah' + Colors.Reset);
});

test('should render prop_ in cyan', () => {
  expect(FormatText('prop_blah')).toBe(Colors.Cyan + 'blah' + Colors.Reset);
});

test('should render .goal in yellow', () => {
  expect(FormatText('blah.goal')).toBe(Colors.Yellow + 'blah' + Colors.Reset);
});
