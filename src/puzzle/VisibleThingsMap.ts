export class VisibleThingsMap {
  public readonly mapOfVisibleThings: Map<string, Set<string>>

  constructor (startingThingsPassedIn: ReadonlyMap<string, Set<string>> | null) {
    // its its passed in we deep copy it
    this.mapOfVisibleThings = new Map<string, Set<string>>()
    if (startingThingsPassedIn != null) {
      for (const key of startingThingsPassedIn.keys()) {
        const characters = startingThingsPassedIn.get(key)
        if (characters != null) {
          const newConstraints = new Set<string>()
          for (const character of characters) {
            newConstraints.add(character)
          }
          this.mapOfVisibleThings.set(key, newConstraints)
        }
      }
    }
  }

  public Has (item: string): boolean {
    return this.mapOfVisibleThings.has(item)
  }

  public Set (key: string, value: Set<string>): void {
    this.mapOfVisibleThings.set(key, value)
  }

  public Delete (item: string): void {
    this.mapOfVisibleThings.delete(item)
  }

  public Get (key: string): Set<string> | undefined {
    return this.mapOfVisibleThings.get(key)
  }

  public Size (): number {
    return this.mapOfVisibleThings.size
  }

  public GetIterableIterator (): IterableIterator<[string, Set<string>]> {
    return this.mapOfVisibleThings.entries()
  }

  CopyTo (dest: VisibleThingsMap): void {
    for (const key of this.mapOfVisibleThings.keys()) {
      if (!dest.Has(key)) {
        dest.Set(key, new Set<string>())
      }
      const set = dest.Get(key)
      if (set != null) {
        for (const item of set) {
          dest.Get(key)?.add(item)
        }
      }
    }
  }
}
