import { MixedObjectsAndVerb } from 'main/MixedObjectsAndVerb'
import { SolutionNodeRepository } from 'main/SolutionNodeRepository'
import { Happenings } from 'main/Happenings'

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
