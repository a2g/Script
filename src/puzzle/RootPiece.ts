import { Piece } from './Piece'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'

export class RootPiece {
  public piece: Piece

  public firstNullInput: string
  public isSolved: boolean

  public readonly commandsCompletedInOrder: RawObjectsAndVerb[]

  constructor (piece: Piece, firstIncompleteInput: string, commandsCompletedInOrder: RawObjectsAndVerb[]) {
    this.piece = piece// TODO: should be
    this.firstNullInput = firstIncompleteInput
    this.isSolved = false

    // if commandsCompletedInOrder is passed in, we deep copy it
    this.commandsCompletedInOrder = []
    if (commandsCompletedInOrder != null) {
      for (const command of commandsCompletedInOrder) {
        this.commandsCompletedInOrder.push(command)
      }
    }
  }

  public GetOrderOfCommands (): RawObjectsAndVerb[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The best way to clone in is using 'map'
    return this.commandsCompletedInOrder.map((x) => x)
  }
}
