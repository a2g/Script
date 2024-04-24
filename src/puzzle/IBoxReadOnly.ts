import { Box } from './Box'
import { Piece } from './Piece'
import { VisibleThingsMap } from './VisibleThingsMap'

/**
 * This is needed because there are all these analysis steps that are performed on a single box
 * (ie a single underlying json), and there is a need for this same analysis to be performed on
 * an aggregate of boxes all together (ie BigBoxViaArrayOfBoxes) - so all the analysis are made
 * to operate on this subset of the interface and, BigBoxViaArrayOfBoxes implements this.
 *
 */

export interface IBoxReadOnly {
  // getters
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GetArrayOfGoals: () => string[]
  GetArrayOfSingleObjectVerbs: () => string[]
  GetArrayOfInitialStatesOfSingleObjectVerbs: () => boolean[]
  GetArrayOfInitialStatesOfGoals: () => number[]
  GetSetOfGoalWords: () => Set<string>
  GetSetOfStartingGoals: () => Set<string>
  GetSetOfStartingProps: () => Set<string>
  GetSetOfStartingInvs: () => Set<string>
  GetMapOfAllStartingThings: () => VisibleThingsMap
  GetStartingThingsForCharacter: (charName: string) => Set<string>
  GetArrayOfInitialStatesOfProps: () => boolean[]
  GetArrayOfInitialStatesOfInvs: () => boolean[]
  GetArrayOfCharacters: () => string[]
  GetPieceIterator: () => IterableIterator<Set<Piece>>

  // original-json-traversers
  CopyPiecesToGivenBox: (box: Box) => void // its possible for this to be done on aggregate
  //  CopyAllGoalWordsToDestination: (set: Set<string>) => void
  IsNotMergingAnymoreBoxes: () => boolean
  GetClonedBoxOfPieces: () => Box
}
