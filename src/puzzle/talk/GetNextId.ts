
let globalId = 10

export function GetNextId (): string {
  return `${globalId++}`
}
