import { Happening } from './Happening';

/*
These are all the state changes that can occur
Possible new name: StateChangeCollection
Possible new name: StateChangesOfACommand
*/
export class Happenings {
  public verb: string;

  public text: string;

  public array: Happening[];

  constructor() {
    this.verb = '';
    this.text = '';
    this.array = [];
  }
}
