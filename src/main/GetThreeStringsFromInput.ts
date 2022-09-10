/**
 * This gets retrieves a single command of adventure game input
 * This game has a maximum of three items per command.
 * eg Use X Y  // where 'with' is implied
 * Most commands use two commands
 * eg Toggle X
 * eg Grab X etc...
 * @param input the single input string
 * @returns the array of parts
 */
export function GetThreeStringsFromInput (input: string): string[] {
  const parts: string[] = input.split(' ')
  const len = parts.length
  if (len < 2) { return [] }
  const action: string = parts[0].trim()
  const obj1: string = parts[1].trim()
  const obj2: string = len > 2 ? parts[2].trim() : ''
  return [action, obj1, obj2]
}
