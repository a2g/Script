/**
 * Some commands can be three elements:
 * Use A B
 * Give A B
 * Some commands are two elements:
 * Grab A
 * Toggle B
 * @param input sentence
 * @returns array trimmed
 */
export function GetThreeStringsFromInput (input: string): string[] {
  const parts: string[] = input.split(' ')
  const len = parts.length
  if (len < 2) {
    return []
  }
  const action: string = parts[0].trim()
  const obj1: string = parts[1].trim()
  const obj2: string = len > 2 ? parts[2].trim() : ''
  return [action, obj1, obj2]
}
