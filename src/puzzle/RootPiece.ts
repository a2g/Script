import { Piece } from './Piece'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'

export class RootPiece {
  public piece: Piece
  private isSolved: boolean
  private readonly commandsCompletedInOrder: RawObjectsAndVerb[]

  constructor (piece: Piece, commandsCompletedInOrder: RawObjectsAndVerb[], isSolved = false) {
    this.piece = piece// TODO: should be
    this.isSolved = isSolved

    // if commandsCompletedInOrder is passed in, we deep copy it
    this.commandsCompletedInOrder = []
    if (commandsCompletedInOrder != null) {
      for (const command of commandsCompletedInOrder) {
        this.commandsCompletedInOrder.push(command)
      }
    }
  }

  public IsSolved (): boolean {
    return this.isSolved
  }

  public SetSolved (): void {
    this.isSolved = true
  }

  public GetCommandsCompletedInOrder (): RawObjectsAndVerb[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The best way to clone in is using 'map'
    return this.commandsCompletedInOrder.map((x) => x)
  }

  public PushCommand (rawObjectsAndVerb: RawObjectsAndVerb): void {
    this.commandsCompletedInOrder.push(rawObjectsAndVerb)
  }
}
