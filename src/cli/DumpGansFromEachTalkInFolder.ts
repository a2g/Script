import { join } from 'path'
import * as fs from 'fs'
import { TalkFile } from '../puzzle/talk/TalkFile'
import { Aggregates } from '../puzzle/Aggregates'
import { Box } from '../puzzle/Box'

export function DumpGainsFromEachTalkInFolder (folder: string): void {
  const cwd = process.cwd()
  process.chdir(join(__dirname, '/../../../..'))
  process.chdir(folder)

  console.warn('Results of FindAndAddPiecesRecursively')
  const files = fs.readdirSync('.')
  for (const file of files) {
    if (file.startsWith('talks') && file.endsWith('.jsonc')) {
      const aggregates = new Aggregates()
      const talkFile = new TalkFile(file, folder, aggregates)

      const mapOGainsByPage = new Map<string, string>()
      const emptyBox = new Box('path', '', new Aggregates())
      console.warn('')
      console.warn(`${file}`)
      console.warn('===========================')
      talkFile.FindAndAddPiecesRecursively('starter', '', [], mapOGainsByPage, emptyBox)

      for (const set of emptyBox.GetPieces().values()) {
        for (const piece of set) {
          let pieceString = `out: ${piece.output}`
          for (const input of piece.inputHints) {
            pieceString += ` in: ${input}`
          }
          console.warn(pieceString)
        }
      }
    }
    process.chdir(cwd)
  }
}
