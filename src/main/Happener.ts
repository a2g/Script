import { PlayerAI } from '../main/PlayerAI'
import { HappenerCallbacksInterface } from '../main/HappenerCallbacksInterface'
import { MixedObjectsAndVerb } from '../main/MixedObjectsAndVerb'
import { Happen } from '../main/Happen'
import { ReadOnlyJsonInterfaceHappener } from '../main/ReadOnlyJsonInterfaceHappener'
import { ReadOnlyJsonSingle } from '../main/ReadOnlyJsonSingle'
import { assert } from 'console'

// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs props table, and inv vs inv table, and a verb vs props table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 3. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 4. Ensure there is no PROPS VS PROPS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a logic grid per location...which is easy - and doable.hmmn.
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

export class Happener {
  constructor(json: ReadOnlyJsonInterfaceHappener) {
    // yes, all of these need to be initialized to harmless values due to PlayerAI below
    this.arrayOfInvNames = new Array<string>()
    this.arrayOfFlagNames = new Array<string>()
    this.arrayOfPropNames = new Array<string>()
    this.arrayOfVerbNames = new Array<string>()
    this.arrayOfInventoryVisibilities = new Array<boolean>()
    this.arrayOfPropVisibilities = new Array<boolean>()
    this.arrayOfVerbVisibilities = new Array<boolean>()
    this.arrayOfFlagValues = new Array<number>()
    this.json = json
    // PlayerAI needs to be initialized last, because for
    // the first parameter it passes this - and the PlayerAI
    // constructor expects a fully constructed item to be
    // passed to it.
    this.callbacks = new PlayerAI(this, 0)

    this.arrayOfInvNames = json.GetArrayOfInvs()
    this.arrayOfFlagNames = json.GetArrayOfFlags()
    this.arrayOfPropNames = json.GetArrayOfProps()
    this.arrayOfVerbNames = json.GetArrayOfSingleObjectVerbs()
    this.arrayOfInventoryVisibilities = json.GetArrayOfInitialStatesOfInvs()
    this.arrayOfPropVisibilities = json.GetArrayOfInitialStatesOfProps()
    this.arrayOfVerbVisibilities = json.GetArrayOfInitialStatesOfSingleObjectVerbs()
    this.arrayOfFlagValues = json.GetArrayOfInitialStatesOfFlags()
  }

  SetFlagValue(flag: string, value: number): void {
    const index = this.GetIndexOfFlag(flag)
    this.arrayOfFlagValues[index] = value
  }

  GetFlagValue(flag: string): Number {
    const index = this.GetIndexOfFlag(flag)
    const toReturn: Number = this.arrayOfFlagValues[index]
    return toReturn
  }

  SetInvVisible(inv: string, value: boolean): void {
    const index = this.GetIndexOfInv(inv)
    this.arrayOfInventoryVisibilities[index] = value
  }

  SetPropVisible(prop: string, value: boolean): void {
    const index = this.GetIndexOfProp(prop)
    this.arrayOfPropVisibilities[index] = value
  }

  ExecuteCommand(objects: MixedObjectsAndVerb): void {
    const happenings = this.json.FindHappeningsIfAny(objects)
    if (happenings != null) {
      console.log(happenings.text)
      for (const happening of happenings.array) {
        // one of these will be wrong - but we won't use the wrong one :)
        const prop = this.GetIndexOfProp(happening.item)
        const inv = this.GetIndexOfInv(happening.item)
        const flag = this.GetIndexOfFlag(happening.item)
        switch (happening.happen) {
          case Happen.InvAppears:
            assert(inv !== -1)
            this.arrayOfInventoryVisibilities[inv] = true
            this.callbacks.OnInvVisbilityChange(inv, true, happening.item)
            break
          case Happen.InvGoes:
            assert(inv !== -1)
            this.arrayOfInventoryVisibilities[inv] = false
            this.callbacks.OnInvVisbilityChange(inv, false, happening.item)
            break
          case Happen.PropAppears:
            assert(prop !== -1)
            this.arrayOfPropVisibilities[prop] = true
            this.callbacks.OnPropVisbilityChange(prop, true, happening.item)
            break
          case Happen.PropGoes:
            assert(prop !== -1)
            this.arrayOfPropVisibilities[prop] = false
            this.callbacks.OnPropVisbilityChange(prop, false, happening.item)
            break
          case Happen.FlagIsDecremented:
            assert(flag !== -1)
            this.arrayOfFlagValues[flag] = this.arrayOfFlagValues[flag] - 1
            this.callbacks.OnFlagValueChange(flag, this.arrayOfFlagValues[flag] - 1, happening.item)
            break
          case Happen.FlagIsIncremented:
            assert(flag !== -1)
            this.arrayOfFlagValues[flag] = this.arrayOfFlagValues[flag] + 1
            this.callbacks.OnFlagValueChange(flag, this.arrayOfFlagValues[flag] + 1, happening.item)
            break
          case Happen.FlagIsSet:
            assert(flag !== -1)
            this.arrayOfFlagValues[flag] = 1
            this.callbacks.OnFlagValueChange(flag, 1, happening.item)
            break
        }
      };
    } else {
      console.log('Nothing happened')
    }
  }

  GetIndexOfVerb(verb: string): number {
    const indexOfVerb: number = this.arrayOfVerbNames.indexOf(verb)
    return indexOfVerb
  }

  GetIndexOfInv(item: string): number {
    const indexOfInv: number = this.arrayOfInvNames.indexOf(item)
    return indexOfInv
  }

  GetIndexOfFlag(item: string): number {
    const indexOfFlag: number = this.arrayOfFlagNames.indexOf(item)
    return indexOfFlag
  }

  GetIndexOfProp(item: string): number {
    const indexOfProp: number = this.arrayOfPropNames.indexOf(item)
    return indexOfProp
  }

  GetVerb(i: number): string {
    const name: string = i >= 0 ? this.GetVerbsExcludingUse()[i][0] : 'use'
    return name
  }

  GetInv(i: number): string {
    const name: string = i >= 0 ? this.GetEntireInvSuite()[i][0] : '-1 lookup in GetInv'
    return name
  }

  GetProp(i: number): string {
    const name: string = i >= 0 ? this.GetEntirePropSuite()[i][0] : '-1 lookup in GetProp'
    return name
  }

  GetFlag(i: number): string {
    const name: string = i >= 0 ? this.GetEntireFlagSuite()[i][0] : '-1 lookup for GetFlag'
    return name
  }

  SubscribeToCallbacks(callbacks: HappenerCallbacksInterface): void {
    this.callbacks = callbacks
  }

  GetVerbsExcludingUse(): Array<[string, boolean]> {
    const toReturn = new Array<[string, boolean]>()
    this.arrayOfVerbNames.forEach(function (Verb) {
      toReturn.push([Verb, true])
    })
    return toReturn
  }

  GetEntireFlagSuite(): Array<[string, Number]> {
    const toReturn = new Array<[string, Number]>()
    for (let i = 0; i < this.arrayOfPropNames.length; i++) { // classic forloop useful because shared index
      toReturn.push([this.arrayOfFlagNames[i], this.arrayOfFlagValues[i]])
    }
    return toReturn
  }

  GetEntirePropSuite(): Array<[string, boolean]> {
    const toReturn = new Array<[string, boolean]>()
    for (let i = 0; i < this.arrayOfPropNames.length; i++) { // classic forloop useful because shared index
      toReturn.push([this.arrayOfPropNames[i], this.arrayOfPropVisibilities[i]])
    }
    return toReturn
  }

  GetEntireInvSuite(): Array<[string, boolean]> {
    const toReturn = new Array<[string, boolean]>()
    for (let i = 0; i < this.arrayOfInvNames.length; i++) { // classic forloop useful because shared index
      toReturn.push([this.arrayOfInvNames[i], this.arrayOfInventoryVisibilities[i]])
    }
    return toReturn
  }

  GetCurrentVisibleInventory(): string[] {
    const toReturn = new Array<string>()
    for (let i = 0; i < this.arrayOfInvNames.length; i++) { // classic forloop useful because shared index
      if (this.arrayOfInventoryVisibilities[i]) { toReturn.push(this.arrayOfInvNames[i]) }
    }
    return toReturn
  }

  GetCurrentVisibleProps(): string[] {
    const toReturn = new Array<string>()
    for (let i = 0; i < this.arrayOfPropNames.length; i++) { // classic forloop useful because shared index
      if (this.arrayOfPropVisibilities[i]) { toReturn.push(this.arrayOfPropNames[i]) }
    }
    return toReturn
  }

  GetCurrentlyTrueFlags(): string[] {
    const toReturn = new Array<string>()
    for (let i = 0; i < this.arrayOfFlagNames.length; i++) { // classic forloop useful because shared index
      if (this.arrayOfFlagValues[i] > 0) { toReturn.push(this.arrayOfFlagNames[i]) }
    }
    return toReturn
  }

  GetArrayOfInvs(): string[] {
    return this.arrayOfInvNames
  }

  GetArrayOfProps(): string[] {
    return this.arrayOfPropNames
  }

  MergeNewThingsFromScene(json: ReadOnlyJsonSingle): void {
    const invs = json.GetArrayOfInvs()
    for (const inv of invs) {
      if (!this.arrayOfInvNames.includes(inv)) {
        // new inventories come in as false
        this.arrayOfInvNames.push(inv)
        this.arrayOfInventoryVisibilities.push(false)
      }
    }
    const props = json.GetArrayOfProps()
    const startingProps = json.GetSetOfStartingProps()
    for (const prop of props) {
      if (!this.arrayOfPropNames.includes(prop)) {
        // new inventories come in as false
        this.arrayOfPropNames.push(prop)
        this.arrayOfPropVisibilities.push(startingProps.has(prop))
      }
    }

    const flags = json.GetArrayOfFlags()
    const startingFlags = json.GetSetOfStartingFlags()
    for (const flag of flags) {
      if (!this.arrayOfFlagNames.includes(flag)) {
        // new inventories come in as false
        this.arrayOfFlagNames.push(flag)
        this.arrayOfFlagValues.push(startingFlags.has(flag) ? 1 : 0)
      }
    }
  }

  private readonly arrayOfInvNames: string[]
  private arrayOfInventoryVisibilities: boolean[]

  private readonly arrayOfPropNames: string[]
  private arrayOfPropVisibilities: boolean[]

  private readonly arrayOfVerbNames: string[]
  private readonly arrayOfVerbVisibilities: boolean[]

  private readonly arrayOfFlagNames: string[]
  private arrayOfFlagValues: number[]

  private readonly json: ReadOnlyJsonInterfaceHappener
  public readonly Examine = 0
  private callbacks: HappenerCallbacksInterface
}
