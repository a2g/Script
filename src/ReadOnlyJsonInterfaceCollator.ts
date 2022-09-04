
export interface ReadOnlyJsonInterfaceCollator {
  AddStartingPropsToGivenSet: (givenSet: Set<string>) => void
  AddStartingInvsToGivenSet: (givenSet: Set<string>) => void
  AddStartingFlagsToGivenSet: (givenSet: Set<string>) => void
  AddStartingThingCharsToGivenMap: (givenSet: Map<string, Set<string>>) => void
  AddPropsToGivenSet: (givenSet: Set<string>) => void
  AddFlagsToGivenSet: (givenSet: Set<string>) => void
  AddInvsToGivenSet: (givenSet: Set<string>) => void
  AddCharsToGivenSet: (givenSet: Set<string>) => void
}
