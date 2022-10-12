import { assert } from 'console'
import { existsSync, readFileSync } from 'fs'
import { PileOfPieces } from './PileOfPieces.js'
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js'
import { Happenings } from './Happenings.js'
import { Mix } from './Mix.js'
import { SingleBigSwitch } from './SingleBigSwitch.js'
import { Stringify } from './Stringify.js'
import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods.js'
import { PileOfPiecesReadOnly } from './PileOfPiecesReadOnly.js'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.json file
 * so that's in there too.
 * */

export class Box implements BoxReadOnlyWithFileMethods {
  private readonly allProps: string[]
  private readonly allFlags: string[]
  private readonly allInvs: string[]
  private readonly allChars: string[]
  private readonly mapOfStartingThings: Map<string, Set<string>>
  private readonly startingInvSet: Set<string>
  private readonly startingPropSet: Set<string>
  private readonly startingFlagSet: Set<string>
  private readonly filename: string
  private readonly directSubBoxes: Map<string, BoxReadOnlyWithFileMethods>

  constructor (filename: string) {
    this.filename = filename
    assert(existsSync(filename))
    const text = readFileSync(filename, 'utf8')

    const scenario = JSON.parse(text)

    const setProps = new Set<string>()
    const setFlags = new Set<string>()
    const setInvs = new Set<string>()
    const setChars = new Set<string>()

    // this loop is only to ascertain all the different
    // possible object names. ie basically all the enums
    // but without needing the enum file
    for (const gate of scenario.gates) {
      setInvs.add(Stringify(gate.inv1))
      setInvs.add(Stringify(gate.inv2))
      setInvs.add(Stringify(gate.inv3))
      setFlags.add(Stringify(gate.flag1))
      setFlags.add(Stringify(gate.flag2))
      setProps.add(Stringify(gate.prop1))
      setProps.add(Stringify(gate.prop2))
      setProps.add(Stringify(gate.prop3))
      setProps.add(Stringify(gate.prop4))
      setProps.add(Stringify(gate.prop5))
      setProps.add(Stringify(gate.prop6))
      setProps.add(Stringify(gate.prop7))

      if (gate.conjoint != null) {
        setInvs.add(Stringify(gate.conjoint.inv1))
        setInvs.add(Stringify(gate.conjoint.inv2))
        setInvs.add(Stringify(gate.conjoint.inv3))
        setFlags.add(Stringify(gate.conjoint.flag1))
        setFlags.add(Stringify(gate.conjoint.flag2))
        setProps.add(Stringify(gate.conjoint.prop1))
        setProps.add(Stringify(gate.conjoint.prop2))
        setProps.add(Stringify(gate.conjoint.prop3))
        setProps.add(Stringify(gate.conjoint.prop4))
        setProps.add(Stringify(gate.conjoint.prop5))
        setProps.add(Stringify(gate.conjoint.prop6))
        setProps.add(Stringify(gate.conjoint.prop7))
      }
    }

    // starting things is optional in the json
    if (
      scenario.startingThings !== undefined &&
      scenario.startingThings !== null
    ) {
      for (const thing of scenario.startingThings) {
        if (thing.character !== undefined && thing.character !== null) {
          setChars.add(thing.character)
        }
      }
    }

    setChars.delete('')
    setChars.delete('undefined')
    setProps.delete('')
    setProps.delete('undefined')
    setFlags.delete('')
    setFlags.delete('undefined')
    setInvs.delete('')
    setInvs.delete('undefined')

    this.allProps = Array.from(setProps.values())
    this.allFlags = Array.from(setFlags.values())
    this.allInvs = Array.from(setInvs.values())
    this.allChars = Array.from(setChars.values())

    // preen starting invs from the startingThings
    this.startingInvSet = new Set<string>()
    this.startingFlagSet = new Set<string>()
    this.startingPropSet = new Set<string>()
    this.mapOfStartingThings = new Map<string, Set<string>>()
    this.directSubBoxes = new Map<string, BoxReadOnlyWithFileMethods>()

    // starting things is optional in the json
    if (
      scenario.startingThings !== undefined &&
      scenario.startingThings !== null
    ) {
      for (const thing of scenario.startingThings) {
        const theThing = Stringify(thing.thing)
        if (theThing.startsWith('inv')) {
          this.startingInvSet.add(theThing)
        }
        if (theThing.startsWith('flag')) {
          this.startingFlagSet.add(theThing)
        }
        if (theThing.startsWith('prop')) {
          this.startingPropSet.add(theThing)
        }
      }

      for (const item of scenario.startingThings) {
        if (!this.mapOfStartingThings.has(item.thing)) {
          this.mapOfStartingThings.set(item.thing, new Set<string>())
        }
        if (item.character !== undefined && item.character !== null) {
          const { character } = item
          const array = this.mapOfStartingThings.get(item.thing)
          if (character.length > 0 && array != null) {
            array.add(character)
          }
        }
      }
    }

    // starting things is optional in the json
    // do the boxs
    if (scenario.boxs !== undefined && scenario.boxs !== null) {
      for (const thing of scenario.boxs) {
        if (thing.flag !== undefined && thing.flag !== null) {
          if (thing.fileToMerge !== undefined && thing.fileToMerge !== null) {
            const box = new Box(thing.fileToMerge)

            // add to this
            this.directSubBoxes.set(thing.flag, box)
          }
        }
      }
    }
  }

  GetArrayOfSubBoxesRecursively (): BoxReadOnlyWithFileMethods[] {
    let array: BoxReadOnlyWithFileMethods[] = []
    array.push(this)
    for (const box of this.directSubBoxes.values()) {
      const arrayOfSubBoxes = box.GetArrayOfSubBoxesRecursively()
      array = array.concat(arrayOfSubBoxes)
    }
    return array
  }

  CopyStartingPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.startingPropSet) {
      givenSet.add(prop)
    }
  }

  CopyStartingFlagsToGivenSet (givenSet: Set<string>): void {
    for (const flag of this.startingFlagSet) {
      givenSet.add(flag)
    }
  }

  CopyStartingInvsToGivenSet (givenSet: Set<string>): void {
    for (const inv of this.startingInvSet) {
      givenSet.add(inv)
    }
  }

  CopyStartingThingCharsToGivenMap (givenMap: Map<string, Set<string>>): void {
    this.mapOfStartingThings.forEach((value: Set<string>, key: string) => {
      givenMap.set(key, value)
    })
  }

  CopySubBoxesToGivenMap (givenMap: Map<string, BoxReadOnlyWithFileMethods>): void {
    this.directSubBoxes.forEach((value: BoxReadOnlyWithFileMethods, key: string) => {
      givenMap.set(key, value)
    })
  }

  CopyPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.allProps) {
      givenSet.add(prop)
    }
  }

  CopyFlagsToGivenSet (givenSet: Set<string>): void {
    for (const flag of this.allFlags) {
      givenSet.add(flag)
    }
  }

  CopyInvsToGivenSet (givenSet: Set<string>): void {
    for (const inv of this.allInvs) {
      givenSet.add(inv)
    }
  }

  CopyCharsToGivenSet (givenSet: Set<string>): void {
    for (const character of this.allChars) {
      givenSet.add(character)
    }
  }

  GetArrayOfProps (): string[] {
    return this.allProps
  }

  GetArrayOfInvs (): string[] {
    return this.allInvs
  }

  GetArrayOfFlags (): string[] {
    return this.allFlags
  }

  static GetArrayOfSingleObjectVerbs (): string[] {
    return ['grab', 'toggle']
  }

  GetArrayOfSingleObjectVerbs (): string[] {
    return this.GetArrayOfSingleObjectVerbs()
  }

  static GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return [true, true]
  }

  GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs()
  }

  GetArrayOfInitialStatesOfFlags (): number[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingFlags()
    const initialStates: number[] = []
    for (const flag of this.allFlags) {
      const isNonZero = startingSet.has(flag)
      initialStates.push(isNonZero ? 1 : 0)
    }
    return initialStates
  }

  GetSetOfStartingFlags (): Set<string> {
    return this.startingFlagSet
  }

  GetSetOfStartingProps (): Set<string> {
    return this.startingPropSet
  }

  GetSetOfStartingInvs (): Set<string> {
    return this.startingInvSet
  }

  GetMapOfAllStartingThings (): Map<string, Set<string>> {
    return this.mapOfStartingThings
  }

  GetStartingThingsForCharacter (charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    this.mapOfStartingThings.forEach((value: Set<string>, thing: string) => {
      for (const item of value) {
        if (item === charName) {
          startingThingSet.add(thing)
          break
        }
      }
    })

    return startingThingSet
  }

  GetArrayOfInitialStatesOfProps (): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingProps()
    const visibilities: boolean[] = []
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop)
      visibilities.push(isVisible)
    }

    return visibilities
  }

  GetArrayOfInitialStatesOfInvs (): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingInvs()
    const visibilities: boolean[] = []
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv)
      visibilities.push(isVisible)
    }

    return visibilities
  }

  GetArrayOfCharacters (): string[] {
    return this.allChars
  }

  GetMapOfSubBoxes (): Map<string, BoxReadOnlyWithFileMethods> {
    return this.directSubBoxes
  }

  GeneratePiecesMappedByOutput (): PileOfPiecesReadOnly {
    const result = new PileOfPieces(null)
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    SingleBigSwitch(this.filename, result, notUsed)
    return result
  }

  CopyAllPiecesToGivenMap (
    givenMap: PileOfPieces
  ): PileOfPieces {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    SingleBigSwitch(this.filename, givenMap, notUsed)
    return givenMap
  }

  FindHappeningsIfAny (objects: MixedObjectsAndVerb): Happenings | null {
    const result = SingleBigSwitch(
      this.filename,
      null,
      objects
    ) as unknown as Happenings | null
    return result
  }

  GetFilename (): string {
    return this.filename
  }

  public GetNamesOfPiecesStuckToSubBoxes (): string[] {
    const array: string[] = []
    for (const key of this.directSubBoxes.keys()) {
      array.push(key)
    }
    return array
  }
}