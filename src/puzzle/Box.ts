import { existsSync, readFileSync } from 'fs';
import { Happenings } from './Happenings';
import { IBoxReadOnly } from './IBoxReadOnly';
import { IBoxReadOnlyWithFileMethods } from './IBoxReadOnlyWithFileMethods';
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap';
import { Mix } from './Mix';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { PileOfPieces } from './PileOfPieces';
import { RootPieceMap } from './RootPieceMap';
import { SingleBigSwitch } from './SingleBigSwitch';
import { Stringify } from './Stringify';
import { VisibleThingsMap } from './VisibleThingsMap';

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.json file
 * so that's in there too.
 */
export class Box implements IBoxReadOnlyWithFileMethods {
  public static GetArrayOfSingleObjectVerbs(): string[] {
    return ['grab', 'toggle'];
  }

  public static GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return [true, true];
  }
  private readonly allProps: string[];

  private readonly allGoals: string[];

  private readonly allInvs: string[];

  private readonly allChars: string[];

  private readonly mapOfStartingThings: VisibleThingsMap;

  private readonly startingInvSet: Set<string>;

  private readonly startingPropSet: Set<string>;

  private readonly startingGoalSet: Set<string>;

  private readonly filename: string;

  private readonly goals: RootPieceMap;

  private isMergingOk: boolean;

  constructor(filename: string) {
    this.isMergingOk = true;
    this.filename = filename;
    if (!existsSync(filename)) {
      throw new Error(`file doesn't exist ${filename} ${process.cwd()}`);
    }
    const text = readFileSync(filename, 'utf8');
    const scenario = JSON.parse(text);
    const setProps = new Set<string>();
    const setGoals = new Set<string>();
    const setInvs = new Set<string>();
    const setChars = new Set<string>();
    // this loop is only to ascertain all the different
    // possible object names. ie basically all the enums
    // but without needing the enum file
    for (const gate of scenario.pieces) {
      setInvs.add(Stringify(gate.inv1));
      setInvs.add(Stringify(gate.inv2));
      setInvs.add(Stringify(gate.inv3));
      setGoals.add(Stringify(gate.goal1));
      setGoals.add(Stringify(gate.goal2));
      setProps.add(Stringify(gate.prop1));
      setProps.add(Stringify(gate.prop2));
      setProps.add(Stringify(gate.prop3));
      setProps.add(Stringify(gate.prop4));
      setProps.add(Stringify(gate.prop5));
      setProps.add(Stringify(gate.prop6));
      setProps.add(Stringify(gate.prop7));
    }
    // starting things is optional in the json
    if (
      scenario.startingThings !== undefined &&
      scenario.startingThings !== null
    ) {
      for (const thing of scenario.startingThings) {
        if (thing.character !== undefined && thing.character !== null) {
          setChars.add(thing.character);
        }
      }
    }
    setChars.delete('');
    setChars.delete('undefined');
    setProps.delete('');
    setProps.delete('undefined');
    setGoals.delete('');
    setGoals.delete('undefined');
    setInvs.delete('');
    setInvs.delete('undefined');
    this.allProps = Array.from(setProps.values());
    this.allGoals = Array.from(setGoals.values());
    this.allInvs = Array.from(setInvs.values());
    this.allChars = Array.from(setChars.values());
    // preen starting invs from the startingThings
    this.startingInvSet = new Set<string>();
    this.startingGoalSet = new Set<string>();
    this.startingPropSet = new Set<string>();
    this.mapOfStartingThings = new VisibleThingsMap(null);
    // this copies them to the container, and turns filenames in to boxes
    this.goals = new RootPieceMap(null);
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    );
    SingleBigSwitch(this.filename, notUsed, true, this.goals);
    // starting things is optional in the json
    if (
      scenario.startingThings !== undefined &&
      scenario.startingThings !== null
    ) {
      for (const thing of scenario.startingThings) {
        const theThing = Stringify(thing.thing);
        if (theThing.startsWith('inv')) {
          this.startingInvSet.add(theThing);
        }
        if (theThing.startsWith('goal')) {
          this.startingGoalSet.add(theThing);
        }
        if (theThing.startsWith('prop')) {
          this.startingPropSet.add(theThing);
        }
      }
      for (const item of scenario.startingThings) {
        if (!this.mapOfStartingThings.Has(item.thing)) {
          this.mapOfStartingThings.Set(item.thing, new Set<string>());
        }
        if (item.character !== undefined && item.character !== null) {
          const { character } = item;
          const array = this.mapOfStartingThings.Get(item.thing);
          if (character.length > 0 && array != null) {
            array.add(character);
          }
        }
      }
    }
  }
  public Init() {
   // this was here in case we couldn't load the file in the constructor - but now we can.
  }

  public IsMergingOk(): boolean {
    return this.isMergingOk;
  }

  public async CopyPiecesFromBoxToPile(pile: PileOfPieces): Promise<void> {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    );
    await SingleBigSwitch(this.filename, notUsed, false, pile);
  }

  public FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
    const result = (SingleBigSwitch(
      this.filename,
      objects,
      false,
      null
    ) as unknown) as Happenings | null;
    return result;
  }

  public CopyStartingPropsToGivenSet(givenSet: Set<string>): void {
    for (const prop of this.startingPropSet) {
      givenSet.add(prop);
    }
  }

  public CopyStartingGoalsToGivenSet(givenSet: Set<string>): void {
    for (const goal of this.startingGoalSet) {
      givenSet.add(goal);
    }
  }

  public CopyStartingInvsToGivenSet(givenSet: Set<string>): void {
    for (const inv of this.startingInvSet) {
      givenSet.add(inv);
    }
  }

  public CopyStartingThingCharsToGivenMap(givenMap: VisibleThingsMap): void {
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      givenMap.Set(item[0], item[1]);
    }
  }

  public CopyPropsToGivenSet(givenSet: Set<string>): void {
    for (const prop of this.allProps) {
      givenSet.add(prop);
    }
  }

  public CopyGoalsToGivenSet(givenSet: Set<string>): void {
    for (const goal of this.allGoals) {
      givenSet.add(goal);
    }
  }

  public CopyInvsToGivenSet(givenSet: Set<string>): void {
    for (const inv of this.allInvs) {
      givenSet.add(inv);
    }
  }

  public CopyCharsToGivenSet(givenSet: Set<string>): void {
    for (const character of this.allChars) {
      givenSet.add(character);
    }
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
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingGoals();
    const initialStates: number[] = [];
    for (const goal of this.allGoals) {
      const isNonZero = startingSet.has(goal);
      initialStates.push(isNonZero ? 1 : 0);
    }
    return initialStates;
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
    return this.mapOfStartingThings;
  }

  public GetStartingThingsForCharacter(charName: string): Set<string> {
    const startingThingSet = new Set<string>();
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      for (const name of item[1]) {
        if (name === charName) {
          startingThingSet.add(item[0]);
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

  public GetFilename(): string {
    return this.filename;
  }

  public CopyGoalPiecesToContainer(map: IPileOrRootPieceMap): void {
    for (const goal of this.goals.GetValues()) {
      const clonedPiece = goal.piece.ClonePieceAndEntireTree();
      map.AddPiece(clonedPiece);
    }
  }

  public CollectAllReferencedBoxesRecursively(set: Set<IBoxReadOnly>): void {
    set.add(this);
    for (const goal of this.goals.GetValues()) {
      if (goal.piece.merge != null) {
        goal.piece.merge.CollectAllReferencedBoxesRecursively(set);
      }
    }
  }
}
