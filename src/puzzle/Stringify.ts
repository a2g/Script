export function Stringify (blah: unknown): string {
  if (blah != null) {
    if (typeof blah === 'string') {
      return blah.toString()
    }
  }
  return ''
}
