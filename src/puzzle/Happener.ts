import { Command } from './Command'
import { Box } from './Box'

// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs objs table, and inv vs inv table, and a verb vs objs table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs objs ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 3. Check the verbs vs objs ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 4. Ensure there is no OBJS VS OBJS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a logic grid per location...which is easy - and doable.hmmn.
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

/*
This manages the state changes
Possible new name: StateChangManager
*/
export class Happener {
  public readonly Examine = 0
  private readonly arrayOfInvNames: string[]

  private arrayOfInventoryVisibilities: boolean[]

  private readonly arrayOfPropNames: string[]

  private arrayOfPropVisibilities: boolean[]

  private readonly arrayOfVerbNames: string[]

  // private readonly arrayOfVerbVisibilities: boolean[];

  private readonly arrayOfAchievementNames: string[]

  private arrayOfAchievementValues: number[]

  // private readonly _box: Box;

  // private _callbacks: IHappenerCallbacks;

  constructor (box: Box) {
    // yes, all of these need to be initialized to harmless values due to PlayerAI below
    this.arrayOfInvNames = []
    this.arrayOfAchievementNames = []
    this.arrayOfPropNames = []
    this.arrayOfVerbNames = []
    this.arrayOfInventoryVisibilities = []
    this.arrayOfPropVisibilities = []
    this.arrayOfAchievementValues = []
    // this._box = box;
    // PlayerAI needs to be initialized last, because for
    // the first parameter it passes this - and the PlayerAI
    // constructor expects a fully constructed item to be
    // passed to it.
    // this._callbacks = new PlayerAI(this, 0);

    this.arrayOfInvNames = box.GetArrayOfInvs()
    this.arrayOfAchievementNames = box.GetArrayOfAchievements()
    this.arrayOfPropNames = box.GetArrayOfProps()
    this.arrayOfVerbNames = box.GetArrayOfSingleObjectVerbs()
    this.arrayOfInventoryVisibilities = box.GetArrayOfInitialStatesOfInvs()
    this.arrayOfPropVisibilities = box.GetArrayOfInitialStatesOfProps()
    this.arrayOfAchievementValues = box.GetArrayOfInitialStatesOfAchievements()
  }

  public SetAchievementValue (achievement: string, value: number): void {
    const index = this.GetIndexOfAchievement(achievement)
    this.arrayOfAchievementValues[index] = value
  }

  public GetAchievementValue (achievement: string): number {
    const index = this.GetIndexOfAchievement(achievement)
    const toReturn: number = this.arrayOfAchievementValues[index]
    return toReturn
  }

  public SetInvVisible (inv: string, value: boolean): void {
    const index = this.GetIndexOfInv(inv)
    this.arrayOfInventoryVisibilities[index] = value
  }

  public SetPropVisible (obj: string, value: boolean): void {
    const index = this.GetIndexOfProp(obj)
    this.arrayOfPropVisibilities[index] = value
  }

  public ExecuteCommand (_objects: Command): void {
    /*
    const happenings = this.box.FindHappeningsIfAny(objects);
    if (happenings != null) {
      console.warn(happenings.text);
      for (const happening of happenings.array) {
        // one of these will be wrong - but we won't use the wrong one :)
        const obj = this.GetIndexOfProp(happening.item);
        const inv = this.GetIndexOfInv(happening.item);
        const achievement = this.GetIndexOfAchievement(happening.item);
        switch (happening.happen) {
          case Happen.InvAppears:
            if (inv === -1) {
              throw Error('bad inv');
            }
            this.arrayOfInventoryVisibilities[inv] = true;
            this.callbacks.OnInvVisbilityChange(inv, true, happening.item);
            break;
          case Happen.InvGoes:
            if (inv === -1) {
              throw Error('bad inv');
            }
            this.arrayOfInventoryVisibilities[inv] = false;
            this.callbacks.OnInvVisbilityChange(inv, false, happening.item);
            break;
          case Happen.PropAppears:
            if (obj === -1) {
              throw Error('bad obj');
            }
            this.arrayOfPropVisibilities[obj] = true;
            this.callbacks.OnPropVisbilityChange(obj, true, happening.item);
            break;
          case Happen.PropGoes:
            if (obj === -1) {
              throw Error('bad obj');
            }
            this.arrayOfPropVisibilities[obj] = false;
            this.callbacks.OnPropVisbilityChange(obj, false, happening.item);
            break;
          case Happen.AchievementIsDecremented:
            if (achievement === -1) {
              throw Error('bad achievement');
            }
            this.arrayOfAchievementValues[achievement] -= 1;
            this.callbacks.OnAchievementValueChange(
              achievement,
              this.arrayOfAchievementValues[achievement],
              happening.item
            );
            break;
          case Happen.AchievementIsIncremented:
            if (achievement === -1) {
              throw Error('bad achievement');
            }
            this.arrayOfAchievementValues[achievement] += 1;
            this.callbacks.OnAchievementValueChange(
              achievement,
              this.arrayOfAchievementValues[achievement] + 1,
              happening.item
            );
            break;
          case Happen.AchievementIsSet:
            if (achievement === -1) {
              throw Error('bad achievement');
            }
            this.arrayOfAchievementValues[achievement] = 1;
            this.callbacks.OnAchievementValueChange(achievement, 1, happening.item);
            break;
          default:
            console.warn(
              'Happening happen set to something unexpected exception'
            );
        }
      }
    } else {
      console.warn('Nothing happened');
    }
    */
  }

  public GetIndexOfVerb (verb: string): number {
    const indexOfVerb: number = this.arrayOfVerbNames.indexOf(verb)
    return indexOfVerb
  }

  public GetIndexOfInv (item: string): number {
    const indexOfInv: number = this.arrayOfInvNames.indexOf(item)
    return indexOfInv
  }

  public GetIndexOfAchievement (item: string): number {
    const indexOfAchievement: number = this.arrayOfAchievementNames.indexOf(item)
    return indexOfAchievement
  }

  public GetIndexOfProp (item: string): number {
    const indexOfProp: number = this.arrayOfPropNames.indexOf(item)
    return indexOfProp
  }

  public GetVerb (i: number): string {
    const name: string = i >= 0 ? this.GetVerbsExcludingUse()[i][0] : 'use'
    return name
  }

  public GetInv (i: number): string {
    const name: string =
      i >= 0 ? this.GetEntireInvSuite()[i][0] : '-1 lookup in GetInv'
    return name
  }

  public GetProp (i: number): string {
    const name: string =
      i >= 0 ? this.GetEntirePropSuite()[i][0] : '-1 lookup in GetProp'
    return name
  }

  public GetAchievement (i: number): string {
    const name: string =
      i >= 0 ? this.GetEntireAchievementSuite()[i][0] : '-1 lookup for GetAchievement'
    return name
  }

  // public SubscribeToCallbacks(callbacks: IHappenerCallbacks): void {
  // this._callbacks = callbacks;
  // }

  public GetVerbsExcludingUse (): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = []
    for (const verb of this.arrayOfVerbNames) {
      toReturn.push([verb, true])
    }
    return toReturn
  }

  public GetEntireAchievementSuite (): Array<[string, number]> {
    const toReturn: Array<[string, number]> = []
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([this.arrayOfAchievementNames[i], this.arrayOfAchievementValues[i]])
    }
    return toReturn
  }

  public GetEntirePropSuite (): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = []
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([
        this.arrayOfPropNames[i],
        this.arrayOfPropVisibilities[i]
      ])
    }
    return toReturn
  }

  public GetEntireInvSuite (): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = []
    for (let i = 0; i < this.arrayOfInvNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([
        this.arrayOfInvNames[i],
        this.arrayOfInventoryVisibilities[i]
      ])
    }
    return toReturn
  }

  public GetCurrentVisibleInventory (): string[] {
    const toReturn: string[] = []
    for (let i = 0; i < this.arrayOfInvNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfInventoryVisibilities[i]) {
        toReturn.push(this.arrayOfInvNames[i])
      }
    }
    return toReturn
  }

  public GetCurrentVisibleProps (): string[] {
    const toReturn: string[] = []
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfPropVisibilities[i]) {
        toReturn.push(this.arrayOfPropNames[i])
      }
    }
    return toReturn
  }

  public GetCurrentlyTrueAchievements (): string[] {
    const toReturn: string[] = []
    for (let i = 0; i < this.arrayOfAchievementNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfAchievementValues[i] > 0) {
        toReturn.push(this.arrayOfAchievementNames[i])
      }
    }
    return toReturn
  }

  public GetArrayOfInvs (): string[] {
    return this.arrayOfInvNames
  }

  public GetArrayOfProps (): string[] {
    return this.arrayOfPropNames
  }
}
