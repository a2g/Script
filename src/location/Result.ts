import { Point } from './Point'

export class Result {
  public distance: number | undefined

  public path: Point[]

  constructor (length: number | undefined, path: Point[]) {
    this.distance = length
    this.path = path
  }
}
