
let globalId = 10

export function GetNextId (): number {
  return globalId++
}
