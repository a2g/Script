import { SolutionNodeRepository } from 'jigsaw/SolutionNodeRepository'
import { MixedObjectsAndVerb } from 'jigsaw/MixedObjectsAndVerb'
import { Happenings } from 'jigsaw/Happenings'

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
