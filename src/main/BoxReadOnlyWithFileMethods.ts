import { BoxReadOnly } from './BoxReadOnly.js'
import { VisibleThingsMap } from './VisibleThingsMap.js'

/**
* This is needed, because we want to give assurance that the original state isn't being changed.
* Its easier to solve bugs with an underlying assumption that certain data isn't being changed.
* So instead of passing around Box - which has mutator methods - we pass this around, safe
* in the knowledge that changes can't be made to it
 * */

export interface BoxReadOnlyWithFileMethods extends BoxReadOnly {
  // methods that only a real file can implement
  GetFilename: () => string

  // copiers
  CopyStartingPropsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingGoalsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingInvsToGivenSet: (givenSet: Set<string>) => void
  CopyStartingThingCharsToGivenMap: (givenMap: VisibleThingsMap) => void
  CopyPropsToGivenSet: (givenSet: Set<string>) => void
  CopyGoalsToGivenSet: (givenSet: Set<string>) => void
  CopyInvsToGivenSet: (givenSet: Set<string>) => void
  CopyCharsToGivenSet: (givenSet: Set<string>) => void
}
