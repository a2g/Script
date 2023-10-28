import promptSync from 'prompt-sync';
import { BigBoxViaSetOfBoxes } from './puzzle/BigBoxViaSetOfBoxes';
import { Box } from './puzzle/Box';
import { SolverViaRootPiece } from './puzzle/SolverViaRootPiece';
import { ChooseDigIntoGoals } from './cli/ChooseDigIntoGoals';
import { ChooseListOfLeaves } from './cli/ChooseListOfLeaves';
import { ChooseOrderOfCommands } from './cli/ChooseOrderOfCommands';
import { ChooseToFindUnused } from './cli/ChooseToFindUnused';
import { readFileSync } from 'fs';
import { Suffix } from '../Suffix';
import { parse } from 'jsonc-parser';
import * as fs from 'fs';
import { assert } from 'console';
const prompt = promptSync();

function main(): void {
  process.chdir('./..');

  const allFolders = new Array<string>();
  allFolders.push('jigsaw/practice-world');

  // lets try adding more folders from 'private-world'
  // but that folder may not exist, so we try/catch it
  try {
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
        allFolders.push(`exclusive-worlds/${folder}`);
      }
    }
    process.chdir('..');
  } catch (Error) {
    throw new EvalError('Check your file paths!');
  }

  for (;;) {
    let i = 1;
    for (const campaign of allFolders) {
      console.warn(`${i}. ${campaign}  ${i}`);
      i += 1;
    }

    const indexAsString = prompt('Choose an campaign (b)ail): ').toLowerCase();
    const index = Number(indexAsString) - 1;
    switch (indexAsString) {
      case 'b':
        return;
      default:
        if (index >= 0 && index < allFolders.length) {
          ChooseArea(allFolders[index]);
        }
    }
  }
}

function ChooseArea(folder: string) {
  const text = readFileSync(`${folder}/${Suffix.Campaign}.jsonc`, 'utf-8');
  const druids = parse(text);

  for (;;) {
    console.warn(process.cwd());
    console.warn(' ');
    console.warn(' Master Menu');
    console.warn('==================');
    console.warn('0. Play Campaign');

    assert(Array.isArray(druids.areas));
    const arrayOfFilenames: string[] = [];
    // initialize the map with
    let i = 1;
    // const areas = new Map<string, Area>();
    for (const firstBoxFile of druids.areas) {
      arrayOfFilenames.push(firstBoxFile);
      console.warn(`${i}. ${firstBoxFile}`);
      i += 1;
    }

    const indexAsString = prompt('Choose an area (b)ail): ').toLowerCase();
    const index = Number(indexAsString) - 1;
    switch (indexAsString) {
      case 'b':
        return;
      case '0':
        return; //ChooseToPlayCampaign();
      default:
        if (index >= 0 && index < arrayOfFilenames.length) {
          for (;;) {
            const filename = arrayOfFilenames[index];
            const firstBox = new Box(`${folder}/`, filename);
            firstBox.Init();

            const allBoxes = new Set<Box>();
            firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
            const combined = new BigBoxViaSetOfBoxes(allBoxes);

            const solverPrimedWithCombined = new SolverViaRootPiece(combined);
            const solverPrimedWithFirstBox = new SolverViaRootPiece(firstBox);

            console.warn(`\nSubMenu of ${filename}`);
            console.warn(
              `number of pieces = ${solverPrimedWithCombined
                .GetSolutions()[0]
                .GetSize()}`
            );
            console.warn('---------------------------------------');
            console.warn('1. Dig into Goals for COMBINED');
            console.warn('2. Dig into Goals for First Box');
            console.warn('3. List the Leaves for COMBINED.');
            console.warn('4. List the Leaves for First Box`');
            console.warn('5. Order of Commands for First Box solve');
            console.warn(
              '6. Check for unused props and invs <-- delete these from enums'
            );
            console.warn('8. Play');

            const choice = prompt('Choose an option (b)ack: ').toLowerCase();
            if (choice === 'b') {
              break;
            }
            switch (choice) {
              case '1':
                ChooseDigIntoGoals(solverPrimedWithCombined);
                break;
              case '2':
                ChooseDigIntoGoals(solverPrimedWithFirstBox);
                break;
              case '3':
                ChooseListOfLeaves(solverPrimedWithCombined);
                break;
              case '4':
                ChooseListOfLeaves(solverPrimedWithFirstBox);
                break;
              case '5':
                ChooseOrderOfCommands(solverPrimedWithFirstBox);
                break;
              case '6':
                ChooseToFindUnused(combined);
                break;
              default:
            }
          }
        }
    }
  }
}

main();
