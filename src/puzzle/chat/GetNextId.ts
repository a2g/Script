
let globalId = 0

export function GetNextId (): number {
  return globalId++
}
