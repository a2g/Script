import { SolutionNodeRepository } from 'jigsaw/SolutionNodeRepository'

export interface ReadOnlyJsonInterfaceFindLeaves {
  GenerateSolutionNodesMappedByInput: () => SolutionNodeRepository
  GetMapOfAllStartingThings: () => Map<string, Set<string>>
}
