import { GetAnyErrorsFromObjectAvailability } from '../../../src/puzzle/GetAnyErrorsFromObjectAvailability';
import { Mix } from '../../../src/puzzle/Mix';
import { Command } from '../../../src/puzzle/Command';
import { describe, it, test, expect } from '@jest/globals';

describe('GetAnyErrorsFromObjectAvailability', () => {
  test('SingleVsInv', () => {
    // this test is here because it used to fail!
    const mix = new Command(Mix.Prop, 'grab', 'a', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toEqual('');
  });

  test('Trigger One of those inventory items is not visible!', () => {
    const mix = new Command(Mix.InvVsInv, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('inventory items is not visible');
  });

  test('Trigger One of those items is not visible!', () => {
    const mix = new Command(Mix.InvVsProp, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('items is not visible');
  });

  test('Trigger One of those props is not visible!', () => {
    const mix = new Command(Mix.PropVsProp, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('props is not visible');
  });

  test('Trigger That inv is not visible!', () => {
    const mix = new Command(Mix.Inv, 'toggle', 'a', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('inv is not visible');
  });

  it('Trigger That prop is not visible!', () => {
    const mix = new Command(Mix.Prop, 'grab', 'b', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('prop is not visible');
  });
});
