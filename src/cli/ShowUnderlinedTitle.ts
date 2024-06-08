export function ShowUnderlinedTitle (pathSegments: Array<string>): void {
  let thePath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    if (i != 0) {
      thePath += '/'
    }
    thePath += pathSegments[i]
  }

  const length = thePath.length
  console.warn(thePath)
  console.warn(Array.from({ length }, () => '=').join(''))
}
