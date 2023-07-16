export function Stringify(blah: unknown): string {
  if (blah != null) {
    return blah.toString();
  }
  return '';
}
