import { IdPrefixes } from '../../../IdPrefixes'
import { Piece } from '../Piece'
import { ChoicePage } from './ChoicePage'
import { GetNextId } from './GetNextId'
import { NonChoicePage } from './NonChoicePage'
import _ from '../../../puzzle-piece-enums.json'
import { IPileOrRootPieceMap } from '../IPileOrRootPieceMap'

export class ChatFile {
  name: string
  choices: Map<string, ChoicePage>
  nonChoices: Map<String, NonChoicePage>

  constructor(name: string) {
    this.name = name
    this.choices = new Map<string, ChoicePage>()
    this.nonChoices = new Map<string, NonChoicePage>()
  }

  public Clone(): ChatFile {
    const dialog = new ChatFile(this.GetName())
    for (const choice of this.choices.values()) {
      dialog.AddChoicePage(choice.Clone())
    }
    for (const nonChoice of this.nonChoices.values()) {
      dialog.AddNonChoicePage(nonChoice.Clone())
    }
    return dialog
  }

  public AddChoicePage(choice: ChoicePage): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoicePage(nonChoice: NonChoicePage): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName(): string {
    return this.name
  }

  public FindAndAddPiecesRecursively(name: string, path: string, requisites: string[], pile: IPileOrRootPieceMap): void {
    if (name.endsWith('_choices')) {
      const choicePage = this.choices.get(name)
      if (choicePage != null) {
        for (const queue of choicePage.mapOfQueues.values()) {
          for (const line of queue.values()) {
            if (line.goto.length > 0) {
              this.FindAndAddPiecesRecursively(line.goto, `${path}/${name}`, [...requisites, ...line.theseRequisites], pile)
            }
          }
        }
      }
    } else {
      const nonChoicePage = this.nonChoices.get(name)
      if (nonChoicePage != null) {
        if (nonChoicePage.gains.length > 0) {
          const output = nonChoicePage.gains
          const inputA = (requisites.length > 0) ? requisites[0] : 'undefined'
          const inputB = (requisites.length > 1) ? requisites[1] : 'undefined'
          const inputC = (requisites.length > 2) ? requisites[2] : 'undefined'
          const inputD = (requisites.length > 3) ? requisites[3] : 'undefined'
          const inputE = (requisites.length > 4) ? requisites[4] : 'undefined'
          const inputF = (requisites.length > 5) ? requisites[5] : 'undefined'
          const id = GetNextId()
          let type = ''
          if (output.startsWith(IdPrefixes.Goal)) {
            type = _.TALK_GAINS_GOAL1_WITH_VARIOUS_REQUISITES
          } else if (output.startsWith(IdPrefixes.Inv)) {
            type = _.TALK_GAINS_INV1_WITH_VARIOUS_REQUISITES
          } else if (output.startsWith(IdPrefixes.Prop)) {
            type = _.TALK_GAINS_PROP1_WITH_VARIOUS_REQUISITES
          }
          const piece = new Piece(id, null, output, type, 1, null, null, null, inputA, inputB, inputC, inputD, inputE, inputF)
          pile.AddPiece(piece, '', true)
        }
      }
    }
  }
}
