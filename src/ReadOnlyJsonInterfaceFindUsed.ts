import { SolutionNodeRepository } from './SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindUsed {
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
}
