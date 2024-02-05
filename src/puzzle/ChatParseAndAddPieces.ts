import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { ChoicePage } from './dialog/ChoicePage'
import { Dialog } from './dialog/Dialog'
import { NonChoicePage } from './dialog/NonChoicePage'
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap'

export function ChatParseAndAddPieces(path: string, chat1: string, pileOrRootPieceMap: IPileOrRootPieceMap): void {
  const pathAndFile = path + chat1 + '.jsonc'
  if (!existsSync(pathAndFile)) {
    throw new Error(
      `The chat jsonc was ont found: ${pathAndFile} `
    )
  }
  const text = readFileSync(pathAndFile, 'utf-8')
  const parsedJson: any = parse(text)
  const chatter = parsedJson.chatter

  const dialog: Dialog = new Dialog();

  for (const key in chatter) {
    const array = chatter[key]

    if (key.endsWith('_choices')) {
      dialog.AddChoice(new ChoicePage(pathAndFile, key, array));
    } else {
      dialog.AddNonChoice(new NonChoicePage(pathAndFile, key, array));
    }
  }

  pileOrRootPieceMap.AddDialog(dialog)
}
