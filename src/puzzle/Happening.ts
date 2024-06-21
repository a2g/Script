import { IdPrefixes } from '../../IdPrefixes'
import { Happen } from './Happen'

/*
These are all the state changes that can occur
Possible new name: StateChangeEvent
Possible new name: StateChange
*/
export class Happening {
  public type: Happen
  public itemA: string
  public itemB: string

  constructor (type: Happen, itemA: string, itemB = '') {
    if (itemA.length === 0) {
      throw new Error('item needs to be non null')
    }
    this.type = type
    this.itemA = itemA
    this.itemB = itemB
    switch (type) {
      case Happen.InvGoes:
      case Happen.InvStays:
      case Happen.InvAppears:
      case Happen.InvTransitions:
        if (!itemA.startsWith('inv')) {
          console.warn(
            'Mismatch! the item (' + itemA + ') doesn"t start with "inv"'
          )
        }
        if (itemB !== '' && !itemB.startsWith('inv')) {
          console.warn(
            'Mismatch! the item (' + itemB + ') doesn"t start with "inv"'
          )
        }
        break
      case Happen.PropGoes:
      case Happen.PropStays:
      case Happen.PropAppears:
      case Happen.PropTransitions:
        if (!itemA.startsWith('obj')) {
          console.warn(
            'Mismatch! the item (' + itemA + ') does not start with "obj"'
          )
        }
        if (itemB !== '' && !itemB.startsWith('obj')) {
          console.warn(
            'Mismatch! the item (' + itemB + ') does not start with "obj"'
          )
        }
        break
      case Happen.AchievementIsDecremented:
      case Happen.AchievementIsIncremented:
      case Happen.AchievementIsSet:
        if (!itemA.startsWith(IdPrefixes.Achievement)) {
          console.warn(
            'Convention mismatch! the item (' +
            itemA +
            ') does not begin with a achievement prefix"'
          )
        }
        break
    }
  }
}
