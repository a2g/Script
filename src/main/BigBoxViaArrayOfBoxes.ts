import { PileOfPieces } from './PileOfPieces.js'
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js'
import { Happenings } from './Happenings.js'
import { Mix } from './Mix.js'
import { SingleBigSwitch } from './SingleBigSwitch.js'
import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods.js'
import { BoxReadOnly } from './BoxReadOnly.js'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents  *.json files,
 * in this case multiple, so that goes in there too.
 * */
export class BigBoxViaArrayOfBoxes implements BoxReadOnly {
  readonly allProps: string[]
  readonly allFlags: string[]
  readonly allInvs: string[]
  readonly allChars: string[]
  readonly mapOfStartingThingsWithChars: Map<string, Set<string>>
  readonly startingInvSet: Set<string>
  readonly startingPropSet: Set<string>
  readonly startingFlagSet: Set<string>
  readonly originalBoxes: BoxReadOnlyWithFileMethods[]
  readonly directSubBoxesMappedByKeyPiece: Map<string, BoxReadOnlyWithFileMethods>

  constructor (arrayOfBoxes: BoxReadOnlyWithFileMethods[]) {
    // we keep the original boxes, because we need to call
    // Big Switch on them numerous times
    this.originalBoxes = arrayOfBoxes

    // create sets for the 3 member and 4 indirect sets
    this.mapOfStartingThingsWithChars = new Map<string, Set<string>>()
    this.directSubBoxesMappedByKeyPiece = new Map<string, BoxReadOnlyWithFileMethods>()
    this.startingPropSet = new Set<string>()
    this.startingInvSet = new Set<string>()
    this.startingFlagSet = new Set<string>()
    const setProps = new Set<string>()
    const setFlags = new Set<string>()
    const setInvs = new Set<string>()
    const setChars = new Set<string>()

    // collate the 3 member and 4 indirect sets
    for (const box of this.originalBoxes.values()) {
      box.CopyStartingThingCharsToGivenMap(this.mapOfStartingThingsWithChars)
      box.CopySubBoxesToGivenMap(this.directSubBoxesMappedByKeyPiece)
      box.CopyStartingPropsToGivenSet(this.startingPropSet)
      box.CopyStartingInvsToGivenSet(this.startingInvSet)
      box.CopyStartingFlagsToGivenSet(this.startingFlagSet)
      box.CopyPropsToGivenSet(setProps)
      box.CopyFlagsToGivenSet(setFlags)
      box.CopyInvsToGivenSet(setInvs)
      box.CopyCharsToGivenSet(setChars)
    }

    // clean 3 member and 4 indirect sets
    this.startingPropSet.delete('')
    this.startingInvSet.delete('')
    this.mapOfStartingThingsWithChars.delete('')
    this.startingFlagSet.delete('')
    setChars.delete('')
    setProps.delete('')
    setFlags.delete('')
    setInvs.delete('')

    // finally set arrays for the four
    this.allProps = Array.from(setProps.values())
    this.allFlags = Array.from(setFlags.values())
    this.allInvs = Array.from(setInvs.values())
    this.allChars = Array.from(setChars.values())
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
    const array: number[] = []
    for (const flag of this.allFlags) {
      array.push(flag.length > 0 ? 0 : 0) // I used value.length>0 to get rid of the unused variable warnin
    }
    return array
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
    return this.mapOfStartingThingsWithChars
  }

  GetStartingThingsForCharacter (charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    this.mapOfStartingThingsWithChars.forEach(
      (value: Set<string>, thing: string) => {
        for (const item of value) {
          if (item === charName) {
            startingThingSet.add(thing)
            break
          }
        }
      }
    )

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

  GeneratePiecesMappedByOutput (): PileOfPieces {
    const solutionPiecesMappedByInput = new PileOfPieces(null)

    for (const json of this.originalBoxes) {
      const notUsed = new MixedObjectsAndVerb(
        Mix.ErrorVerbNotIdentified,
        '',
        '',
        '',
        'ScenePreAggregator'
      )
      SingleBigSwitch(json.GetFilename(), solutionPiecesMappedByInput, notUsed)
    }
    return solutionPiecesMappedByInput
  }

  FindHappeningsIfAny (objects: MixedObjectsAndVerb): Happenings | null {
    for (const json of this.originalBoxes) {
      const result = SingleBigSwitch(
        json.GetFilename(),
        null,
        objects
      ) as unknown as Happenings | null
      if (result != null) {
        return result
      }
    }
    return null
  }

  GetMapOfSubBoxes (): Map<string, BoxReadOnlyWithFileMethods> {
    return this.directSubBoxesMappedByKeyPiece
  }
}
