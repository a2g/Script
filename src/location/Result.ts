import { Point } from './Point.js';

export class Result {
  public distance: number | undefined;

  public path: Point[];

  constructor(length: number | undefined, path: Point[]) {
    this.distance = length;
    this.path = path;
  }
}
