import { Happening } from './Happening.js'

export class Happenings {
  verb: string

  text: string

  array: Happening[]

  constructor () {
    this.verb = ''
    this.text = ''
    this.array = []
  }
}
