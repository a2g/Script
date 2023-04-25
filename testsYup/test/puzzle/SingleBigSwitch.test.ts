import { Mix } from '../../../src/puzzle/Mix';
import { MixedObjectsAndVerb } from '../../../src/puzzle/MixedObjectsAndVerb';
import { SingleBigSwitch } from '../../../src/puzzle/SingleBigSwitch';

describe('SingleBigSwitch', () => {
  it('SingleBigSwitch', async () => {
    const combo = new MixedObjectsAndVerb(
      Mix.SingleVsProp,
      'Grab',
      'prop_loose_brick'
    );
    const isReturnHappenings = false;
    const happenings = await SingleBigSwitch(
      'test/puzzle/',
      'Test1First.json',
      combo,
      isReturnHappenings,
      null
    );

    expect(happenings).not.toEqual(null);
    if (happenings != null) {
      expect(1).not.toEqual(happenings.array.length);
    }
  });
});
