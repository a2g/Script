export function ShowUnderlinedTitle (pathSegments: string[]): void {
  let thePath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    if (i !== 0) {
      thePath += '/'
    }
    thePath += pathSegments[i]
  }

  const length = thePath.length
  console.warn('')
  console.warn(thePath)
  console.warn(Array.from({ length }, () => '=').join(''))
}
