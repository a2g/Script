import { OnceType } from './OnceType'
import { VisibleIf } from './VisibleIf'

export class ChoiceLine {
  public speech: string
  public goto: string
  public onceType: OnceType
  public theseRequisites: string[]
  public isUsed: boolean

  constructor (arrayOfTokens: any[]) {
    this.theseRequisites = []
    this.speech = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.isUsed = false
    this.onceType = OnceType.None
    if (arrayOfTokens.length >= 4) {
      const iterableObject: { [index: string]: string } = arrayOfTokens[3]
      for (const key in iterableObject) {
        const value = iterableObject[key]
        if (key === 'once') {
          if (value === OnceType.SelectableOnce.toLowerCase()) {
            this.onceType = OnceType.SelectableOnce
          } else if (value === OnceType.OfferableOnce.toLowerCase()) {
            this.onceType = OnceType.OfferableOnce
          } else if (value === OnceType.SelectableOncePerChat.toLowerCase()) {
            this.onceType = OnceType.SelectableOncePerChat
          }
        } else if (key === VisibleIf.Exists) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotExists) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.Met) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotMet) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.Owned) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotOwned) {
          this.theseRequisites.push(value)
        }
      }
    }
  }
}
