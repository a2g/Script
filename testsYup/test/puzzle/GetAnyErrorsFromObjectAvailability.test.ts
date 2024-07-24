import { GetAnyErrorsFromObjectAvailability } from '../../../src/puzzle/GetAnyErrorsFromObjectAvailability'
import { Mix } from '../../../src/puzzle/Mix'
import { Command } from '../../../src/puzzle/Command'
import { describe, it, test, expect } from '@jest/globals'
import { Verb } from '../../../src/puzzle/Verb'

describe('GetAnyErrorsFromObjectAvailability', () => {
  test('SingleVsInv', () => {
    // this test is here because it used to fail!
    const mix = new Command(Verb.Grab, Mix.Prop, 'a', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toEqual('')
  })

  test('Trigger One of those inventory items is not visible!', () => {
    const mix = new Command(Verb.Use, Mix.InvVsInv, 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toContain('inventory items is not visible')
  })

  test('Trigger One of those items is not visible!', () => {
    const mix = new Command(Verb.Use, Mix.InvVsObject, 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toContain('items is not visible')
  })

  test('Trigger One of those objs is not visible!', () => {
    const mix = new Command(Verb.Use, Mix.ObjVsObj, 'a', 'b')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toContain('objs is not visible')
  })

  test('Trigger That inv is not visible!', () => {
    const mix = new Command(Verb.Toggle, Mix.Inv, 'a', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toContain('inv is not visible')
  })

  it('Trigger That obj is not visible!', () => {
    const mix = new Command(Verb.Grab, Mix.Prop, 'b', '')
    const result = GetAnyErrorsFromObjectAvailability(mix, ['a'], [])
    expect(result).toContain('obj is not visible')
  })
})
