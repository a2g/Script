import { join } from 'path'
import * as fs from 'fs'
import { TalkFile } from '../puzzle/talk/TalkFile'
import { Aggregates } from '../puzzle/Aggregates'
import { Piece } from '../puzzle/Piece'

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
      const pile = new Map<string, Set<Piece>>()
      const goalWords = new Set<string>()
      const mapOGainsByPage = new Map<string, string>()
      console.warn('')
      console.warn(`${file}`)
      console.warn('===========================')
      talkFile.FindAndAddPiecesRecursively('starter', '', [], mapOGainsByPage, pile, goalWords)

      for (const set of pile.values()) {
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
