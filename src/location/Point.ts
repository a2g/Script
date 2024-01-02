export class Point {
  public static getMidPoint (a: Point, b: Point): Point {
    return new Point(
      a.getX() * 0.5 + b.getX() * 0.5,
      a.getY() * 0.5 + b.getY() * 0.5
    )
  }

  private x: number

  private y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  public getX (): number {
    return this.x
  }

  public getY (): number {
    return this.y
  }

  public setX (x: number): void {
    this.x = x
  }

  public setY (y: number): void {
    this.y = y
  }
}
