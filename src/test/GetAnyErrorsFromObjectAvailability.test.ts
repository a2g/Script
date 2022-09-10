import { expect } from '@open-wc/testing';
import { GetAnyErrorsFromObjectAvailability } from 'jigsaw/GetAnyErrorsFromObjectAvailability'
import { Mix } from './../main/Mix'
import { MixedObjectsAndVerb } from './../main/MixedObjectsAndVerb'

describe('GetAnyErrorsFromObjectAvailability', () => {
  it('SingleVsInv', () => {
    // this test is here because it used to fail!
    const mix = new MixedObjectsAndVerb(Mix.SingleVsProp, 'grab', 'a', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).to.equal('')
  })

  it('Trigger One of those inventory items is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.InvVsInv, 'use', 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).includes('inventory items is not visible')
  })

  it('Trigger One of those items is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.InvVsProp, 'use', 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).includes('items is not visible')
  })

  it('Trigger One of those props is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.PropVsProp, 'use', 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).includes('props is not visible')
  })

  it('Trigger That inv is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.SingleVsInv, 'toggle', 'a', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).includes('inv is not visible')
  })

  it('Trigger That prop is not visible!', () => {
    const mix = new MixedObjectsAndVerb(Mix.SingleVsProp, 'grab', 'b', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).includes('prop is not visible')
  })
})
