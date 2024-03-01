import { ChoiceLine } from './ChoiceLine'

export class ChoiceSection {
  key: string
  file: string
  mapOfQueues: Map<String, ChoiceLine[]>

  constructor (file: string, key: string) {
    this.file = file
    this.key = key
    this.mapOfQueues = new Map<String, ChoiceLine[]>()
  }

  public Clone (): ChoiceSection {
    const clonedChoicePage = new ChoiceSection(this.file, this.key)
    this.mapOfQueues.forEach(
      (queue: ChoiceLine[], key: String) => {
        const clonedQueue: ChoiceLine[] = []
        for (const choiceLine of queue) {
          // choice lines are immutable, so no need to clone
          clonedQueue.push(choiceLine)
        }
        clonedChoicePage.mapOfQueues.set(key, clonedQueue)
      }
    )
    return clonedChoicePage
  }

  public Init (arrayOfArrayOfStrings: string[][]): void {
    for (const arrayOfTokens of arrayOfArrayOfStrings) {
      if (arrayOfTokens.length < 3) {
        throw new Error(
          `The choices page called ${this.key} does not have a minimum of 3 cells in it: ${this.file} `
        )
      }
      if (typeof arrayOfTokens[0] !== 'number') {
        throw new Error(
          `The entry ${this.key} ends with '_choices' but one of its first cells are not numeric : ${this.file} `
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

  public GetKey (): string {
    return this.key
  }

  public GetAllTalkingWhilstChoosing (choiceToChoose: string): string[][] {
    const toReturn = new Array<string[]>()
    for (let i = 0; i < 20; i++) {
      const queueForGivenIndex = this.mapOfQueues.get(i.toString())
      if (queueForGivenIndex != null && queueForGivenIndex.length > 0) {
        const choiceLine = queueForGivenIndex[0]
        if (choiceLine.goto === choiceToChoose) {
          toReturn.push(['you', choiceLine.speech])
        }
      }
    }
    return toReturn
  }
}
