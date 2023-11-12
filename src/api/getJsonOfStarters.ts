import * as fs from 'fs';
import { Suffix } from '../../Suffix';

interface $IStarter {
  name: string;
  repo: string;
  world: string;
  area: string;
}

export function getJsonOfStarters(): Array<$IStarter> {
  process.chdir('./..');

  const allFolders = new Array<[string, string]>();
  allFolders.push(['puzzle-pieces', 'practice-world']);

  // lets try adding more folders from 'private-world'
  // but that folder may not exist, so we try/catch it

  const ignoreSet = new Set([
    'settings.jsonc',
    '.gitmodules',
    '.gitignore',
    'package.jsonc',
    'tsconfig.jsonc',
    '.git',
  ]);
  process.chdir('./exclusive-worlds');
  const folders = fs.readdirSync('.');
  for (const folder of folders) {
    if (!ignoreSet.has(folder)) {
      allFolders.push([`exclusive-worlds`, folder]);
    }
  }
  process.chdir('..');

  const toReturn = new Array<$IStarter>();
  for (const folder of allFolders) {
    process.chdir(`./${folder[0]}`);
    const files = fs.readdirSync('.');
    for (const file of files) {
      if (file.endsWith(`${Suffix.FirstBox}.jsonc`)) {
        toReturn.push({
          name: `./${folder[0]}/${folder[1]}/${file}`,
          repo: folder[0],
          world: folder[1],
          area: file,
        });
      }
    }
    process.chdir('..');
    process.chdir('..');
  }

  return toReturn;
}
