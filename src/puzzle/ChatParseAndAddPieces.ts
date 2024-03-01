import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { ChoiceSection } from './talk/ChoiceSection'
import { TalkFile } from './talk/TalkFile'
import { NonChoiceSection } from './talk/NonChoiceSection'
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap'

export function ChatParseAndAddPieces (path: string, talk1: string, pile: IPileOrRootPieceMap): void {
  const talk = createTalkFileFromJsonFile(path, talk1)
  pile.AddTalkFile(talk)
  const blankMap = new Map<string, string>()
  // talk1 is a subclass of a prop: it represents the character that
  // you interact with and can be visible and invisible - just like a prop
  // To talk to a prop it needs to be visible, so we add talk1 as a requisite
  talk.FindAndAddPiecesRecursively('starter', '', [talk1], blankMap, pile)
}

function createTalkFileFromJsonFile (fileAddress: string, talk1: string): TalkFile {
  const pathAndFile = fileAddress + talk1 + '.jsonc'
  if (!existsSync(pathAndFile)) {
    throw new Error(
      `The chat jsonc was ont found: ${pathAndFile} `
    )
  }
  const text = readFileSync(pathAndFile, 'utf-8')
  const parsedJson: any = parse(text)
  const chatter = parsedJson.chatter

  const talkFile: TalkFile = new TalkFile(talk1, fileAddress)

  for (const key in chatter) {
    const array = chatter[key]

    if (key.endsWith('_choices')) {
      const choicePage = new ChoiceSection(pathAndFile, key)
      choicePage.Init(array)
      talkFile.AddChoicePage(choicePage)
    } else {
      const nonChoicePage = new NonChoiceSection(pathAndFile, key)
      nonChoicePage.Init(array)
      talkFile.AddNonChoicePage(nonChoicePage)
    }
  }
  return talkFile
}
