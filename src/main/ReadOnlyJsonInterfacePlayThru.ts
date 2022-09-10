import { MixedObjectsAndVerb } from 'jigsaw/MixedObjectsAndVerb'
import { SolutionNodeRepository } from 'jigsaw/SolutionNodeRepository'
import { Happenings } from 'jigsaw/Happenings'

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
