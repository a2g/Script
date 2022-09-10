import { MixedObjectsAndVerb } from './MixedObjectsAndVerb'
import { SolutionNodeRepository } from './SolutionNodeRepository'
import { Happenings } from './Happenings'

export interface ReadOnlyJsonInterfacePlayThru {

  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GetArrayOfFlags: () => string[]
  GetArrayOfSingleObjectVerbs: () => string[]

  GetArrayOfInitialStatesOfInvs: () => boolean[]
  GetArrayOfInitialStatesOfProps: () => boolean[]
  GetArrayOfInitialStatesOfFlags: () => number[]
  GetArrayOfInitialStatesOfSingleObjectVerbs: () => boolean[]

  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
  FindHappeningsIfAny: (objects: MixedObjectsAndVerb) => Happenings | null
}
