import promptSync from 'prompt-sync';
import { FormatText } from '../puzzle/FormatText';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
const prompt = promptSync({});

export function ChooseOrderOfCommands(solver: SolverViaRootPiece): void {
  console.warn(' ');

  for (;;) {
    for (let i = 0; i < 20; i++) {
      solver.SolvePartiallyUntilCloning();
      solver.MarkGoalsAsCompletedAndMergeIfNeeded();
    }
    const numberOfSolutions: number = solver.NumberOfSolutions();

    console.warn('If any leaves are not resolved properly, for example');
    console.warn(' - eg items show up as not found when they should be');
    console.warn(' starting props, or inv items that should not be leafs.');
    console.warn(
      'Then add these to starting sets; or fix up pieces, such that'
    );
    console.warn(
      'the dependent pieces are discovered; or introduce goal pieces'
    );
    console.warn('for items that two goals need, but only one ends up with.');
    console.warn('GOTCHA: Also validate boxes against schema, as this has ');
    console.warn('been the cause of the problem numerous times.');
    console.warn('');
    console.warn('List of Commands');
    console.warn('================');
    console.warn(`Number of solutions = ${numberOfSolutions}`);

    // list all leaves, of all solutions in order
    solver.GenerateSolutionNamesAndPush();

    let listItemNumber = 0;
    for (const solution of solver.GetSolutions()) {
      console.warn(FormatText(solution.GetDisplayNamesConcatenated()));
      console.warn(FormatText(solution.GetRootMap().CalculateListOfKeys()));
      const commands: Array<RawObjectsAndVerb> = solution.GetOrderOfCommands();
      for (const command of commands) {
        listItemNumber++;
        console.warn(`    ${listItemNumber}. ${command.AsDisplayString()}`);
      }
    }

    // allow user to choose item
    const input = prompt('Choose a step (b)ack, (r)e-run: ').toLowerCase();
    if (input === null || input === 'b') {
      return;
    } else {
      // show map entry for chosen item
      const theNumber = Number(input);
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let i = 0;
        for (const solution of solver.GetSolutions()) {
          const commands: Array<RawObjectsAndVerb> = solution.GetOrderOfCommands();
          for (const command of commands) {
            i++;
            if (i === theNumber) {
              console.log(
                `Command info: ${command.type} ${command.objectA} ${command.objectB}`
              );
              prompt('Hit a key to continue');
              break;
            }
          }
        }
      }
    }
  }
}
