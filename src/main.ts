import promptSync from 'prompt-sync';
import { BigBoxViaSetOfBoxes } from './puzzle/BigBoxViaSetOfBoxes';
import { Box } from './puzzle/Box';
import { SolverViaRootPiece } from './puzzle/SolverViaRootPiece';
import druids from '../WorldExample/Campaign.json';
import { ChooseDigIntoGoals } from './cli/ChooseDigIntoGoals';
import { ChooseListOfLeaves } from './cli/ChooseListOfLeaves';
import { ChooseToFindUnused } from './cli/ChooseToFindUnused';
import { Area } from './cli/Area';
import { ChooseOrderOfCommands } from './cli/ChooseOrderOfCommands';
const prompt = promptSync();

function main(): void {
  for (;;) {
    console.warn(process.cwd());
    console.warn(' ');
    console.warn(' Master Menu');
    console.warn('==================');
    console.warn('0. Play Campaign');

    const arrayOfFilenames: string[] = [];
    // initialize the map with
    let i = 1;
    const areas = new Map<string, Area>();
    for (const incoming of druids.areas) {
      const area = new Area();
      area.areaName = incoming.areaName;
      area.areaEnum = incoming.areaEnum;
      areas.set(area.areaEnum, area);
      arrayOfFilenames.push(incoming.firstBoxFile);
      const { firstBoxFile } = incoming;
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
            const firstBox = new Box('./WorldExample/', filename);
            firstBox.Init();

            const allBoxes = new Set<Box>();
            firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
            const combined = new BigBoxViaSetOfBoxes(allBoxes);

            const solverPrimedWithCombined = new SolverViaRootPiece(combined);
            const solverPrimedWithFirstBox = new SolverViaRootPiece(firstBox);

            console.warn(`\nSubMenu of ${filename}`);
            console.warn(`number of pieces = ${solverPrimedWithCombined.GetSolutions()[0].GetSize()}`)
            console.warn('---------------------------------------');
            console.warn('1. Dig into Goals for COMBINED');
            console.warn('2. Dig into Goals for First Box');
            console.warn('3. List the Leaves for COMBINED.');
            console.warn('4. List the Leaves for First Box`');
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
