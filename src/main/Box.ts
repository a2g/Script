import { assert } from 'console'
import { existsSync, readFileSync } from 'fs'
import { PileOfPieces } from './PileOfPieces.js'
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb.js'
import { Happenings } from './Happenings.js'
import { Mix } from './Mix.js'
import { SingleBigSwitch } from './SingleBigSwitch.js'
import { Stringify } from './Stringify.js'
import { BoxReadOnlyWithFileMethods } from './BoxReadOnlyWithFileMethods.js'
import hjson from 'hjson'
import { PileOrRootPieceMap } from './PileOrRootPieceMap.js'
import { RootPieceMap } from './RootPieceMap.js'
import { Piece } from './Piece.js'
import { BoxReadOnly } from './BoxReadOnly.js'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.json file
 * so that's in there too.
 * */

export class Box implements BoxReadOnlyWithFileMethods {
  private readonly allProps: string[]
  private readonly allGoals: string[]
  private readonly allInvs: string[]
  private readonly allChars: string[]
  private readonly mapOfStartingThings: Map<string, Set<string>>
  private readonly startingInvSet: Set<string>
  private readonly startingPropSet: Set<string>
  private readonly startingGoalSet: Set<string>
  private readonly filename: string
  private readonly goals: RootPieceMap

  constructor (filename: string) {
    this.filename = filename
    assert(existsSync(filename))
    const text = readFileSync(filename, 'utf8')

    const scenario = hjson.parse(text)

    const setProps = new Set<string>()
    const setGoals = new Set<string>()
    const setInvs = new Set<string>()
    const setChars = new Set<string>()

    // this loop is only to ascertain all the different
    // possible object names. ie basically all the enums
    // but without needing the enum file
    for (const gate of scenario.pieces) {
      setInvs.add(Stringify(gate.inv1))
      setInvs.add(Stringify(gate.inv2))
      setInvs.add(Stringify(gate.inv3))
      setGoals.add(Stringify(gate.goal1))
      setGoals.add(Stringify(gate.goal2))
      setProps.add(Stringify(gate.prop1))
      setProps.add(Stringify(gate.prop2))
      setProps.add(Stringify(gate.prop3))
      setProps.add(Stringify(gate.prop4))
      setProps.add(Stringify(gate.prop5))
      setProps.add(Stringify(gate.prop6))
      setProps.add(Stringify(gate.prop7))
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
    setGoals.delete('')
    setGoals.delete('undefined')
    setInvs.delete('')
    setInvs.delete('undefined')

    this.allProps = Array.from(setProps.values())
    this.allGoals = Array.from(setGoals.values())
    this.allInvs = Array.from(setInvs.values())
    this.allChars = Array.from(setChars.values())

    // preen starting invs from the startingThings
    this.startingInvSet = new Set<string>()
    this.startingGoalSet = new Set<string>()
    this.startingPropSet = new Set<string>()
    this.mapOfStartingThings = new Map<string, Set<string>>()

    // this copies them to the container, and turns filenames in to boxes
    const ignore = new Set<Piece>()
    this.goals = new RootPieceMap(null, ignore)
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    SingleBigSwitch(this.filename, notUsed, true, this.goals)

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
        if (theThing.startsWith('goal')) {
          this.startingGoalSet.add(theThing)
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
  }

  public CopyPiecesFromBoxToPile (pile: PileOfPieces): void {
    const notUsed = new MixedObjectsAndVerb(
      Mix.ErrorVerbNotIdentified,
      '',
      '',
      '',
      ''
    )
    SingleBigSwitch(this.filename, notUsed, false, pile)
  }

  public FindHappeningsIfAny (objects: MixedObjectsAndVerb): Happenings | null {
    const result = SingleBigSwitch(
      this.filename,
      objects,
      false,
      null
    ) as unknown as Happenings | null
    return result
  }

  CopyStartingPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.startingPropSet) {
      givenSet.add(prop)
    }
  }

  CopyStartingGoalsToGivenSet (givenSet: Set<string>): void {
    for (const goal of this.startingGoalSet) {
      givenSet.add(goal)
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

  CopyPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.allProps) {
      givenSet.add(prop)
    }
  }

  CopyGoalsToGivenSet (givenSet: Set<string>): void {
    for (const goal of this.allGoals) {
      givenSet.add(goal)
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

  GetArrayOfGoals (): string[] {
    return this.allGoals
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

  GetArrayOfInitialStatesOfGoals (): number[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingGoals()
    const initialStates: number[] = []
    for (const goal of this.allGoals) {
      const isNonZero = startingSet.has(goal)
      initialStates.push(isNonZero ? 1 : 0)
    }
    return initialStates
  }

  GetSetOfStartingGoals (): Set<string> {
    return this.startingGoalSet
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

  GetFilename (): string {
    return this.filename
  }

  CopyGoalPiecesToAnyContainer (map: PileOrRootPieceMap): void {
    const set = new Set<Piece>()
    for (const goal of this.goals.GetValues()) {
      const clonedPiece = goal.piece.ClonePieceAndEntireTree(set)
      map.AddPiece(clonedPiece)
    }
  }

  CollectAllReferencedBoxesRecursively (set: Set<BoxReadOnly>): void {
    set.add(this)
    for (const goal of this.goals.GetValues()) {
      if (goal.piece.merge != null) {
        goal.piece.merge.CollectAllReferencedBoxesRecursively(set)
      }
    }
  }
}
