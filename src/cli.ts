import promptSync from 'prompt-sync';
import { BigBoxViaSetOfBoxes } from './puzzle/BigBoxViaSetOfBoxes';
import { Box } from './puzzle/Box';
import { SolverViaRootPiece } from './puzzle/SolverViaRootPiece';
import { ChooseDigIntoGoals } from './cli/ChooseDigIntoGoals';
import { ChooseListOfLeaves } from './cli/ChooseListOfLeaves';
import { ChooseOrderOfCommands } from './cli/ChooseOrderOfCommands';
import { ChooseToFindUnused } from './cli/ChooseToFindUnused';
import { $IStarter, getJsonOfStarters } from './api/getJsonOfStarters';
const prompt = promptSync();

function main(): void {
  const starters: $IStarter[] = getJsonOfStarters();

  for (;;) {
    for (let i = 1; i <= starters.length; i++) {
      const starter = starters[i - 1];
      console.warn(`${i}. ${starter.world} ${starter.area}  ${i}`);
    }

    const indexAsString = prompt('Choose an area (b)ail): ').toLowerCase();
    const index = Number(indexAsString) - 1;
    switch (indexAsString) {
      case 'b':
        return;
      default:
        if (index >= 0 && index < starters.length) {
          for (;;) {
            const starter = starters[index];
            const firstBox = new Box(
              starter.folderPathWithBackclash,
              starter.file
            );
            firstBox.Init();

            const allBoxes = new Set<Box>();
            firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
            const combined = new BigBoxViaSetOfBoxes(allBoxes);

            const solverPrimedWithCombined = new SolverViaRootPiece(combined);
            const solverPrimedWithFirstBox = new SolverViaRootPiece(firstBox);

            console.warn(`\nSubMenu of ${starter.file}`);
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
