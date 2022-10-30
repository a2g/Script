
export class VisibleThingsMap {
  mapOfVisibleThings: Map<string, Set<string>>

  constructor (startingThingsPassedIn: ReadonlyMap<string, Set<string>>) {
    // its its passed in we deep copy it
    this.mapOfVisibleThings = new Map<string, Set<string>>()
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

  Has (item: string): boolean {
    return this.mapOfVisibleThings.has(item)
  }

  Set (key: string, value: Set<string>): void {
    this.mapOfVisibleThings.set(key, value)
  }

  Delete (item: string): void {
    this.mapOfVisibleThings.delete(item)
  }
}
