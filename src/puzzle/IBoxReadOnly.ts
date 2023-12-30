import { IPileOrRootPieceMap } from './IPileOrRootPieceMap';
import { PileOfPieces } from './PileOfPieces';
import { VisibleThingsMap } from './VisibleThingsMap';

/**
 * This is needed because there are all these analysis steps that are performed on a single box
 * (ie a single underlying json), and there is a need for this same analysis to be performed on
 * an aggregate of boxes all together (ie BigBoxViaArrayOfBoxes) - so all the analysis are made
 * to operate on this subset of the interface and, BigBoxViaArrayOfBoxes implements this.
 *
 */

export interface IBoxReadOnly {
  // getters
  GetArrayOfProps: () => string[];
  GetArrayOfInvs: () => string[];
  GetArrayOfGoals: () => string[];
  GetArrayOfSingleObjectVerbs: () => string[];
  GetArrayOfInitialStatesOfSingleObjectVerbs: () => boolean[];
  GetArrayOfInitialStatesOfGoals: () => number[];
  GetSetOfStartingGoals: () => Set<string>;
  GetSetOfStartingProps: () => Set<string>;
  GetSetOfStartingInvs: () => Set<string>;
  GetMapOfAllStartingThings: () => VisibleThingsMap;
  GetStartingThingsForCharacter: (charName: string) => Set<string>;
  GetArrayOfInitialStatesOfProps: () => boolean[];
  GetArrayOfInitialStatesOfInvs: () => boolean[];
  GetArrayOfCharacters: () => string[];

  // original-json-traversers
  CopyPiecesFromBoxToPile: (pile: PileOfPieces) => void; // its possible for this to be done on aggregate
  CopyGoalPiecesToContainer: (map: IPileOrRootPieceMap) => void;
  CollectAllReferencedBoxesRecursively: (array: Set<IBoxReadOnly>) => void;
  IsMergingOk: () => boolean;
  GetNewPileOfPieces: () => PileOfPieces;
}
