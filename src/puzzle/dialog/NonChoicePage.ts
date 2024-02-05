export class NonChoicePage {
  key: string
  file: string
  gains: string
  goto: string

  constructor(file: string, key: string, arrayOfArrayOfStrings: Array<string[]>) {
    this.file = file
    this.key = key
    this.gains = ''
    this.goto = ''

    for (let arrayOfTokens of arrayOfArrayOfStrings) {
      if (arrayOfTokens.length < 2) {
        throw new Error(
          `The happens page called ${key} does not have a minimum of 2 cells in it: ${file} `
        )
      }
      if (typeof arrayOfTokens[0] === 'number') {
        throw new Error(
          `The entry ${key} is a plain happens key, but one of its first cells are numeric : ${file} `
        )
      }
      const firstToken = arrayOfTokens[0]
      const secondToken = arrayOfTokens[0]
      if (firstToken == 'goto') {
        this.goto = secondToken
      } else if (firstToken === 'gain') {
        this.gains = secondToken
      }
    }
  }

  GetKey(): string {
    return this.key
  }
}