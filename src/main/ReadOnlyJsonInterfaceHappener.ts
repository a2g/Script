import { SolutionNodeRepository } from 'main/SolutionNodeRepository'
import { MixedObjectsAndVerb } from 'main/MixedObjectsAndVerb'
import { Happenings } from 'main/Happenings'

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
