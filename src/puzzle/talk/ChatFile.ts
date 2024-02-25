import { IdPrefixes } from '../../../IdPrefixes'
import { Piece } from '../Piece'
import { ChoicePage } from './ChoicePage'
import { GetNextId } from './GetNextId'
import { NonChoicePage } from './NonChoicePage'
import _ from '../../../puzzle-piece-enums.json'
import { IPileOrRootPieceMap } from '../IPileOrRootPieceMap'
import { existsSync } from 'fs'

export class ChatFile {
  name: string
  fileAddress: string
  choices: Map<string, ChoicePage>
  nonChoices: Map<String, NonChoicePage>

  constructor (name: string, fileAddress: string) {
    this.name = name
    this.fileAddress = fileAddress
    this.choices = new Map<string, ChoicePage>()
    this.nonChoices = new Map<string, NonChoicePage>()
  }

  public Clone (): ChatFile {
    const dialog = new ChatFile(this.GetName(), this.fileAddress)
    for (const choice of this.choices.values()) {
      dialog.AddChoicePage(choice.Clone())
    }
    for (const nonChoice of this.nonChoices.values()) {
      dialog.AddNonChoicePage(nonChoice.Clone())
    }
    return dialog
  }

  public AddChoicePage (choice: ChoicePage): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoicePage (nonChoice: NonChoicePage): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName (): string {
    return this.name
  }

  public FindAndAddPiecesRecursively (name: string, path: string, requisites: string[], mapOGainsByPage: Map<string, string>, pile: IPileOrRootPieceMap): void {
    if (name.endsWith('_choices')) {
      const choicePage = this.choices.get(name)
      if (choicePage != null) {
        for (const queue of choicePage.mapOfQueues.values()) {
          for (const line of queue.values()) {
            if (line.goto.length > 0) {
              this.FindAndAddPiecesRecursively(line.goto, `${path}/${name}`, [...requisites, ...line.theseRequisites], mapOGainsByPage, pile)
            }
          }
        }
      }
    } else {
      const nonChoicePage = this.nonChoices.get(name)
      if (nonChoicePage != null) {
        if (nonChoicePage.gains.length > 0 && !mapOGainsByPage.has(name)) {
          const output = nonChoicePage.gains
          const inputA = (requisites.length > 0) ? requisites[0] : 'undefined'
          const inputB = (requisites.length > 1) ? requisites[1] : 'undefined'
          const inputC = (requisites.length > 2) ? requisites[2] : 'undefined'
          const inputD = (requisites.length > 3) ? requisites[3] : 'undefined'
          const inputE = (requisites.length > 4) ? requisites[4] : 'undefined'
          const inputF = (requisites.length > 5) ? requisites[5] : 'undefined'
          const id = GetNextId()
          let type = ''
          let isNoFile = true
          if (output.startsWith(IdPrefixes.Goal)) {
            type = _.TALK_GAINS_GOAL1_WITH_VARIOUS_REQUISITES
            if (existsSync(this.fileAddress + output + '.jsonc')) {
              isNoFile = false
            }
          } else if (output.startsWith(IdPrefixes.Inv)) {
            type = _.TALK_GAINS_INV1_WITH_VARIOUS_REQUISITES
          } else if (output.startsWith(IdPrefixes.Prop)) {
            type = _.TALK_GAINS_PROP1_WITH_VARIOUS_REQUISITES
          }
          const piece = new Piece(id, null, output, type, 1, null, null, null, inputA, inputB, inputC, inputD, inputE, inputF)
          pile.AddPiece(piece, this.fileAddress, isNoFile)
          mapOGainsByPage.set(name, output)
        } else if (nonChoicePage.goto.length > 0) {
          // nonChoice pages only have one goto
          // but they have a name - its valid
          // unlike choices, they don't have requisites, so we add existing
          this.FindAndAddPiecesRecursively(nonChoicePage.goto, `${path}/${name}`, requisites, mapOGainsByPage, pile)
        }
      }
    }
  }
}
