import { BoxReadOnly } from './BoxReadOnly.js'

/**
* This is needed, because we want to give assurance that the original state isn't being changed.
* Its easier to solve bugs with an underlying assumption that certain data isn't being changed.
* So instead of passing around Box - which has mutator methods - we pass this around, safe
* in the knowledge that changes can't be made to it
 * */

export interface BoxReadOnlyWithFileMethods extends BoxReadOnly {
  // methods that only a real file can implement
  GetFilename: () => string
  GetArrayOfSubBoxesRecursively: () => BoxReadOnlyWithFileMethods[]
  GetNamesOfPiecesStuckToSubBoxes: () => string[]

  // copiers
  CopyStartingPropsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingFlagsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingInvsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingThingCharsToGivenMap: (givenMap: Map<string, Set<string>>) => void
  CopySubBoxesToGivenMap: (givenMap: Map<string, BoxReadOnlyWithFileMethods>) => void
  CopyPropsToGivenSet: (givenSet: Set<string>) => void
  CopyFlagsToGivenSet: (givenSet: Set<string>) => void
  CopyInvsToGivenSet: (givenSet: Set<string>) => void
  CopyCharsToGivenSet: (givenSet: Set<string>) => void
}
