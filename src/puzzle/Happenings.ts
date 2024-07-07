import { Happening } from './Happening'

/*
These are all the state changes that can occur
Possible new name: StateChangeCollection
Possible new name: StateChangesOfACommand
*/
export class Happenings {
  // private verb: string

  public text: string

  public array: Happening[]

  constructor (text: string, happenings: Happening[]) {
    this.text = text
    this.array = [...happenings]
  }

  Clone (): Happenings {
    const clone = new Happenings(this.text, [])
    for (const happening of this.array) {
      clone.array.push(new Happening(happening.type, happening.itemA, happening.itemB))
    }
    return clone
  }
}
