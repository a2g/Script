import promptSync from 'prompt-sync'; // const prompt = require('prompt-sync')({ sigint: true });
import { BigBoxViaSetOfBoxes } from '../puzzle/BigBoxViaSetOfBoxes.js';
import { Box } from '../puzzle/Box.js';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece.js';
import druids from '../scenarios/DruidsDelight/Campaign.json';
import { ChooseDigIntoGoals } from './ChooseDigIntoGoals.js';
import { ChooseListOfLeaves } from './ChooseListOfLeaves.js';
import { ChooseOrderOfGoals } from './ChooseOrderOfGoals.js';
import { ChooseToFindUnused } from './ChooseToFindUnused.js';
import { ChooseToPlayCampaign } from './ChooseToPlayCampaign.js';
import { Location } from './Location.js';

const prompt = promptSync();
/*
function GetLastSeg (path: string): string {
  const lastSeg = path
  if (path.includes('/')) { return path.substring(path.lastIndexOf('/') + 1) }
  return lastSeg
} */

function main(): void {
  while (true) {
    console.warn(process.cwd());
    console.warn(' ');
    console.warn(' Master Menu');
    console.warn('==================');
    console.warn('0. Play Campaign');

    const arrayOfFilenames: string[] = [];
    // initialize the map with
    let i = 1;
    const locations = new Map<string, Location>();
    for (const incoming of druids.locations) {
      const location = new Location();
      location.locationName = incoming.locationName;
      location.locationEnum = incoming.locationEnum;
      locations.set(location.locationEnum, location);
      arrayOfFilenames.push(incoming.startingGateFile);
      const { startingGateFile } = incoming;
      console.warn(`${i}. ${startingGateFile}`);
      i += 1;
    }

    const indexAsString = prompt('Choose an option (b)ail): ').toLowerCase();
    const index = Number(indexAsString) - 1;
    switch (indexAsString) {
      case 'b':
        return;
      case '0':
        ChooseToPlayCampaign();
        break;
      default:
        if (index >= 0 && index < arrayOfFilenames.length) {
          for (;;) {
            const filename = arrayOfFilenames[index];
            const firstBox = new Box(filename);
            firstBox.Init();
            const set = new Set<Box>();
            firstBox.CollectAllReferencedBoxesRecursively(set);
            const combined = new BigBoxViaSetOfBoxes(set);

            const solver = new SolverViaRootPiece(combined);
            const solverFirst = new SolverViaRootPiece(firstBox);

            console.warn(`\nSubMenu of ${filename[0]}`);
            console.warn('---------------------------------------');
            console.warn('1. Dig into Goals for COMBINED');
            console.warn('2. Dig into Goals for First Box solve');
            console.warn('3. List the Leaves for COMBINED.');
            console.warn('4. List the Leaves for First Box solve');
            console.warn('5. Order of Goals for First Box solve');
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
                ChooseDigIntoGoals(solver);
                break;
              case '2':
                ChooseDigIntoGoals(solverFirst);
                break;
              case '3':
                ChooseListOfLeaves(solver);
                break;
              case '4':
                ChooseListOfLeaves(solverFirst);
                break;
              case '5':
                ChooseOrderOfGoals(solverFirst);
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
