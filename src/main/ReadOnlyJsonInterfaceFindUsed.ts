import { SolutionNodeRepository } from 'main/SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindUsed {
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
}
