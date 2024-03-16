import { join } from 'path'
import * as fs from 'fs'
import { TalkFile } from '../puzzle/talk/TalkFile'
import { SimplePile } from '../puzzle/SimplePile'

export function DumpGainsFromEachTalkInFolder (folder: string): void {
  const cwd = process.cwd()
  process.chdir(join(__dirname, '/../../../..'))
  process.chdir(folder)

  const mapOGainsByPage = new Map<string, string>()

  const files = fs.readdirSync('.')
  for (const file of files) {
    if (file.startsWith('talks') && file.endsWith('.jsonc')) {
      const talkFile = new TalkFile(file, folder)
      const pile = new SimplePile()
      console.warn('')
      console.warn(`${file}`)
      console.warn('===========================')
      talkFile.FindAndAddPiecesRecursively('starter', folder, [], mapOGainsByPage, pile)
      for (const piece of pile.array) {
        let pieceString = `out:${piece.output}`
        for (const input of piece.inputHints) {
          pieceString += ` in:${input}`
        }
        console.warn(pieceString)
      }
    }
    process.chdir(cwd)
  }
}
