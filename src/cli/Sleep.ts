export function Sleep(milliseconds: number): void {
  const date = Date.now();
  let currentDate: number | null = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
