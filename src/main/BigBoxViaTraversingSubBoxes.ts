import { PileOfPieces } from './PileOfPieces.js'
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js'
import { Happenings } from './Happenings.js'
import { Mix } from './Mix.js'
import { SingleBigSwitch } from './SingleBigSwitch.js'
import { BoxReadOnly } from './BoxReadOnly.js'
import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods.js'
import { RootPieceMap } from './RootPieceMap.js'

function CollectAllBoxesRecursively(box: BoxReadOnlyWithFileMethods, map: Map<string, BoxReadOnly>): void {
  for (const keyValuePair of box.GetMapOfSubBoxes()) {
    const box: BoxReadOnly = keyValuePair[1]
    map.set(keyValuePair[0], box)
  }
}
/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents  *.json files,
 * in this case multiple, so that goes in there too.
 * */
export class BigBoxViaTraversingSubBoxes implements BoxReadOnly {
  readonly allProps: string[]
  readonly allGoals: string[]
  readonly allInvs: string[]
  readonly allChars: string[]
  readonly mapOfStartingThingsWithChars: Map<string, Set<string>>
  readonly startingInvSet: Set<string>
  readonly startingPropSet: Set<string>
  readonly startingGoalSet: Set<string>
  readonly boxesGatheredViaTraversal: Map<string, BoxReadOnlyWithFileMethods>
  readonly directSubBoxesMappedByKey: Map<string, BoxReadOnlyWithFileMethods>

  constructor(rootBox: BoxReadOnlyWithFileMethods) {
    this.boxesGatheredViaTraversal = new Map<string, BoxReadOnlyWithFileMethods>()
    CollectAllBoxesRecursively(rootBox, this.boxesGatheredViaTraversal)

    // create sets for the 3 member and 4 indirect sets
    this.mapOfStartingThingsWithChars = new Map<string, Set<string>>()
    this.directSubBoxesMappedByKey = new Map<string, BoxReadOnlyWithFileMethods>()
    this.startingPropSet = new Set<string>()
    this.startingInvSet = new Set<string>()
    this.startingGoalSet = new Set<string>()
    const setProps = new Set<string>()
    const setGoals = new Set<string>()
    const setInvs = new Set<string>()
    const setChars = new Set<string>()

    // collate the 3 member and 4 indirect sets
    for (const box of this.boxesGatheredViaTraversal.values()) {
      box.CopyStartingThingCharsToGivenMap(this.mapOfStartingThingsWithChars)
      box.CopySubBoxesToGivenMap(this.directSubBoxesMappedByKey)
      box.CopyStartingPropsToGivenSet(this.startingPropSet)
      box.CopyStartingInvsToGivenSet(this.startingInvSet)
      box.CopyStartingGoalsToGivenSet(this.startingGoalSet)
      box.CopyPropsToGivenSet(setProps)
      box.CopyGoalsToGivenSet(setGoals)
      box.CopyInvsToGivenSet(setInvs)
      box.CopyCharsToGivenSet(setChars)
    }

    // clean 3 member and 4 indirect sets
    this.startingPropSet.delete('')
    this.startingInvSet.delete('')
    this.mapOfStartingThingsWithChars.delete('')
    this.startingGoalSet.delete('')
    setChars.delete('')
    setProps.delete('')
    setGoals.delete('')
    setInvs.delete('')

    // finally set arrays for the four
    this.allProps = Array.from(setProps.values())
    this.allGoals = Array.from(setGoals.values())
    this.allInvs = Array.from(setInvs.values())
    this.allChars = Array.from(setChars.values())
  }

  GetSetOfStartingGoals(): Set<string> {
    return new Set<string>()
  }

  GetArrayOfProps(): string[] {
    return this.allProps
  }

  GetArrayOfInvs(): string[] {
    return this.allInvs
  }

  GetArrayOfGoals(): string[] {
    return this.allGoals
  }

  static GetArrayOfSingleObjectVerbs(): string[] {
    return ['grab', 'toggle']
  }

  GetArrayOfSingleObjectVerbs(): string[] {
    return this.GetArrayOfSingleObjectVerbs()
  }

  static GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return [true, true]
  }

  GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs()
  }

  GetArrayOfInitialStatesOfGoals(): number[] {
    const array: number[] = []
    for (const goal of this.allGoals) {
      array.push(goal.length > 0 ? 0 : 0)// I used value.length>0 to get rid of the unused variable warning
    };
    return array
  }

  GetSetOfStartingProps(): Set<string> {
    return this.startingPropSet
  }

  GetSetOfStartingInvs(): Set<string> {
    return this.startingInvSet
  }

  GetMapOfAllStartingThings(): Map<string, Set<string>> {
    return this.mapOfStartingThingsWithChars
  }

  GetStartingThingsForCharacter(charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    this.mapOfStartingThingsWithChars.forEach((value: Set<string>, thing: string) => {
      for (const item of value) {
        if (item === charName) {
          startingThingSet.add(thing)
          break
        }
      }
    })

    return startingThingSet
  }

  GetArrayOfInitialStatesOfProps(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingProps()
    const visibilities: boolean[] = []
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop)
      visibilities.push(isVisible)
    };

    return visibilities
  }

  GetArrayOfInitialStatesOfInvs(): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingInvs()
    const visibilities: boolean[] = []
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv)
      visibilities.push(isVisible)
    };

    return visibilities
  }

  GetArrayOfCharacters(): string[] {
    return this.allChars
  }

  GenerateSolutionPiecesMappedByInput(): PileOfPieces {
    const solutionPiecesMappedByInput = new PileOfPieces(null)

    for (const filename of this.boxesGatheredViaTraversal.keys()) {
      const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, '', '', '', 'ScenePreAggregator')
      SingleBigSwitch(filename, notUsed, false, solutionPiecesMappedByInput)
    }
    return solutionPiecesMappedByInput
  }

  FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
    for (const filename of this.boxesGatheredViaTraversal.keys()) {
      const result = SingleBigSwitch(filename, objects, false, null) as unknown as Happenings | null
      if (result != null) { return result }
    }
    return null
  }

  CopyPiecesFromBoxToPile(pile: PileOfPieces): void {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    for (const filename of this.boxesGatheredViaTraversal.keys()) {
      SingleBigSwitch(filename, notUsed, false, pile)
    }
  }

  CopyGoalPiecesToGoalMapRecursively(map: RootPieceMap): void {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    for (const filename of this.boxesGatheredViaTraversal.keys()) {
      SingleBigSwitch(filename, notUsed, true, map)
    }
  }

  GetMapOfSubBoxes(): Map<string, BoxReadOnlyWithFileMethods> {
    return this.directSubBoxesMappedByKey
  }
}
