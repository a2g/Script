import { Mix } from '../main/Mix'

export class MixedObjectsAndVerb {
  type: Mix
  verb: string
  object1: string
  object2: string
  error: string

  constructor(type: Mix, verb: string, object1: string, object2 = '', error = '') {
    this.type = type
    this.verb = verb.toLowerCase()
    this.object1 = object1
    this.object2 = object2
    this.error = error
  }

  Match(verb: string, object1: string | undefined, object2: string | undefined): boolean {
    verb = verb.toLowerCase()
    if (this.verb === verb && this.object1 === object1 && this.object2 === object2) { return true }
    if (this.verb === verb && this.object1 === object2 && this.object2 === object1) { return true }
    return false
  }
}
