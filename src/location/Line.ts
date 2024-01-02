import { Point } from './Point'

export class Line {
  public startX: number

  public startY: number

  public endX: number

  public endY: number

  public lineEndIndex: number

  public lineStartIndex: number

  constructor (
    start: Point,
    end: Point,
    lineStartIndex: number,
    lineEndIndex: number
  ) {
    this.startX = start.getX()
    this.startY = start.getY()
    this.endX = end.getX()
    this.endY = end.getY()
    this.lineStartIndex = lineStartIndex
    this.lineEndIndex = lineEndIndex
  }

  public len (): number {
    return (
      Math.sqrt((this.startX - this.endX) ** 2) + (this.startY - this.endY) ** 2
    )
  }

  public getMidPoint (): Point {
    const midPoint = new Point(
      Math.min(this.startX, this.endX) + Math.abs(this.startX - this.endX) / 2,
      Math.min(this.startY, this.endY) + Math.abs(this.startY - this.endY) / 2
    )
    // console.warn(mid_p)
    return midPoint
  }
}
