import { OnceType } from './OnceType'

export class ChoiceLine {
  public speech: string
  public goto: string
  public onceType: OnceType
  public theseRequisites: string[]
  public isUsed: boolean

  constructor (arrayOfTokens: string[]) {
    this.theseRequisites = []
    this.speech = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.isUsed = false
    this.onceType = OnceType.None
    for (let i = 3; i < arrayOfTokens.length; i++) {
      const token = arrayOfTokens[i]
      if (token === OnceType.OnceSelected.toLowerCase()) {
        this.onceType = OnceType.OnceSelected
      } else if (token === OnceType.OnceShow.toLowerCase()) {
        this.onceType = OnceType.OnceShow
      } else if (token === OnceType.OnceTemp.toLowerCase()) {
        this.onceType = OnceType.OnceTemp
      } /* else {

      } */
    }
  }
}
