import { assert } from 'console';
import { existsSync, readFileSync } from 'fs';
import { SolutionNodeRepository } from '../main/SolutionNodeRepository.js';
import { MixedObjectsAndVerb } from '../main/MixedObjectsAndVerb.js';
import { Happenings } from '../main/Happenings.js';
import { Mix } from '../main/Mix.js';
import { ReadOnlyJsonInterface } from '../main/ReadOnlyJsonInterface.js';
import { ReadOnlyJsonInterfaceCollator } from '../main/ReadOnlyJsonInterfaceCollator.js';
import { SingleBigSwitch } from '../main/SingleBigSwitch.js';
/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.json file
 * so that's in there too.
 * */

export class ReadOnlyJsonSingle
  implements ReadOnlyJsonInterface, ReadOnlyJsonInterfaceCollator
{
  readonly allProps: string[];

  readonly allFlags: string[];

  readonly allInvs: string[];

  readonly allChars: string[];

  readonly mapOfStartingThings: Map<string, Set<string>>;

  readonly startingInvSet: Set<string>;

  readonly startingPropSet: Set<string>;

  readonly startingFlagSet: Set<string>;

  readonly filename: string;

  readonly mapOfBags: Map<string, ReadOnlyJsonSingle>;

  constructor(filename: string) {
    this.filename = filename;
    assert(existsSync(filename));
    const text = readFileSync('file.txt', 'utf8');

    const scenario = JSON.parse(text);

    const setProps = new Set<string>();
    const setFlags = new Set<string>();
    const setInvs = new Set<string>();
    const setChars = new Set<string>();

    // this loop is only to ascertain all the different
    // possible object names. ie basically all the enums
    // but without needing the enum file
    for (const gate of scenario.gates) {
      setInvs.add(JSON.stringify(gate.inv1));
      setInvs.add(JSON.stringify(gate.inv2));
      setInvs.add(JSON.stringify(gate.inv3));
      setFlags.add(JSON.stringify(gate.flag1));
      setFlags.add(JSON.stringify(gate.flag2));
      setProps.add(JSON.stringify(gate.prop1));
      setProps.add(JSON.stringify(gate.prop2));
      setProps.add(JSON.stringify(gate.prop3));
      setProps.add(JSON.stringify(gate.prop4));
      setProps.add(JSON.stringify(gate.prop5));
      setProps.add(JSON.stringify(gate.prop6));
      setProps.add(JSON.stringify(gate.prop7));

      if (gate.conjoint !== null) {
        setInvs.add(JSON.stringify(gate.conjoint.inv1));
        setInvs.add(JSON.stringify(gate.conjoint.inv2));
        setInvs.add(JSON.stringify(gate.conjoint.inv3));
        setFlags.add(JSON.stringify(gate.conjoint.flag1));
        setFlags.add(JSON.stringify(gate.conjoint.flag2));
        setProps.add(JSON.stringify(gate.conjoint.prop1));
        setProps.add(JSON.stringify(gate.conjoint.prop2));
        setProps.add(JSON.stringify(gate.conjoint.prop3));
        setProps.add(JSON.stringify(gate.conjoint.prop4));
        setProps.add(JSON.stringify(gate.conjoint.prop5));
        setProps.add(JSON.stringify(gate.conjoint.prop6));
        setProps.add(JSON.stringify(gate.conjoint.prop7));
      }
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
    setFlags.delete('');
    setFlags.delete('undefined');
    setInvs.delete('');
    setInvs.delete('undefined');

    this.allProps = Array.from(setProps.values());
    this.allFlags = Array.from(setFlags.values());
    this.allInvs = Array.from(setInvs.values());
    this.allChars = Array.from(setChars.values());

    // preen starting invs from the startingThings
    this.startingInvSet = new Set<string>();
    this.startingFlagSet = new Set<string>();
    this.startingPropSet = new Set<string>();
    this.mapOfStartingThings = new Map<string, Set<string>>();
    this.mapOfBags = new Map<string, ReadOnlyJsonSingle>();

    // starting things is optional in the json
    if (
      scenario.startingThings !== undefined &&
      scenario.startingThings !== null
    ) {
      for (const thing of scenario.startingThings) {
        const theThing = JSON.stringify(thing.thing);
        if (theThing.startsWith('inv')) {
          this.startingInvSet.add(theThing);
        }
        if (theThing.startsWith('flag')) {
          this.startingFlagSet.add(theThing);
        }
        if (theThing.startsWith('prop')) {
          this.startingPropSet.add(theThing);
        }
      }

      for (const item of scenario.startingThings) {
        if (!this.mapOfStartingThings.has(item.thing)) {
          this.mapOfStartingThings.set(item.thing, new Set<string>());
        }
        if (item.character !== undefined && item.character !== null) {
          const { character } = item;
          const array = this.mapOfStartingThings.get(item.thing);
          if (character.length > 0 && array != null) {
            array.add(character);
          }
        }
      }
    }

    // starting things is optional in the json
    // do the bags
    if (scenario.bags !== undefined && scenario.bags !== null) {
      for (const thing of scenario.bags) {
        if (thing.flag !== undefined && thing.flag !== null) {
          if (thing.fileToMerge !== undefined && thing.fileToMerge !== null) {
            const json = new ReadOnlyJsonSingle(thing.fileToMerge);

            // add to this
            this.mapOfBags.set(thing.flag, json);
          }
        }
      }
    }
  }

  GetArrayOfJsonsRecursively(): ReadOnlyJsonSingle[] {
    let array: Array<ReadOnlyJsonSingle> = [];
    array.push(this);
    for (const bag of this.mapOfBags.values()) {
      const childBag = bag.GetArrayOfJsonsRecursively();
      array = array.concat(childBag);
    }
    return array;
  }

  AddStartingPropsToGivenSet(givenSet: Set<string>): void {
    for (const prop of this.startingPropSet) {
      givenSet.add(prop);
    }
  }

  AddStartingFlagsToGivenSet(givenSet: Set<string>): void {
    for (const flag of this.startingFlagSet) {
      givenSet.add(flag);
    }
  }

  AddStartingInvsToGivenSet(givenSet: Set<string>): void {
    for (const inv of this.startingInvSet) {
      givenSet.add(inv);
    }
  }

  AddStartingThingCharsToGivenMap(givenMap: Map<string, Set<string>>): void {
    this.mapOfStartingThings.forEach((value: Set<string>, key: string) => {
      givenMap.set(key, value);
    });
  }

  AddBagsToGivenMap(givenMap: Map<string, ReadOnlyJsonSingle>): void {
    this.mapOfBags.forEach((value: ReadOnlyJsonSingle, key: string) => {
      givenMap.set(key, value);
    });
  }

  AddPropsToGivenSet(givenSet: Set<string>): void {
    for (const prop of this.allProps) {
      givenSet.add(prop);
    }
  }

  AddFlagsToGivenSet(givenSet: Set<string>): void {
    for (const flag of this.allFlags) {
      givenSet.add(flag);
    }
  }

  AddInvsToGivenSet(givenSet: Set<string>): void {
    for (const inv of this.allInvs) {
      givenSet.add(inv);
    }
  }

  AddCharsToGivenSet(givenSet: Set<string>): void {
    for (const character of this.allChars) {
      givenSet.add(character);
    }
  }

  GetArrayOfProps(): string[] {
    return this.allProps;
  }

  GetArrayOfInvs(): string[] {
    return this.allInvs;
  }

  GetArrayOfFlags(): string[] {
    return this.allFlags;
  }

  static GetArrayOfSingleObjectVerbs(): string[] {
    return ['grab', 'toggle'];
  }

  GetArrayOfSingleObjectVerbs(): string[] {
    return this.GetArrayOfSingleObjectVerbs();
  }

  static GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return [true, true];
  }

  GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs();
  }

  GetArrayOfInitialStatesOfFlags(): number[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingFlags();
    const initialStates: Array<number> = [];
    for (const flag of this.allFlags) {
      const isNonZero = startingSet.has(flag);
      initialStates.push(isNonZero ? 1 : 0);
    }
    return initialStates;
  }

  GetSetOfStartingFlags(): Set<string> {
    return this.startingFlagSet;
  }

  GetSetOfStartingProps(): Set<string> {
    return this.startingPropSet;
  }

  GetSetOfStartingInvs(): Set<string> {
    return this.startingInvSet;
  }

  GetMapOfAllStartingThings(): Map<string, Set<string>> {
    return this.mapOfStartingThings;
  }

  GetStartingThingsForCharacter(charName: string): Set<string> {
    const startingThingSet = new Set<string>();
    this.mapOfStartingThings.forEach((value: Set<string>, thing: string) => {
      for (const item of value) {
        if (item === charName) {
          startingThingSet.add(thing);
          break;
        }
      }
    });

    return startingThingSet;
  }

  GetArrayOfInitialStatesOfProps(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingProps();
    const visibilities: Array<boolean> = [];
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop);
      visibilities.push(isVisible);
    }

    return visibilities;
  }

  GetArrayOfInitialStatesOfInvs(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingInvs();
    const visibilities: Array<boolean> = [];
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv);
      visibilities.push(isVisible);
    }

    return visibilities;
  }

  GetArrayOfCharacters(): string[] {
    return this.allChars;
  }

  GetMapOfBags(): Map<string, ReadOnlyJsonSingle> {
    return this.mapOfBags;
  }

  GenerateSolutionNodesMappedByInput(): SolutionNodeRepository {
    const result = new SolutionNodeRepository(null);
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    );
    SingleBigSwitch(this.filename, result, notUsed);
    return result;
  }

  AddAllSolutionNodesToGivenMap(
    givenMap: SolutionNodeRepository
  ): SolutionNodeRepository {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    );
    SingleBigSwitch(this.filename, givenMap, notUsed);
    return givenMap;
  }

  FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
    const result = SingleBigSwitch(
      this.filename,
      null,
      objects
    ) as unknown as Happenings | null;
    return result;
  }

  GetFilename(): string {
    return this.filename;
  }

  public GetDirectlyAccessibleGoals(): string[] {
    const array: Array<string> = [];
    for (const key of this.mapOfBags.keys()) {
      array.push(key);
    }
    return array;
  }
}
