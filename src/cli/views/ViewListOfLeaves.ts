import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { Piece } from '../../puzzle/Piece'
import { Solutions } from '../../puzzle/Solutions'
const prompt = promptSync({})

export function ViewListOfLeaves (solutions: Solutions): void {
  console.warn(' ')

  for (;;) {
    solutions.SolvePartiallyUntilCloning()
    solutions.UpdateSolvedStatuses()
    const numberOfSolutions: number = solutions.NumberOfSolutions()

    console.warn('If any leaves are not resolved objerly, for example')
    console.warn(' - eg items show up as not found when they should be')
    console.warn(' starting objs, or inv items that should not be leafs.')
    console.warn(
      'Then add these to starting sets; or fix up pieces, such that'
    )
    console.warn(
      'the dependent pieces are discovered; or introduce achievement pieces'
    )
    console.warn('for items that two achievements need, but only one ends up with.')
    console.warn('GOTCHA: Also validate boxes against schema, as this has ')
    console.warn('been the cause of the problem on numerous occasions.')
    console.warn('')
    console.warn('List Leaf Pieces')
    console.warn('================')
    console.warn(`Number of solutions = ${numberOfSolutions}`)

    // list all leaves, of all solutions in order
    // solutions.GenerateSolutionNamesAndPush()

    let incomplete = 0
    let listItemNumber = 0
    let solutionNumber = 65
    const isOnlyNulls = true
    for (const solution of solutions.GetSolutions()) {
      const letter = String.fromCharCode(solutionNumber++)
      console.warn(
        letter +
          '. ' +
          FormatText(solution.GetSolvingPath()) +
          '<--unique name'
      )
      const leaves: Map<string, Piece | null> = solution
        .GetAchievementStubMap()
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
        for (const solution of solutions.GetSolutions()) {
          const achievements = solution
            .GetAchievementStubMap()
            .GenerateMapOfLeavesFromAllRoots(isOnlyNulls)
          for (const key of achievements.keys()) {
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
