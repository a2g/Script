import { OnceType } from './OnceType'

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
      const iterableObject: object = arrayOfTokens[3]
      for (const kvp in iterableObject) {
        const key = kvp[0]
        const value = kvp[1]
        if (key === 'once') {
          if (value === OnceType.SelectableOnce.toLowerCase()) {
            this.onceType = OnceType.SelectableOnce
          } else if (value === OnceType.OfferableOnce.toLowerCase()) {
            this.onceType = OnceType.OfferableOnce
          } else if (value === OnceType.SelectableOncePerTalk.toLowerCase()) {
            this.onceType = OnceType.SelectableOncePerTalk
          }
        }
      }
    }
  }
}
