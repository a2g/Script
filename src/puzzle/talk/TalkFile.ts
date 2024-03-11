import { IdPrefixes } from '../../../IdPrefixes'
import { Piece } from '../Piece'
import { ChoiceSection } from './ChoiceSection'
import { GetNextId } from './GetNextId'
import { NonChoiceSection } from './NonChoiceSection'
import { IPileOrRootPieceMap } from '../IPileOrRootPieceMap'
import { existsSync } from 'fs'
import _ from '../../../puzzle-piece-enums.json'

export class TalkFile {
  name: string
  fileAddress: string
  choices: Map<string, ChoiceSection>
  nonChoices: Map<String, NonChoiceSection>

  constructor(name: string, fileAddress: string) {
    this.name = name
    this.fileAddress = fileAddress
    this.choices = new Map<string, ChoiceSection>()
    this.nonChoices = new Map<string, NonChoiceSection>()
  }

  public Clone(): TalkFile {
    const talkFile = new TalkFile(this.GetName(), this.fileAddress)
    for (const choice of this.choices.values()) {
      talkFile.AddChoicePage(choice.Clone())
    }
    for (const nonChoice of this.nonChoices.values()) {
      talkFile.AddNonChoicePage(nonChoice.Clone())
    }
    return talkFile
  }

  public AddChoicePage(choice: ChoiceSection): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoicePage(nonChoice: NonChoiceSection): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName(): string {
    return this.name
  }

  public FindAndAddPiecesRecursively(name: string, path: string, requisites: string[], mapOGainsByPage: Map<string, string>, pile: IPileOrRootPieceMap): void {
    // console.log(`>>>>${path}/${name}`)
    if (name.endsWith('choices')) {
      const choicePage = this.choices.get(name)
      if (choicePage != null) {
        for (const queue of choicePage.mapOfQueues.values()) {
          for (const line of queue.values()) {
            if (line.goto.length > 0 && !line.isUsed) {
              line.isUsed = true
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
            if (existsSync(`${this.fileAddress}${output}.jsonc`)) {
              isNoFile = false
            }
          } else if (output.startsWith(IdPrefixes.Inv)) {
            type = _.TALK_GAINS_INV1_WITH_VARIOUS_REQUISITES
          } else if (output.startsWith(IdPrefixes.Prop)) {
            type = _.TALK_GAINS_PROP1_WITH_VARIOUS_REQUISITES
          }
          const piece = new Piece(id, null, output, type, 1, null, null, null, inputA, inputB, inputC, inputD, inputE, inputF)
          piece.SetTalkPath(`${path}/${name}`)
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

  GetAllTheTalkingNeededToGetToPath(talkPath: any): string[][] {
    const toReturn = new Array<string[]>()
    const splitted: string[] = talkPath.split('/')

    for (let i = 0; i < splitted.length; i++) {
      const segment = splitted[i]
      if (segment.endsWith('choices')) {
        const choicePage = this.choices.get(segment)
        if (choicePage != null) {
          const talkings = choicePage.GetAllTalkingWhilstChoosing(splitted[i + 1])
          toReturn.push(...talkings)
        }
      } else {
        const nonChoicePage = this.nonChoices.get(segment)
        if (nonChoicePage != null) {
          const talkings = nonChoicePage.GetAllTalking()
          toReturn.push(...talkings)
        }
      }
    }

    return toReturn
  }

  Clear(): void {
    for (const choice of this.choices.values()) {
      for (const queue of choice.mapOfQueues.values()) {
        for (const line of queue.values()) {
          line.isUsed = false
        }
      }
    }
  }
}
