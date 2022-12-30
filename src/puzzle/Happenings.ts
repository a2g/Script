import { Happening } from './Happening.js';

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
