import { ChoiceLine } from './ChoiceLine'

export class ChoiceSection {
  key: string
  file: string
  mapOfQueues: Map<Number, ChoiceLine[]>

  constructor (file: string, key: string) {
    this.file = file
    this.key = key
    this.mapOfQueues = new Map<Number, ChoiceLine[]>()
  }

  public Clone (): ChoiceSection {
    const clonedChoicePage = new ChoiceSection(this.file, this.key)
    this.mapOfQueues.forEach(
      (queue: ChoiceLine[], key: Number) => {
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

  public Init (arrayOfArrayOfStrings: any[][]): void {
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

      const number = arrayOfTokens[0]
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
      const queueForGivenIndex = this.mapOfQueues.get(i)
      if (queueForGivenIndex != null && queueForGivenIndex.length > 0) {
        for (const choiceLine of queueForGivenIndex) {
          if (choiceLine.goto === choiceToChoose) {
            // we've located it, but it might be covered by
            // other answers in the same slot.
            // Sadly we can't really uncover it one by one.
            // but it might have a long weird path
            // The long weird path thing should be figured out
            // beforehand and then passed to
            // TalkFile.CollectSpeechLinesNeededToGetToPath.
            toReturn.push(['you', choiceLine.speech])

            // remove head of queue so can't be used again
            // even if it doesn't have select-once.. we don't
            // ever want to play the same speech twice
            queueForGivenIndex.shift()

            // we only want the speech of choosing it the first time
            return toReturn
          }
        }
      }
    }
    return toReturn
  }
}
