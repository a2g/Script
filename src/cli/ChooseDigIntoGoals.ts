import promptSync from 'prompt-sync';
import { AddBrackets } from '../puzzle/AddBrackets';
import { FormatText } from '../puzzle/FormatText';
import { SolverViaRootPiece } from '../puzzle/SolverViaRootPiece';
import { TrimNonIntegratedRootPieces } from '../puzzle/TrimNonIntegratedRootPieces';
import { NavigatePieceRecursive } from './NavigatePieceRecursive';

const prompt = promptSync({});

export function ChooseDigIntoGoals(solver: SolverViaRootPiece): void {
  console.warn('ChooseDigIntoGoals... ');

  for (;;) {
    solver.MarkGoalsAsCompletedAndMergeIfNeeded();
    const numberOfSolutions: number = solver.NumberOfSolutions();
    console.warn('Dig in to goals');
    console.warn('===============');
    console.warn(`Number of solutions in solver = ${numberOfSolutions}`);

    solver.GenerateSolutionNamesAndPush();

    // display list
    let incomplete = 0;
    let listItemNumber = 0;
    let solutionNumber = 65;
    for (const solution of solver.GetSolutions()) {
      TrimNonIntegratedRootPieces(solution);
      const letter = String.fromCharCode(solutionNumber++);
      console.warn(
        letter +
          '. ' +
          FormatText(solution.GetDisplayNamesConcatenated()) +
          '<--unique name'
      );
      for (const array of solution.GetRootMap().GetValues()) {
        for (const item of array) {
          listItemNumber++;

          // display list item
          const status: string = item.firstNullInput;
          let { output } = item.piece;
          let inputs = '';
          for (const input of item.piece.inputHints) {
            inputs += `${FormatText(input)},`;
          }
          console.warn(
            `    ${listItemNumber}. ${FormatText(output)} ${AddBrackets(
              inputs
            )} (status=${status})`
          );
          incomplete += status.length > 0 ? 1 : 0;
        }
      }
    }
    console.warn(`Number of goals incomplete ${incomplete}/${listItemNumber}`);

    // allow user to choose item
    const input = prompt(
      'Choose goal to dig down on or (b)ack, (r)e-run: '
    ).toLowerCase();
    if (input === null || input === 'b') {
      return;
    }
    if (input === 'r') {
      solver.SolvePartiallyUntilCloning();
      continue;
    } else {
      // show map entry for chosen item
      const theNumber = Number(input);
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let i = 0;
        for (const solution of solver.GetSolutions()) {
          const goals = solution.GetRootMap().GetValues();
          for (const array of goals) {
            for (const goal of array) {
              i++;
              if (i === theNumber) {
                NavigatePieceRecursive(goal.piece, solution.GetRootMap());
              }
            }
          }
        }
      }
    }
  }
}
