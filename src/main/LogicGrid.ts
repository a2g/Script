import { SingleFileData } from '../main/SingleFileData'
import { Stringify } from './Stringify'

/**
 * Logic grid (aka Elimination Grid)
 *
 * Using these as a solver in an adventure game is useful
 * because - if an object has a use at all - and you've used it
 * with some things already, then its use lies with one of the
 * things you've not used it with. This process of elimination
 * is helped using a logic grid (aka elimination grid.
 *  https://en.wikipedia.org/wiki/Logic_puzzle#Logic_grid_puzzles
 */
export class LogicGrid {
  private readonly theActualTicks: boolean[][]// 2-dimensional array

  private readonly rowAndColumnDetailsCombined: Map<number, SingleFileData>

  private readonly numberOfCellsInARow: number

  private readonly numberOfCellsInAColumn: number

  private numberOfVisibleRows: number

  private numberOfVisibleColumns: number

  public static readonly ColumnsStartHere = 1000

  private lastDebugString: string

  constructor (colNamesAndInitialVisibilities: Array<[string, boolean]>, rowNamesAndInitialVisibilities: Array<[string, boolean]>) {
    this.lastDebugString = ''
    const numberOfColumns = colNamesAndInitialVisibilities.length
    const numberOfRows = rowNamesAndInitialVisibilities.length
    this.theActualTicks = []
    for (let x = 0; x < numberOfColumns; x += 1) { // classic forloop because shared
      this.theActualTicks[x] = []
      for (let y = 0; y < numberOfRows; y += 1) { // classic forloop because shared
        this.theActualTicks[x][y] = false
      }
    }

    this.rowAndColumnDetailsCombined = new Map<number, SingleFileData>()
    this.numberOfCellsInARow = numberOfRows
    this.numberOfCellsInAColumn = numberOfColumns
    this.numberOfVisibleRows = 0
    this.numberOfVisibleColumns = 0

    let i = 0
    rowNamesAndInitialVisibilities.forEach((row) => {
      const name: string = row[0]
      const file = new SingleFileData(name, false)
      this.rowAndColumnDetailsCombined.set(i, file)

      // now after we fave set false, we call SetRowOrColumnVisibility, which keeps track of counts.
      const isVisible: boolean = row[1]
      this.SetRowOrColumnVisibility(i, isVisible)
      i += 1
    })

    i = 0
    colNamesAndInitialVisibilities.forEach((col) => {
      const name: string = col[0]
      const file = new SingleFileData(name, false)
      this.rowAndColumnDetailsCombined.set(i + LogicGrid.ColumnsStartHere, file)

      // now after we fave set false, we call SetRowOrColumnVisibility, which keeps track of counts.
      const isVisible: boolean = col[1]
      this.SetRowOrColumnVisibility(i + LogicGrid.ColumnsStartHere, isVisible)
      i += 1
    })
  }

  SetColumnRow (x: number, y: number): void {
    if (!this.theActualTicks[x][y]) {
      this.theActualTicks[x][y] = true
      const columnObject = this.rowAndColumnDetailsCombined.get(x + LogicGrid.ColumnsStartHere)
      const rowObject = this.rowAndColumnDetailsCombined.get(y)
      if (columnObject == null) { throw RangeError(`bad column ${x}`) }
      if (rowObject == null) { throw RangeError(`bad row ${y}`) }
      columnObject.tickCount += 1
      rowObject.tickCount += 1
    }
  }

  GetNumberOfCellsInARow (): number { return this.numberOfCellsInARow }

  GetNumberOfCellsInAColumn (): number { return this.numberOfCellsInAColumn }

  IsRowFullyChecked (row: number): boolean {
    const rowObject = this.rowAndColumnDetailsCombined.get(row)
    if (rowObject == null) { throw RangeError(Stringify(row)) }
    return rowObject.tickCount === this.GetNumberOfCellsInARow()
  }

  IsColumnFullyChecked (column: number): boolean {
    const col = this.rowAndColumnDetailsCombined.get(column + LogicGrid.ColumnsStartHere)
    if (col == null) { throw RangeError(`${column} + ${LogicGrid.ColumnsStartHere}`) }
    return col.tickCount === this.GetNumberOfCellsInAColumn()
  }

  GetVisibilitiesForColumnOrRow (file: number): boolean[] {
    const array: boolean[] = []
    if (file >= LogicGrid.ColumnsStartHere) {
      for (let row = 0; row < this.GetNumberOfCellsInARow(); row += 1) { // classic for because shared
        const rowObject = this.rowAndColumnDetailsCombined.get(row)
        if (rowObject == null) { throw RangeError(Stringify(row)) }
        array.push(rowObject.isVisible)
      }
    } else {
      // its actually a row
      for (let col = 0; col < this.GetNumberOfCellsInAColumn(); col += 1) { // classic forloop
        const columnObject = this.rowAndColumnDetailsCombined.get(col + LogicGrid.ColumnsStartHere)
        if (columnObject == null) { throw RangeError(Stringify(col)) }
        array.push(columnObject.isVisible)
      }
    }
    return array
  }

  GetTickArrayForColumnOrRow (file: number): boolean[] {
    const array: boolean[] = []
    if (file >= LogicGrid.ColumnsStartHere) {
      const col = file - LogicGrid.ColumnsStartHere
      for (let row = 0; row < this.GetNumberOfCellsInARow(); row += 1) { // classic forloop
        array.push(this.theActualTicks[col][row])
      }
    } else {
      // its actually a row
      const row = file
      for (let col = 0; col < this.GetNumberOfCellsInAColumn(); col += 1) { // classic forloop
        array.push(this.theActualTicks[col][row])
      }
    }
    return array
  }

  GetNextGuess (): [number, number] { // an x and a y
    const NotFound: [number, number] = [-1, -1]
    const file = this.FindMostNearlyCompleteRowOrColumnCombined()
    if (file === -1) { return NotFound }
    // const info: SingleFileData = this.rowAndColumnDetailsCombined.get(file);
    // const ticks = this.GetTickArrayForColumnOrRow(file);
    // const visibs = this.GetVisibilitiesForColumnOrRow(file);

    // check to see if its an encoded column
    if (file >= LogicGrid.ColumnsStartHere) {
      const column = file - LogicGrid.ColumnsStartHere
      for (let row = 0; row < this.GetNumberOfCellsInARow(); row += 1) { // classic forloop
        const rowObject = this.rowAndColumnDetailsCombined.get(row)
        if (rowObject == null) { throw RangeError(Stringify(row)) }
        if (rowObject.isVisible && !this.theActualTicks[column][row]) {
          return [column, row]
        }
      }
    } else {
      // its actually a row
      const row = file
      for (let col = 0; col < this.GetNumberOfCellsInAColumn(); col += 1) { // classic forloop
        const columnObject = this.rowAndColumnDetailsCombined.get(col + LogicGrid.ColumnsStartHere)
        if (columnObject == null) { throw RangeError(Stringify(col)) }
        if (columnObject.isVisible && !this.theActualTicks[col][row]) {
          // only do this is column is visible and if its not already checked
          return [col, row]
        }
      }
    }
    return NotFound
  }

  GetNumberOfCellsNeededToCompleteFile (pair: [number, SingleFileData]): number {
    const upperLimit: number = (pair[0] < LogicGrid.ColumnsStartHere) ? this.GetNumberOfVisibleCellsInARow() : this.GetNumberOfVisibleCellsInAColumn()
    return pair[1].tickCount - upperLimit
  }

  static IsColumn (index: number): boolean {
    const isColumn: boolean = index >= LogicGrid.ColumnsStartHere
    return isColumn
  }

  IsColumn (index: number): boolean {
    return this.IsColumn(index)
  }

  FindMostNearlyCompleteRowOrColumnCombined (): number {
    const listOfPairs = Array.from(this.rowAndColumnDetailsCombined.entries())
    for (let i = 0; i < listOfPairs.length; i += 1) { // classic forloop (shared)
      const pair = listOfPairs[i]
      let ticks = 0
      // count the ticks

      if (this.IsColumn(pair[0])) {
        const actualColumn = pair[0] - LogicGrid.ColumnsStartHere
        for (let row = 0; row < this.GetNumberOfCellsInARow(); row += 1) { // classic forloop because shared
          const rowObject = this.rowAndColumnDetailsCombined.get(row)
          if (rowObject == null) { throw RangeError(Stringify(row)) }
          if (rowObject.isVisible) {
            ticks += this.theActualTicks[actualColumn][row] ? 1 : 0
          }
        }
      } else {
        const actualRow = pair[0]
        for (let col = 0; col < this.GetNumberOfCellsInAColumn(); col += 1) { // classic forloop because shared
          const columnObject = this.rowAndColumnDetailsCombined.get(col + LogicGrid.ColumnsStartHere)
          if (columnObject == null) { throw RangeError(Stringify(col)) }
          if (columnObject.isVisible) { ticks += this.theActualTicks[col][actualRow] ? 1 : 0 }
        }
      }

      listOfPairs[i][1].tickCount = ticks
    };

    listOfPairs.sort((pairA, pairB) =>
      this.GetNumberOfCellsNeededToCompleteFile(pairB) - this.GetNumberOfCellsNeededToCompleteFile(pairA)
    )

    /// ...but we don't want files with zero ticks remaining, so
    ///  return the first one whose tick count hasn't reached the upper limit.
    for (const pair of listOfPairs) {
      const key = pair[0]
      const value = pair[1]

      if (value.isVisible) {
        if (this.IsColumn(key)) {
          const upperLimit = this.GetNumberOfVisibleCellsInAColumn()
          if (value.tickCount < upperLimit) { return key }
        } else {
          const upperLimit = this.GetNumberOfVisibleCellsInARow()
          if (value.tickCount < upperLimit) { return key }
        }
      }
    };

    return -1// -e means all are completed
  }

  public SetVisibilityOfRow (number: number, visibility: boolean, nameForDebugging: string): void {
    this.lastDebugString = nameForDebugging
    this.SetRowOrColumnVisibility(number, visibility)
  }

  public SetVisibilityOfColumn (number: number, visibility: boolean, nameForDebugging: string): void {
    this.lastDebugString = nameForDebugging
    this.SetRowOrColumnVisibility(number + LogicGrid.ColumnsStartHere, visibility)
  }

  private SetRowOrColumnVisibility (index: number, isVisible: boolean): void {
    const rowOrColumn = this.rowAndColumnDetailsCombined.get(index)
    if (rowOrColumn == null) { throw RangeError(Stringify(index)) }
    if (rowOrColumn != null && rowOrColumn.isVisible !== isVisible) {
      // we only change it if its actually a change, because we we want to count visibilities below
      rowOrColumn.isVisible = isVisible
      if (this.IsColumn(index)) {
        this.numberOfVisibleColumns += isVisible ? 1 : -1
      } else {
        this.numberOfVisibleRows += isVisible ? 1 : -1
      }
    }
  }

  public GetNumberOfVisibleCellsInARow (): number {
    return this.numberOfVisibleColumns
  }

  public GetNumberOfVisibleCellsInAColumn (): number {
    return this.numberOfVisibleRows
  }
}
