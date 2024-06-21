export class NonChoiceSection {
  key: string
  file: string
  gains: string
  goto: string
  arrayOfOtherStuff: string[][]

  constructor (file: string, key: string) {
    this.file = file
    this.key = key
    this.gains = ''
    this.goto = ''
    this.arrayOfOtherStuff = new Array<string[]>()
  }

  Clone (): NonChoiceSection { // TODO - this MUST be changed
    // these pages are immutable, so can share it around
    return this
    // const clonedChoicePage = new NonChoicePage(this.file, this.key)

    // clonedChoicePage.gains = this.gains
    // clonedChoicePage.goto = this.goto

    // for(let item of this.arrayOfCommands ){
    //   this.arrayOfCommands.push(item)
    // }
    // return clonedChoicePage
  }

  public Init (arrayOfArrayOfStrings: any[][]): void {
    for (const arrayOfTokens of arrayOfArrayOfStrings) {
      const firstToken: string = arrayOfTokens.length > 0 ? arrayOfTokens[0] : ''
      if (firstToken !== 'exit' && arrayOfTokens.length < 2) {
        throw new Error(
          `Minimum not met ${firstToken} of '${this.key}'  ${this.file}`
        )
      }
      if (typeof arrayOfTokens[0] === 'number') {
        throw new Error(
          `The entry ${this.key} is a plain happens key, but one of its first cells are numeric : ${this.file} `
        )
      }

      // const thirdToken: object = arrayOfTokens.length > 2 ? arrayOfTokens[2] : {}
      const secondToken: string = arrayOfTokens.length > 1 ? arrayOfTokens[1] : ''

      if (firstToken === 'exit') {
        this.goto = 'exit'
      } else if (firstToken === 'goto') {
        this.goto = secondToken
      } else if (firstToken === 'gains') {
        this.gains = secondToken
      } else {
        this.arrayOfOtherStuff.push(arrayOfTokens)
      }
    }
  }

  public GetKey (): string {
    return this.key
  }

  public GetAllChating (): string[][] {
    const toReturn = new Array<string[]>()
    toReturn.push(...this.arrayOfOtherStuff)
    return toReturn
  }
}
