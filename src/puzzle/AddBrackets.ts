/**
 * At the time, this was the most convenient way
 * of conditionally adding brackets to a string.
 * @param input the string that may get wrapped in brackets
 * @param isParenthesisNeeded decides whether or not it does
 * @returns the resultant string
 */
export function AddBrackets(input: string, isParenthesisNeeded = true): string {
  if (isParenthesisNeeded) { return `( ${input} )` }
  return input
}
