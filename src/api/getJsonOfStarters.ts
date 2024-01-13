import * as fs from 'fs'
import { join } from 'path'
import { Suffix } from '../../Suffix'

export interface $IStarter {
  // used by CLI
  file: string
  folder: string
  // used by web UI
  repo: string
  world: string
  area: string
  repoSlashWorldSlashArea: string
  // used by both
  displayName: string
}

export function getJsonOfStarters (): $IStarter[] {
  process.chdir(join(__dirname, '/../../../..'))

  const allFolders = new Array<[string, string]>()
  allFolders.push(['puzzle-pieces', 'practice-world'])

  // lets try adding more folders from 'private-world'
  // but that folder may not exist, so we try/catch it

  const ignoreSet = new Set([
    'settings.json',
    '.gitmodules',
    '.gitignore',
    'package.json',
    'tsconfig.json',
    '.git'
  ])
  process.chdir('./exclusive-worlds')
  const folders = fs.readdirSync('.')
  for (const folder of folders) {
    if (!ignoreSet.has(folder)) {
      allFolders.push(['exclusive-worlds', folder])
    }
  }
  process.chdir('..')

  const toReturn = new Array<$IStarter>()
  for (const folder of allFolders) {
    const repo = folder[0]
    const world = folder[1]
    process.chdir(`./${repo}/${world}`)
    const files = fs.readdirSync('.')
    for (const file of files) {
      if (file.endsWith(`${Suffix.FirstBox}.jsonc`)) {
        const index = file.indexOf(Suffix.FirstBox)
        const area = file.substring(0, index)
        toReturn.push({
          // these are needed for CLI
          file,
          folder: `${repo}/${world}/`,
          // used by web ui
          repo,
          world,
          area: file,
          repoSlashWorldSlashArea: `${repo}/${world}/${area}`,
          // used by both
          displayName: `${repo}/${world}/${area}`
        })
      }
    }
    process.chdir('..')
    process.chdir('..')
  }

  return toReturn
}
