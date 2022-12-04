import { expect } from '@open-wc/testing'
import { Mix } from '../../src/puzzle/Mix.js'
import { MixedObjectsAndVerb } from '../../src/puzzle/MixedObjectsAndVerb.js'
import { SingleBigSwitch } from '../../src/puzzle/SingleBigSwitch.js'

describe('SingleBigSwitch', () => {
  it('SingleBigSwitch', async () => {
    const combo = new MixedObjectsAndVerb(Mix.SingleVsProp, 'Grab', 'prop_loose_brick')
    const isReturnHappenings = false
    const happenings = await SingleBigSwitch('test/puzzle/Test1First.json', combo, isReturnHappenings, null)

    expect(happenings).not.equal(null)
    if (happenings != null) {
      expect(1).not.equal(happenings.array.length)
    }
  })
})
