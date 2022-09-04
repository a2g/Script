import { SolutionNodeRepository } from './SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindLeaves {
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
  GetMapOfAllStartingThings: () => Map<string, Set<string>>
}
