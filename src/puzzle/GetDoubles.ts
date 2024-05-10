import { Piece } from './Piece'

export function GetDoubles (
  map: Map<string, Set<Piece>>
): Set<string> {
  const set = new Set<string>()
  for (const item of map) {
    if (item[1].size > 1) {
      set.add(item[0])
    }
  }
  return set
}
