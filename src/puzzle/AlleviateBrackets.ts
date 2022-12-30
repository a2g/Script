/**
 * This removes the brackets from a string.
 * The 'string|undefined' makes it useful for parsing Json.
 * @param name the string whose brackets should be removed
 * @returns the resultant string
 */
export function AlleviateBrackets(name: string | undefined): string {
  if (typeof name !== 'undefined') {
    const firstOpenBracket: number = name.indexOf('(');

    if (firstOpenBracket >= 0) {
      const lastIndexOf = name.lastIndexOf(')');

      if (lastIndexOf > firstOpenBracket) {
        return name.slice(firstOpenBracket, lastIndexOf - 1);
      }
    }
  }
  return 'undefined';
}
