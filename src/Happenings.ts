import { Happening } from './Happening'

export class Happenings {
  verb: string
  text: string
  array: Happening[]

  constructor () {
    this.verb = ''
    this.text = ''
    this.array = new Array<Happening>()
  }
}
