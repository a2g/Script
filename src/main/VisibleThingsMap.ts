
export class VisibleThingsMap {
  mapOfVisibleThings: Map<string, Set<string>>

  constructor (startingThingsPassedIn: ReadonlyMap<string, Set<string>> | null) {
    // its its passed in we deep copy it
    this.mapOfVisibleThings = new Map<string, Set<string>>()
    if (startingThingsPassedIn != null) {
      for (const key of startingThingsPassedIn.keys()) {
        const value = startingThingsPassedIn.get(key)
        if (value != null) {
          const newSet = new Set<string>()
          for (const item of value) {
            newSet.add(item)
          }
          this.mapOfVisibleThings.set(key, newSet)
        }
      }
    }
  }

  Has (item: string): boolean {
    return this.mapOfVisibleThings.has(item)
  }

  Set (key: string, value: Set<string>): void {
    this.mapOfVisibleThings.set(key, value)
  }

  Delete (item: string): void {
    this.mapOfVisibleThings.delete(item)
  }

  Get (key: string): Set<string> | undefined {
    return this.mapOfVisibleThings.get(key)
  }

  Size (): number {
    return this.mapOfVisibleThings.size
  }

  GetIterableIterator (): IterableIterator<[string, Set<string>]> {
    return this.mapOfVisibleThings.entries()
  }
}
