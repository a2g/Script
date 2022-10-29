import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js'
import { Happenings } from './Happenings.js'
import { PileOfPieces } from './PileOfPieces.js'
import { PileOrRootPieceMap } from './PileOrRootPieceMap.js'

/**
* This is needed because there are all these analysis steps that are performed on a single box
* (ie a single underlying json), and there is a need for this same analysis to be performed on
* an aggregate of boxes all together (ie BigBoxViaArrayOfBoxes) - so all the analysis are made
* to operate on this subset of the interface and, BigBoxViaArrayOfBoxes implements this.
*
* Incidentally BigBoxViaArrayOfBoxes implements FindHappeningsIfAny by keeping a copy of all the
* original boxes, and iterating through them calling FindHappeningsIfAny() directly against the json
* */

export interface BoxReadOnly {

  // getters
  GetArrayOfProps: () => string[]
  GetArrayOfInvs: () => string[]
  GetArrayOfGoals: () => string[]
  GetArrayOfSingleObjectVerbs: () => string[]
  GetArrayOfInitialStatesOfSingleObjectVerbs: () => boolean[]
  GetArrayOfInitialStatesOfGoals: () => number[]
  GetSetOfStartingGoals: () => Set<string>
  GetSetOfStartingProps: () => Set<string>
  GetSetOfStartingInvs: () => Set<string>
  GetMapOfAllStartingThings: () => Map<string, Set<string>>
  GetStartingThingsForCharacter: (charName: string) => Set<string>
  GetArrayOfInitialStatesOfProps: () => boolean[]
  GetArrayOfInitialStatesOfInvs: () => boolean[]
  GetArrayOfCharacters: () => string[]

  // original-json-traversers
  FindHappeningsIfAny: (objects: MixedObjectsAndVerb) => Happenings | null
  CopyPiecesFromBoxToPile: (pile: PileOfPieces) => void // its possible for this to be done on aggregate
  CopyGoalPiecesToAnyContainer: (map: PileOrRootPieceMap) => void
  CollectAllReferencedBoxesRecursively: (array: Set<BoxReadOnly>) => void
  IsMergingOk: () => boolean
}
