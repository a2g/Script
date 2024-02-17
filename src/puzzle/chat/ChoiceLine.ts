import { OnceType } from './OnceType'

export class ChoiceLine {
  public speech: string
  public goto: string
  public onceType: OnceType
  public theseRequisites: string[]

  constructor (arrayOfTokens: string[]) {
    this.theseRequisites = []
    this.speech = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.onceType = OnceType.None
    for (let i = 3; i < arrayOfTokens.length; i++) {
      const token = arrayOfTokens[i]
      if (token === OnceType.Once.toLowerCase()) {
        this.onceType = OnceType.Once
      } else if (token === OnceType.Show.toLowerCase()) {
        this.onceType = OnceType.Show
      } else if (token === OnceType.Temp.toLowerCase()) {
        this.onceType = OnceType.Temp
      } /* else {

      } */
    }
  }
}
