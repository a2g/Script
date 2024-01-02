import { AddBrackets } from './AddBrackets'
import { Colors } from './Colors'
import { startsWithGoalNumber } from './startsWithGoalNumber'

export function GetDisplayName (
  input: string | string[],
  isParenthesisNeeded = false
): string {
  // format arrays in to a lovely comma-separated list
  if (Array.isArray(input)) {
    let toReturn = ''
    for (const inputItem of input) {
      if (inputItem != null) {
        const nameToAdd = GetDisplayName(inputItem) // recurse
        toReturn += toReturn.length > 0 ? `, ${nameToAdd}` : nameToAdd
      }
    }
    return toReturn
  }

  const single = input.toString()
  if (single.startsWith('sol_prop_')) {
    return (
      Colors.Yellow +
      AddBrackets(single.slice(9), isParenthesisNeeded) +
      Colors.Reset
    )
  }
  if (single.startsWith('sol_goal_')) {
    return Colors.Yellow + single.slice(9) + Colors.Reset
  }
  if (single.startsWith('sol_inv_')) {
    return Colors.Yellow + single.slice(8) + Colors.Reset
  }
  if (single.startsWith('inv_')) {
    return Colors.Green + single.slice(4) + Colors.Reset
  }
  if (single.startsWith('prop_')) {
    return Colors.Cyan + single.slice(5) + Colors.Reset
  }
  if (startsWithGoalNumber(single)) {
    return Colors.Green + single.slice(1) + Colors.Reset
  }
  if (single.startsWith('char_')) {
    return (
      Colors.Red +
      AddBrackets(single.slice(5), isParenthesisNeeded) +
      Colors.Reset
    )
  }
  if (
    single.startsWith('use') ||
    single.startsWith('toggle') ||
    single.startsWith('grab')
  ) {
    return Colors.Red + single + Colors.Reset
  }

  return single
}
