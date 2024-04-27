import { Happening } from './Happening'

/*
These are all the state changes that can occur
Possible new name: StateChangeCollection
Possible new name: StateChangesOfACommand
*/
export class Happenings {
  public verb: string

  public text: string

  public array: Happening[]

  constructor () {
    this.verb = ''
    this.text = ''
    this.array = []
  }

  Clone (): Happenings {
    const clone = new Happenings()
    clone.verb = this.verb
    clone.text = this.text
    for (const happening of this.array) {
      clone.array.push(new Happening(happening.type, happening.itemA, happening.itemB))
    }
    return clone
  }
}
