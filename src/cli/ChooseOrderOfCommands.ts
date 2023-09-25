import promptSync from 'prompt-sync';
import { FormatText } from '../puzzle/FormatText';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
const prompt = promptSync({});

export function ChooseOrderOfCommands(solver: SolverViaRootPiece): void {
  console.warn(' ');

  for (;;) {
    for (let i = 0; i < 200; i++) {
      solver.SolvePartiallyUntilCloning();
      solver.MarkGoalsAsCompletedAndMergeIfNeeded();
    }
    solver.GenerateSolutionNamesAndPush();
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
    console.warn('Pick solution');
    console.warn('================');
    console.warn(`Number of solutions = ${numberOfSolutions}`);
    console.warn(`    0. All solutions`);
    for (let i = 0; i < solver.GetSolutions().length; i++) {
      const solution = solver.GetSolutions()[i];
      const name = FormatText(solution.GetDisplayNamesConcatenated());
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${name}`);
    }

    // allow user to choose item
    const input = prompt(
      'Choose an ingredient of one of the solutions or (b)ack, (r)e-run: '
    ).toLowerCase();

    if (input === null || input === 'b') {
      return;
    }

    if (input === 'b') {
      continue;
    }
    const theNumber = Number(input);
    // list all leaves, of all solutions in order
    const name =
      theNumber === 0
        ? 'all solutions'
        : solver.GetSolutions()[theNumber - 1].GetDisplayNamesConcatenated();
    console.warn(`List of Commands for ${name}`);
    console.warn('================');

    let listItemNumber = 0;
    for (let i = 0; i < solver.GetSolutions().length; i++) {
      const solution = solver.GetSolutions()[i];
      if (theNumber === 0 || theNumber - 1 === i) {
        const commands: Array<RawObjectsAndVerb> =
          solution.GetOrderOfCommands();
        for (const command of commands) {
          listItemNumber++;
          console.warn(`    ${listItemNumber}. ${command.AsDisplayString()}`);
        }
      }
    }

    // allow user to choose item
    const input2 = prompt('Choose a step (b)ack, (r)e-run: ').toLowerCase();
    if (input2 === null || input2 === 'b') {
      return;
    } else {
      // show map entry for chosen item
      const theNumber2 = Number(input2);
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let j = 0;
        for (let i = 0; i < solver.GetSolutions().length; i++) {
          const solution = solver.GetSolutions()[i];
          if (theNumber === 0 || theNumber === i) {
            const commands: Array<RawObjectsAndVerb> =
              solution.GetOrderOfCommands();
            for (const command of commands) {
              j++;
              if (j === theNumber2) {
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
}
