import { Mix } from './Mix'
import { Verb } from './Verb'

export class Command {
  public verb: Verb
  public type: Mix

  public object1: string

  public object2: string

  public error: string

  constructor (
    verb: Verb,
    type: Mix,
    object1: string,
    object2 = '',
    error = ''
  ) {
    this.type = type
    this.verb = verb
    this.object1 = object1
    this.object2 = object2
    this.error = error
  }

  public Match (
    verbIncoming: string,
    object1: string | undefined,
    object2: string | undefined
  ): boolean {
    const verb = verbIncoming.toLowerCase()
    if (
      this.verb === verb &&
      this.object1 === object1 &&
      this.object2 === object2
    ) {
      return true
    }
    if (
      this.verb === verb &&
      this.object1 === object2 &&
      this.object2 === object1
    ) {
      return true
    }
    return false
  }
}
