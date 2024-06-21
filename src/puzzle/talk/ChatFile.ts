import { IdPrefixes } from '../../../IdPrefixes'
import { Piece } from '../Piece'
import { ChoiceSection } from './ChoiceSection'
import { GetNextId } from './GetNextId'
import { NonChoiceSection } from './NonChoiceSection'
import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'

import _ from '../../../puzzle-piece-enums.json'
import { Aggregates } from '../Aggregates'
import { AddPiece } from '../AddPiece'
import { Box } from '../Box'

export class ChatFile {
  filename: string
  fileAddress: string
  choices: Map<string, ChoiceSection>
  nonChoices: Map<string, NonChoiceSection>
  aggregates: Aggregates

  constructor (filename: string, fileAddress: string, aggregates: Aggregates) {
    this.filename = filename
    this.fileAddress = fileAddress
    this.choices = new Map<string, ChoiceSection>()
    this.nonChoices = new Map<string, NonChoiceSection>()
    this.aggregates = aggregates

    const pathAndFile = fileAddress + filename
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The chats_xxxx.jsonc was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const parsedJson: any = parse(text)
    const chats = parsedJson.chats

    for (const key in chats) {
      const array = chats[key]

      if (key.endsWith('_choices')) {
        const choiceSection = new ChoiceSection(pathAndFile, key)
        choiceSection.Init(array)
        this.AddChoiceSection(choiceSection)
      } else {
        const nonChoiceSection = new NonChoiceSection(pathAndFile, key)
        nonChoiceSection.Init(array)
        this.AddNonChoiceSection(nonChoiceSection)
      }
    }
  }

  public Clone (): ChatFile {
    const chatFile = new ChatFile(this.GetName(), this.fileAddress, this.aggregates)
    for (const choice of this.choices.values()) {
      chatFile.AddChoiceSection(choice.Clone())
    }
    for (const nonChoice of this.nonChoices.values()) {
      chatFile.AddNonChoiceSection(nonChoice.Clone())
    }
    return chatFile
  }

  public AddChoiceSection (choice: ChoiceSection): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoiceSection (nonChoice: NonChoiceSection): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName (): string {
    return this.filename
  }

  public FindAndAddPiecesRecursively (name: string, path: string, requisites: string[], mapOGainsBySection: Map<string, string>, box: Box): void {
    // console.log(`>>>>${path}/${name}`)
    if (name.endsWith('choices')) {
      const choiceSection = this.choices.get(name)
      if (choiceSection != null) {
        for (const queue of choiceSection.mapOfQueues.values()) {
          for (const line of queue.values()) {
            if (line.goto.length > 0 && !line.isUsed) {
              line.isUsed = true
              this.FindAndAddPiecesRecursively(line.goto, `${path}/${name}`, [...requisites, ...line.theseRequisites], mapOGainsBySection, box)
            }
          }
        }
      }
    } else {
      const nonChoiceSection = this.nonChoices.get(name)
      if (nonChoiceSection != null) {
        // we create a piece from a gains
        if (nonChoiceSection.gains.length > 0 && !mapOGainsBySection.has(name)) {
          const output = nonChoiceSection.gains
          const inputA = (requisites.length > 0) ? requisites[0] : 'undefined'
          const inputB = (requisites.length > 1) ? requisites[1] : 'undefined'
          const inputC = (requisites.length > 2) ? requisites[2] : 'undefined'
          const inputD = (requisites.length > 3) ? requisites[3] : 'undefined'
          const inputE = (requisites.length > 4) ? requisites[4] : 'undefined'
          const inputF = (requisites.length > 5) ? requisites[5] : 'undefined'
          let type = ''
          let isNoFile = true
          if (output.startsWith(IdPrefixes.Achievement) || output.startsWith(IdPrefixes.InvAchievement)) {
            type = _.CHAT_GAINS_AMENT1_WITH_VARIOUS_REQUISITES
            if (existsSync(`${this.fileAddress}${output}.jsonc`)) {
              isNoFile = false
            }
          } else if (output.startsWith(IdPrefixes.Inv)) {
            type = _.CHAT_GAINS_INV1_WITH_VARIOUS_REQUISITES
          } else if (output.startsWith(IdPrefixes.Obj)) {
            type = _.CHAT_GAINS_OBJ1_WITH_VARIOUS_REQUISITES
          }
          // important that it uses the next id here
          const id = GetNextId() + 't' + (isNoFile ? '' : 'm')
          const piece = new Piece(id, null, output, type, 1, null, null, null, inputA, inputB, inputC, inputD, inputE, inputF)
          piece.SetChatPath(`${path}/${name}`)
          AddPiece(piece, this.fileAddress, isNoFile, box, this.aggregates)
          mapOGainsBySection.set(name, output)
        } else if (nonChoiceSection.goto.length > 0) {
          // nonChoice sections only have one goto
          // but they have a name - its valid
          // unlike choices, they don't have requisites, so we add existing
          this.FindAndAddPiecesRecursively(nonChoiceSection.goto, `${path}/${name}`, requisites, mapOGainsBySection, box)
        }
      }
    }
  }

  CollectSpeechLinesNeededToGetToPath (chatPath: any): string[][] {
    const toReturn = new Array<string[]>()
    const splitted: string[] = chatPath.split('/')

    for (let i = 0; i < splitted.length; i++) {
      const segment = splitted[i]
      if (segment.endsWith('choices')) {
        const choiceSection = this.choices.get(segment)
        if (choiceSection != null) {
          const chatings = choiceSection.GetAllChatingWhilstChoosing(splitted[i + 1])
          toReturn.push(...chatings)
        }
      } else {
        const nonChoiceSection = this.nonChoices.get(segment)
        if (nonChoiceSection != null) {
          const chatings = nonChoiceSection.GetAllChating()
          toReturn.push(...chatings)
        }
      }
    }

    return toReturn
  }

  Clear (): void {
    for (const choice of this.choices.values()) {
      for (const queue of choice.mapOfQueues.values()) {
        for (const line of queue.values()) {
          line.isUsed = false
        }
      }
    }
  }
}
