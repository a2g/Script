export class VisibleThingsMap {
  private mapOfVisibleThings: Map<string, Set<string>>;

  constructor(startingThingsPassedIn: ReadonlyMap<string, Set<string>> | null) {
    // its its passed in we deep copy it
    this.mapOfVisibleThings = new Map<string, Set<string>>();
    if (startingThingsPassedIn != null) {
      for (const key of startingThingsPassedIn.keys()) {
        const value = startingThingsPassedIn.get(key);
        if (value != null) {
          const newSet = new Set<string>();
          for (const item of value) {
            newSet.add(item);
          }
          this.mapOfVisibleThings.set(key, newSet);
        }
      }
    }
  }

  public Has(item: string): boolean {
    return this.mapOfVisibleThings.has(item);
  }

  public Set(key: string, value: Set<string>): void {
    this.mapOfVisibleThings.set(key, value);
  }

  public Delete(item: string): void {
    this.mapOfVisibleThings.delete(item);
  }

  public Get(key: string): Set<string> | undefined {
    return this.mapOfVisibleThings.get(key);
  }

  public Size(): number {
    return this.mapOfVisibleThings.size;
  }

  public GetIterableIterator(): IterableIterator<[string, Set<string>]> {
    return this.mapOfVisibleThings.entries();
  }
}
