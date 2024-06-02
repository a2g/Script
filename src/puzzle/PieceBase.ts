import { Piece } from './Piece'

/**
 * #### Description
 *  Hard to explain, but there is a need
 *
 * #### Version
 * since: V1.0.0
 * #### Example
 *
 * #### Links
 *
 *
 * Piece base
 */
export class PieceBase {
  public output: string

  public inputHints: string[]

  public inputs: Array<Piece | null>

  constructor (
    output: string
  ) {
    this.output = output
    this.inputHints = []
    this.inputs = []
  }
}
