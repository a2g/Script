import { OnceType } from "./OnceType"

export class ChoiceLine {
  public line: string
  public goto: string
  public onceType: OnceType
  constructor(arrayOfTokens: string[]) {
    this.line = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.onceType = OnceType.None
    for (let i = 3; i < arrayOfTokens.length; i++) {
      const token = arrayOfTokens[i]
      if (token == OnceType.Once.toLowerCase()) {
        this.onceType = OnceType.Once
      } else if (token == OnceType.Show.toLowerCase()) {
        this.onceType = OnceType.Show
      } else if (token == OnceType.Temp.toLowerCase()) {
        this.onceType = OnceType.Temp
      } else {

      }
    }
  }
}