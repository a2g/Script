import { GetAnyErrorsFromObjectAvailability } from '../../../src/puzzle/GetAnyErrorsFromObjectAvailability';
import { Mix } from '../../../src/puzzle/Mix';
import { MixedObjectsAndVerb } from '../../../src/puzzle/MixedObjectsAndVerb';

describe('GetAnyErrorsFromObjectAvailability', () => {
  it('SingleVsInv', () => {
    // this test is here because it used to fail!
    const mix = new MixedObjectsAndVerb(Mix.SingleVsProp, 'grab', 'a', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toEqual('');
  });

  it('Trigger One of those inventory items is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.InvVsInv, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('inventory items is not visible');
  });

  it('Trigger One of those items is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.InvVsProp, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('items is not visible');
  });

  it('Trigger One of those props is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.PropVsProp, 'use', 'a', 'b');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('props is not visible');
  });

  it('Trigger That inv is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.SingleVsInv, 'toggle', 'a', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('inv is not visible');
  });

  it('Trigger That prop is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.SingleVsProp, 'grab', 'b', '');
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], []);
    expect(result).toContain('prop is not visible');
  });
});
