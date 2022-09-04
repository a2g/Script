import { assert } from 'console'
import { Happen } from './Happen'

export class Happening {
  item: string
  happen: Happen

  constructor (play: Happen, item: string) {
    if (item.length === 0) {
      assert(false && 'item needs to be non null')
    }
    this.happen = play
    this.item = item
    switch (play) {
      case Happen.InvGoes:
      case Happen.InvStays:
      case Happen.InvAppears:
        if (!item.startsWith('inv')) { console.log('Mismatch! the item (' + item + ') doesn"t start with "inv"') }
        break
      case Happen.PropGoes:
      case Happen.PropStays:
      case Happen.PropAppears:
        if (!item.startsWith('prop')) {
          console.log('Mismatch! the item (' + item + ') doesn"t start with "prop"')
        }
        break
      case Happen.FlagIsDecremented:
      case Happen.FlagIsIncremented:
      case Happen.FlagIsSet:
        if (!item.startsWith('flag')) { console.log('Mismatch! the item (' + item + ') doesn"t start with "flag"') }
        break
    }
  }
}
