import { ChoiceLine } from "./ChoiceLine"

export class ChoicePage {
  key: string
  file: string
  mapOfQueues: Map<String, Array<ChoiceLine>>
  constructor(file: string, key: string, arrayOfArrayOfStrings: Array<string[]>) {
    this.file = file
    this.key = key
    this.mapOfQueues = new Map<String, Array<ChoiceLine>>()
    for (let arrayOfTokens of arrayOfArrayOfStrings) {
      if (arrayOfTokens.length < 3) {
        throw new Error(
          `The choices page called ${key} does not have a minimum of 3 cells in it: ${file} `
        )
      }
      if (typeof arrayOfTokens[0] !== 'number') {
        throw new Error(
          `The entry ${key} ends with '_choices' but one of its first cells are not numeric : ${file} `
        )
      }
      const number = arrayOfTokens[1]
      const choiceLine = new ChoiceLine(arrayOfTokens)

      let queue = this.mapOfQueues.get(number)
      if (queue === undefined) {
        queue = new Array<ChoiceLine>()
        this.mapOfQueues.set(number, queue)
        queue.unshift(choiceLine)
      } else {
        queue.unshift(choiceLine)
      }
    }
  }
  public GetKey(): string {
    return this.key
  }
}
