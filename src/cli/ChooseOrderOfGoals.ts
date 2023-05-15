import promptSync from 'prompt-sync';
import { FormatText } from '../puzzle/FormatText';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';
import { NavigatePieceRecursive } from './NavigatePieceRecursive';
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb';
const prompt = promptSync({});

export function ChooseOrderOfGoals(solver: SolverViaRootPiece): void {
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
    console.warn('been the cause of the problem on numerous occasions.');
    console.warn('');
    console.warn('List Leaf Pieces');
    console.warn('================');
    console.warn(`Number of solutions = ${numberOfSolutions}`);

    // list all leaves, of all solutions in order
    solver.GenerateSolutionNamesAndPush();

    let listItemNumber = 0;
    for (const solution of solver.GetSolutions()) {
      console.warn(FormatText(solution.GetDisplayNamesConcatenated()));
      console.warn(FormatText(solution.GetRootMap().CalculateListOfKeys()));
      const goals: Array<RawObjectsAndVerb> = solution.GetOrderOfGoals();
      for (const goal of goals) {
        listItemNumber++;
        console.warn(`    ${listItemNumber}. ${goal.AsDisplayString()}`);
      }
    }

    // allow user to choose item
    const input = prompt('Choose a goal (b)ack, (r)e-run: ').toLowerCase();
    if (input === null || input === 'b') {
      return;
    } else {
      // show map entry for chosen item
      const theNumber = Number(input);
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let i = 0;
        for (const solution of solver.GetSolutions()) {
          const goals: Array<RawObjectsAndVerb> = solution.GetOrderOfGoals();
          for (const goal of goals) {
            i++;
            if (i === theNumber) {
              const rootPiece = solution
                .GetRootMap()
                .GetRootPieceByName(goal.AsDisplayString());
              NavigatePieceRecursive(rootPiece.piece, solution.GetRootMap());
            }
          }
        }
      }
    }
  }
}
