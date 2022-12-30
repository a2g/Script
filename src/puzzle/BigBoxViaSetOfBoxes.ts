import { Happenings } from './Happenings.js';
import { IBoxReadOnly } from './IBoxReadOnly.js';
import { IBoxReadOnlyWithFileMethods } from './IBoxReadOnlyWithFileMethods.js';
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap.js';
import { Mix } from './Mix.js';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js';
import { PileOfPieces } from './PileOfPieces.js';
import { RootPieceMap } from './RootPieceMap.js';
import { SingleBigSwitch } from './SingleBigSwitch.js';
import { VisibleThingsMap } from './VisibleThingsMap.js';

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents  *.json files,
 * in this case multiple, so that goes in there too.
 */
export class BigBoxViaSetOfBoxes implements IBoxReadOnly {
  public static GetArrayOfSingleObjectVerbs(): string[] {
    return ['grab', 'toggle'];
  }

  public static GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return [true, true];
  }
  public readonly allProps: string[];

  public readonly allGoals: string[];

  public readonly allInvs: string[];

  public readonly allChars: string[];

  public readonly mapOfStartingThingsWithChars: VisibleThingsMap;

  public readonly startingInvSet: Set<string>;

  public readonly startingPropSet: Set<string>;

  public readonly startingGoalSet: Set<string>;

  public readonly originalBoxes: Set<IBoxReadOnlyWithFileMethods>;

  public readonly goals: RootPieceMap;

  public readonly isMergingOk: boolean = true;

  constructor(setOfBoxes: Set<IBoxReadOnlyWithFileMethods>) {
    // we keep the original boxes, because we need to call
    // Big Switch on them numerous times
    this.originalBoxes = setOfBoxes;

    // create sets for the 3 member and 4 indirect sets
    this.mapOfStartingThingsWithChars = new VisibleThingsMap(null);
    this.startingPropSet = new Set<string>();
    this.startingInvSet = new Set<string>();
    this.startingGoalSet = new Set<string>();
    this.goals = new RootPieceMap(null);
    const setProps = new Set<string>();
    const setGoals = new Set<string>();
    const setInvs = new Set<string>();
    const setChars = new Set<string>();

    // collate the 3 member and 4 indirect sets
    for (const box of this.originalBoxes.values()) {
      box.CopyStartingThingCharsToGivenMap(this.mapOfStartingThingsWithChars);
      box.CopyStartingPropsToGivenSet(this.startingPropSet);
      box.CopyStartingInvsToGivenSet(this.startingInvSet);
      box.CopyStartingGoalsToGivenSet(this.startingGoalSet);
      box.CopyGoalPiecesToContainer(this.goals);
      box.CopyPropsToGivenSet(setProps);
      box.CopyGoalsToGivenSet(setGoals);
      box.CopyInvsToGivenSet(setInvs);
      box.CopyCharsToGivenSet(setChars);
    }

    // clean 3 member and 4 indirect sets
    this.startingPropSet.delete('');
    this.startingInvSet.delete('');
    this.mapOfStartingThingsWithChars.Delete('');
    this.startingGoalSet.delete('');
    setChars.delete('');
    setProps.delete('');
    setGoals.delete('');
    setInvs.delete('');

    // finally set arrays for the four
    this.allProps = Array.from(setProps.values());
    this.allGoals = Array.from(setGoals.values());
    this.allInvs = Array.from(setInvs.values());
    this.allChars = Array.from(setChars.values());
  }

  public IsMergingOk(): boolean {
    return this.isMergingOk; // doesn't need to merge, because it already includes all
  }

  public GetArrayOfProps(): string[] {
    return this.allProps;
  }

  public GetArrayOfInvs(): string[] {
    return this.allInvs;
  }

  public GetArrayOfGoals(): string[] {
    return this.allGoals;
  }

  public GetArrayOfSingleObjectVerbs(): string[] {
    return this.GetArrayOfSingleObjectVerbs();
  }

  public GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs();
  }

  public GetArrayOfInitialStatesOfGoals(): number[] {
    const array: number[] = [];
    for (const goal of this.allGoals) {
      array.push(goal.length > 0 ? 0 : 0); // I used value.length>0 to get rid of the unused variable warnin
    }
    return array;
  }

  public GetSetOfStartingGoals(): Set<string> {
    return this.startingGoalSet;
  }

  public GetSetOfStartingProps(): Set<string> {
    return this.startingPropSet;
  }

  public GetSetOfStartingInvs(): Set<string> {
    return this.startingInvSet;
  }

  public GetMapOfAllStartingThings(): VisibleThingsMap {
    return this.mapOfStartingThingsWithChars;
  }

  public GetStartingThingsForCharacter(charName: string): Set<string> {
    const startingThingSet = new Set<string>();
    for (const startingThing of this.mapOfStartingThingsWithChars.GetIterableIterator()) {
      const key = startingThing[0];
      const value = startingThing[1];
      for (const item of value) {
        if (item === charName) {
          startingThingSet.add(key);
          break;
        }
      }
    }

    return startingThingSet;
  }

  public GetArrayOfInitialStatesOfProps(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingProps();
    const visibilities: boolean[] = [];
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop);
      visibilities.push(isVisible);
    }

    return visibilities;
  }

  public GetArrayOfInitialStatesOfInvs(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingInvs();
    const visibilities: boolean[] = [];
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv);
      visibilities.push(isVisible);
    }

    return visibilities;
  }

  public GetArrayOfCharacters(): string[] {
    return this.allChars;
  }

  public CopyPiecesFromBoxToPile(pile: PileOfPieces): void {
    for (const box of this.originalBoxes) {
      const notUsed = new MixedObjectsAndVerb(
        Mix.ErrorVerbNotIdentified,
        '',
        '',
        '',
        'ScenePreAggregator'
      );
      SingleBigSwitch(box.GetFilename(), notUsed, false, pile);
    }
  }

  public CopyGoalPiecesToContainer(map: IPileOrRootPieceMap): void {
    for (const goal of this.goals.GetValues()) {
      const clonedPiece = goal.piece.ClonePieceAndEntireTree();
      map.AddPiece(clonedPiece);
    }
  }

  public FindHappeningsIfAny(command: MixedObjectsAndVerb): Happenings | null {
    for (const box of this.originalBoxes) {
      const result = (SingleBigSwitch(
        box.GetFilename(),
        command,
        false,
        null
      ) as unknown) as Happenings | null;
      if (result != null) {
        return result;
      }
    }
    return null;
  }

  public CollectAllReferencedBoxesRecursively(set: Set<IBoxReadOnly>): void {
    set.add(this);

    // since this map of goal pieces already has been obtained recurseively
    // then we don't need to recurse further here.
    for (const goal of this.goals.GetValues()) {
      if (goal.piece.merge != null) {
        set.add(goal.piece.merge);
      }
    }
  }
}