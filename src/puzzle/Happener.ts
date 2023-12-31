import { Command } from './Command';
import { IBoxReadOnly } from './IBoxReadOnly';

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

/*
This manages the state changes
Possible new name: StateChangManager
*/
export class Happener {
  public readonly Examine = 0;
  private readonly arrayOfInvNames: string[];

  private arrayOfInventoryVisibilities: boolean[];

  private readonly arrayOfPropNames: string[];

  private arrayOfPropVisibilities: boolean[];

  private readonly arrayOfVerbNames: string[];

  // private readonly arrayOfVerbVisibilities: boolean[];

  private readonly arrayOfGoalNames: string[];

  private arrayOfGoalValues: number[];

  // private readonly _box: IBoxReadOnly;

  //private _callbacks: IHappenerCallbacks;

  constructor(box: IBoxReadOnly) {
    // yes, all of these need to be initialized to harmless values due to PlayerAI below
    this.arrayOfInvNames = [];
    this.arrayOfGoalNames = [];
    this.arrayOfPropNames = [];
    this.arrayOfVerbNames = [];
    this.arrayOfInventoryVisibilities = [];
    this.arrayOfPropVisibilities = [];
    this.arrayOfGoalValues = [];
    //this._box = box;
    // PlayerAI needs to be initialized last, because for
    // the first parameter it passes this - and the PlayerAI
    // constructor expects a fully constructed item to be
    // passed to it.
    // this._callbacks = new PlayerAI(this, 0);

    this.arrayOfInvNames = box.GetArrayOfInvs();
    this.arrayOfGoalNames = box.GetArrayOfGoals();
    this.arrayOfPropNames = box.GetArrayOfProps();
    this.arrayOfVerbNames = box.GetArrayOfSingleObjectVerbs();
    this.arrayOfInventoryVisibilities = box.GetArrayOfInitialStatesOfInvs();
    this.arrayOfPropVisibilities = box.GetArrayOfInitialStatesOfProps();
    this.arrayOfGoalValues = box.GetArrayOfInitialStatesOfGoals();
  }

  public SetGoalValue(goal: string, value: number): void {
    const index = this.GetIndexOfGoal(goal);
    this.arrayOfGoalValues[index] = value;
  }

  public GetGoalValue(goal: string): number {
    const index = this.GetIndexOfGoal(goal);
    const toReturn: number = this.arrayOfGoalValues[index];
    return toReturn;
  }

  public SetInvVisible(inv: string, value: boolean): void {
    const index = this.GetIndexOfInv(inv);
    this.arrayOfInventoryVisibilities[index] = value;
  }

  public SetPropVisible(prop: string, value: boolean): void {
    const index = this.GetIndexOfProp(prop);
    this.arrayOfPropVisibilities[index] = value;
  }

  public ExecuteCommand(_objects: Command): void {
    /*
    const happenings = this.box.FindHappeningsIfAny(objects);
    if (happenings != null) {
      console.warn(happenings.text);
      for (const happening of happenings.array) {
        // one of these will be wrong - but we won't use the wrong one :)
        const prop = this.GetIndexOfProp(happening.item);
        const inv = this.GetIndexOfInv(happening.item);
        const goal = this.GetIndexOfGoal(happening.item);
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
            if (prop === -1) {
              throw Error('bad prop');
            }
            this.arrayOfPropVisibilities[prop] = true;
            this.callbacks.OnPropVisbilityChange(prop, true, happening.item);
            break;
          case Happen.PropGoes:
            if (prop === -1) {
              throw Error('bad prop');
            }
            this.arrayOfPropVisibilities[prop] = false;
            this.callbacks.OnPropVisbilityChange(prop, false, happening.item);
            break;
          case Happen.GoalIsDecremented:
            if (goal === -1) {
              throw Error('bad goal');
            }
            this.arrayOfGoalValues[goal] -= 1;
            this.callbacks.OnGoalValueChange(
              goal,
              this.arrayOfGoalValues[goal],
              happening.item
            );
            break;
          case Happen.GoalIsIncremented:
            if (goal === -1) {
              throw Error('bad goal');
            }
            this.arrayOfGoalValues[goal] += 1;
            this.callbacks.OnGoalValueChange(
              goal,
              this.arrayOfGoalValues[goal] + 1,
              happening.item
            );
            break;
          case Happen.GoalIsSet:
            if (goal === -1) {
              throw Error('bad goal');
            }
            this.arrayOfGoalValues[goal] = 1;
            this.callbacks.OnGoalValueChange(goal, 1, happening.item);
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

  public GetIndexOfVerb(verb: string): number {
    const indexOfVerb: number = this.arrayOfVerbNames.indexOf(verb);
    return indexOfVerb;
  }

  public GetIndexOfInv(item: string): number {
    const indexOfInv: number = this.arrayOfInvNames.indexOf(item);
    return indexOfInv;
  }

  public GetIndexOfGoal(item: string): number {
    const indexOfGoal: number = this.arrayOfGoalNames.indexOf(item);
    return indexOfGoal;
  }

  public GetIndexOfProp(item: string): number {
    const indexOfProp: number = this.arrayOfPropNames.indexOf(item);
    return indexOfProp;
  }

  public GetVerb(i: number): string {
    const name: string = i >= 0 ? this.GetVerbsExcludingUse()[i][0] : 'use';
    return name;
  }

  public GetInv(i: number): string {
    const name: string =
      i >= 0 ? this.GetEntireInvSuite()[i][0] : '-1 lookup in GetInv';
    return name;
  }

  public GetProp(i: number): string {
    const name: string =
      i >= 0 ? this.GetEntirePropSuite()[i][0] : '-1 lookup in GetProp';
    return name;
  }

  public GetGoal(i: number): string {
    const name: string =
      i >= 0 ? this.GetEntireGoalSuite()[i][0] : '-1 lookup for GetGoal';
    return name;
  }

  //public SubscribeToCallbacks(callbacks: IHappenerCallbacks): void {
  // this._callbacks = callbacks;
  //}

  public GetVerbsExcludingUse(): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = [];
    for (const verb of this.arrayOfVerbNames) {
      toReturn.push([verb, true]);
    }
    return toReturn;
  }

  public GetEntireGoalSuite(): Array<[string, number]> {
    const toReturn: Array<[string, number]> = [];
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([this.arrayOfGoalNames[i], this.arrayOfGoalValues[i]]);
    }
    return toReturn;
  }

  public GetEntirePropSuite(): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = [];
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([
        this.arrayOfPropNames[i],
        this.arrayOfPropVisibilities[i],
      ]);
    }
    return toReturn;
  }

  public GetEntireInvSuite(): Array<[string, boolean]> {
    const toReturn: Array<[string, boolean]> = [];
    for (let i = 0; i < this.arrayOfInvNames.length; i += 1) {
      // classic forloop useful because shared index
      toReturn.push([
        this.arrayOfInvNames[i],
        this.arrayOfInventoryVisibilities[i],
      ]);
    }
    return toReturn;
  }

  public GetCurrentVisibleInventory(): string[] {
    const toReturn: string[] = [];
    for (let i = 0; i < this.arrayOfInvNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfInventoryVisibilities[i]) {
        toReturn.push(this.arrayOfInvNames[i]);
      }
    }
    return toReturn;
  }

  public GetCurrentVisibleProps(): string[] {
    const toReturn: string[] = [];
    for (let i = 0; i < this.arrayOfPropNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfPropVisibilities[i]) {
        toReturn.push(this.arrayOfPropNames[i]);
      }
    }
    return toReturn;
  }

  public GetCurrentlyTrueGoals(): string[] {
    const toReturn: string[] = [];
    for (let i = 0; i < this.arrayOfGoalNames.length; i += 1) {
      // classic forloop useful because shared index
      if (this.arrayOfGoalValues[i] > 0) {
        toReturn.push(this.arrayOfGoalNames[i]);
      }
    }
    return toReturn;
  }

  public GetArrayOfInvs(): string[] {
    return this.arrayOfInvNames;
  }

  public GetArrayOfProps(): string[] {
    return this.arrayOfPropNames;
  }
}
