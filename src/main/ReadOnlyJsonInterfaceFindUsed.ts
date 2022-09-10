import { SolutionNodeRepository } from 'jigsaw/SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindUsed {
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
}
