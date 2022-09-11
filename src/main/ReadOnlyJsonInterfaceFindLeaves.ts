import { SolutionNodeRepository } from '../main/SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindLeaves {
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
  GetMapOfAllStartingThings: () => Map<string, Set<string>>
}
