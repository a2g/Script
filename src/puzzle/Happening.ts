import { Happen } from './Happen';
import { startsWithGoalNumber } from './startsWithGoalNumber';

/*
These are all the state changes that can occur
Possible new name: StateChangeEvent
Possible new name: StateChange
*/
export class Happening {
  public type: Happen;
  public itemA: string;
  public itemB: string;

  constructor(type: Happen, itemA: string, itemB = '') {
    if (itemA.length === 0) {
      throw new Error('item needs to be non null');
    }
    this.type = type;
    this.itemA = itemA;
    this.itemB = itemB;
    switch (type) {
      case Happen.InvGoes:
      case Happen.InvStays:
      case Happen.InvAppears:
      case Happen.InvTransitions:
        if (!itemA.startsWith('inv')) {
          console.warn(
            'Mismatch! the item (' + itemA + ') doesn"t start with "inv"'
          );
        }
        if (itemB !== '' && !itemB.startsWith('inv')) {
          console.warn(
            'Mismatch! the item (' + itemB + ') doesn"t start with "inv"'
          );
        }
        break;
      case Happen.PropGoes:
      case Happen.PropStays:
      case Happen.PropAppears:
      case Happen.PropTransitions:
        if (!itemA.startsWith('prop')) {
          console.warn(
            'Mismatch! the item (' + itemA + ') does not start with "prop"'
          );
        }
        if (itemB !== '' && !itemB.startsWith('prop')) {
          console.warn(
            'Mismatch! the item (' + itemB + ') does not start with "prop"'
          );
        }
        break;
      case Happen.GoalIsDecremented:
      case Happen.GoalIsIncremented:
      case Happen.GoalIsSet:
        if (!startsWithGoalNumber(itemA)) {
          console.warn(
            'Convention mismatch! the item (' +
              itemA +
              ') does not begin with a goal number"'
          );
        }
        break;
    }
  }
}
