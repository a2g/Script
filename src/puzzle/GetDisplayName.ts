import { IdPrefixes } from '../../IdPrefixes'
import { AddBrackets } from './AddBrackets'
import { Colors } from './Colors'

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
  if (single.startsWith('sol_x')) {
    return Colors.Yellow + single.slice(9) + Colors.Reset
  }
  if (single.startsWith('sol_inv_')) {
    return Colors.Yellow + single.slice(8) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Inv)) {
    return Colors.Green + single.slice(4) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Prop)) {
    return Colors.Cyan + single.slice(5) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Goal)) {
    return Colors.Green + single.slice(1) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Char)) {
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
