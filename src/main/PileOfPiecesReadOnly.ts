import { SolutionNode } from './SolutionNode'

export interface PileOfPiecesReadOnly {
  GetAutos: () => SolutionNode[]
  HasAnyNodesThatOutputObject: (objectToObtain: string) => boolean
  GetNodesThatOutputObject: (objectToObtain: string) => Set<SolutionNode> | undefined
  Has: (objectToObtain: string) => boolean
  Get: (objectToObtain: string) => Set<SolutionNode> | undefined
  GetValues: () => IterableIterator<Set<SolutionNode>>
  Size: () => number
  ContainsId: (idToMatch: number) => boolean
}
