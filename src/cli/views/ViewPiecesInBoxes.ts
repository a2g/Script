import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { Solutions } from '../../puzzle/Solutions'
const prompt = promptSync({})

export function ViewPiecesInBoxes (solutions: Solutions): void {
  console.warn(' ')

  for (;;) {
    console.warn('Pieces of each box')
    console.warn('================')

    let listItemNumber = 0
    const isOnlyNulls = true
    for (const box of solutions.GetBoxes()) {
      listItemNumber++

      console.warn(
          `    ${listItemNumber}. ${FormatText(box.GetFilename())}`)

      console.warn(
          `                     ${FormatText(box.GetPiecesAsString())}`)
    }

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
