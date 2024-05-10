import promptSync from 'prompt-sync'
import { FormatText } from '../puzzle/FormatText'
import { Piece } from '../puzzle/Piece'
import { SolutionCollection } from '../puzzle/SolutionCollection'

const prompt = promptSync({})

export function ChooseListOfLeaves (solver: SolutionCollection): void {
  console.warn(' ')

  for (;;) {
    solver.SolvePartiallyUntilCloning()
    solver.MarkGoalsAsCompletedAndMergeIfNeeded()
    const numberOfSolutions: number = solver.NumberOfSolutions()

    console.warn('If any leaves are not resolved properly, for example')
    console.warn(' - eg items show up as not found when they should be')
    console.warn(' starting props, or inv items that should not be leafs.')
    console.warn(
      'Then add these to starting sets; or fix up pieces, such that'
    )
    console.warn(
      'the dependent pieces are discovered; or introduce goal pieces'
    )
    console.warn('for items that two goals need, but only one ends up with.')
    console.warn('GOTCHA: Also validate boxes against schema, as this has ')
    console.warn('been the cause of the problem on numerous occasions.')
    console.warn('')
    console.warn('List Leaf Pieces')
    console.warn('================')
    console.warn(`Number of solutions = ${numberOfSolutions}`)

    // list all leaves, of all solutions in order
    // solver.GenerateSolutionNamesAndPush()

    let incomplete = 0
    let listItemNumber = 0
    let solutionNumber = 65
    const isOnlyNulls = true
    for (const solution of solver.GetSolutions()) {
      const letter = String.fromCharCode(solutionNumber++)
      console.warn(
        letter +
          '. ' +
          FormatText(solution.GetSolvingPath()) +
          '<--unique name'
      )
      const leaves: Map<string, Piece | null> = solution
        .GetRootMap()
        .GenerateMapOfLeavesFromAllRoots(isOnlyNulls)
      for (const key of leaves.keys()) {
        listItemNumber++
        const piece = leaves.get(key)
        const pieceName: string = piece != null ? piece.output : 'null'
        //  "1. XXXXXX"   <- this is the format we list the leaves
        console.warn(
          `    ${listItemNumber}. ${FormatText(pieceName)} [${key}]`
        )
        incomplete += piece === null ? 1 : 0
      }
    }
    console.warn(`Number of incomplete leaves ${incomplete}/${listItemNumber}`)

    // allow user to choose item
    const input = prompt(
      'Choose an ingredient of one of the solutions or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    }
    if (input === 'b') {
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let i = 0
        for (const solution of solver.GetSolutions()) {
          const goals = solution
            .GetRootMap()
            .GenerateMapOfLeavesFromAllRoots(isOnlyNulls)
          for (const key of goals.keys()) {
            i++
            if (i === theNumber) {
              console.warn('This is the life of the selected ingredient: ')
              const items: string[] = key.split('/')
              const { length } = items
              for (let j = length - 2; j > 1; j--) {
                console.warn(`    - ${items[j]}`)
              }
              prompt('Hit a key to continue...')
            }
          }
        }
      }
    }
  }
}
