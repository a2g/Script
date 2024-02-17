import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { ChoicePage } from './chat/ChoicePage'
import { ChatFile } from './chat/ChatFile'
import { NonChoicePage } from './chat/NonChoicePage'
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap'

export function ChatParseAndAddPieces(path: string, chat1: string, pile: IPileOrRootPieceMap): void {
  const dialog = createDialogFromJsonFile(path, chat1)
  pile.AddDialog(dialog)
  dialog.FindAndAddPiecesRecursively('starter', '', [], pile)
}

function createDialogFromJsonFile(path: string, chat1: string): ChatFile {
  const pathAndFile = path + chat1 + '.jsonc'
  if (!existsSync(pathAndFile)) {
    throw new Error(
      `The chat jsonc was ont found: ${pathAndFile} `
    )
  }
  const text = readFileSync(pathAndFile, 'utf-8')
  const parsedJson: any = parse(text)
  const chatter = parsedJson.chatter

  const dialog: ChatFile = new ChatFile(chat1)

  for (const key in chatter) {
    const array = chatter[key]

    if (key.endsWith('_choices')) {
      const choicePage = new ChoicePage(pathAndFile, key)
      choicePage.Init(array)
      dialog.AddChoicePage(choicePage)
    } else {
      const nonChoicePage = new NonChoicePage(pathAndFile, key)
      nonChoicePage.Init(array)
      dialog.AddNonChoicePage(nonChoicePage)
    }
  }
  return dialog
}
