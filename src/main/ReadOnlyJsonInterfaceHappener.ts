import { SolutionNodeRepository } from './SolutionNodeRepository'
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb'
import { Happenings } from './Happenings'

export interface ReadOnlyJsonInterfaceHappener {
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GetArrayOfFlags: () => string[]
  GetArrayOfSingleObjectVerbs: () => string[]

  GetArrayOfInitialStatesOfInvs: () => boolean[]
  GetArrayOfInitialStatesOfProps: () => boolean[]
  GetArrayOfInitialStatesOfSingleObjectVerbs: () => boolean[]

  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
  GetArrayOfInitialStatesOfFlags: () => number[]
  FindHappeningsIfAny: (objects: MixedObjectsAndVerb) => Happenings | null
}
