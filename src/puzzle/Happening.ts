import { Happen } from './Happen'

export class Happening {
  item: string
  happen: Happen

  constructor (play: Happen, item: string) {
    if (item.length === 0) {
      throw new Error('item needs to be non null')
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
          console.log('Mismatch! the item (' + item + ') does not start with "prop"')
        }
        break
      case Happen.GoalIsDecremented:
      case Happen.GoalIsIncremented:
      case Happen.GoalIsSet:
        if (!item.startsWith('goal')) { console.log('Mismatch! the item (' + item + ') doesn"t start with "goal"') }
        break
    }
  }
}
