import assert from 'assert'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { GoalStub } from './GoalStub'
import { SpecialTypes } from './SpecialTypes'
import { Stringify } from './Stringify'
import { TalkFile } from './talk/TalkFile'
import { VisibleThingsMap } from './VisibleThingsMap'

export class DeconstructDoer {
  public theGoalStub: GoalStub
  public currentlyVisibleThings: VisibleThingsMap
  public theSolutionsTalkFiles: Map<string, TalkFile>
  public constructor (theGoalStub: GoalStub, visibleThings: VisibleThingsMap, theSolutionsTalkFiles: Map<string, TalkFile>) {
    this.theGoalStub = theGoalStub
    this.currentlyVisibleThings = visibleThings
    this.theSolutionsTalkFiles = theSolutionsTalkFiles
  }

  // In the constructor above, we see that the root of copied tree is created
  // and the first actual jigsaw piece that is attached to it is
  // gets pushed into the zero slot of the inputs
  public IsZeroPieces (): boolean {
    return this.theGoalStub.inputs[0] == null
  }

  public GetNextDoableCommandAndDeconstructTree (remainingPieces: Map<number, Piece>): RawObjectsAndVerb | null {
    if (this.theGoalStub.inputs[0] === null) {
      return null
    }
    const command = this.GetNextDoableCommandRecursively(this.theGoalStub.inputs[0], remainingPieces)
    return command
  }

  private GetNextDoableCommandRecursively (piece: Piece, remainingPieces: Map<number, Piece>): RawObjectsAndVerb | null {
    // if its a leaf, we check whether we can return command, otherwise
    // we recurse through children

    let areAllInputHintsInTheVisibleSet = true
    for (let i = 0; i < piece.inputHints.length; i++) {
      if (!this.currentlyVisibleThings.Has(piece.inputHints[i])) {
        areAllInputHintsInTheVisibleSet = false
      }
    }

    const weOwnPiece = piece.id !== 0 && remainingPieces.has(piece.id)
    const weCanRemovePiece = weOwnPiece && this.isALeaf(piece) && areAllInputHintsInTheVisibleSet

    if (weCanRemovePiece || piece.type === SpecialTypes.CompletedElsewhere || piece.type === SpecialTypes.ExistsFromBeginning || piece.type === SpecialTypes.VerifiedLeaf) {
      // then we remove this key as a leaf piece..
      // by nulling its input in the parent.
      if (piece.parent != null) {
        for (let i = 0; i < piece.parent.inputHints.length; i++) {
          if (piece.parent.inputHints[i] === piece.output) {
            piece.parent.inputs[i] = null
            // don't blank out the input hint - its used to determine areAllInputHintsInTheVisibleSet
          }
        }
      }

      let toReturn: RawObjectsAndVerb | null = null

      // if its from our stash, then remove it from stash
      if (weCanRemovePiece) {
        remainingPieces.delete(piece.id)
      }

      // const pathOfThis = this.GeneratePath(piece)
      // const pathOfParent = this.GeneratePath(piece.parent)
      const isGrab: boolean = piece.type.toLowerCase().includes('grab')
      const isTalk: boolean = piece.type.toLowerCase().includes('talk')
      const isToggle: boolean = piece.type.toLowerCase().includes('toggle')
      const isAuto: boolean = piece.type.toLowerCase().includes('auto')
      const isUse: boolean = piece.type.toLowerCase().includes('use')
      const isOpen: boolean = piece.type.toLowerCase().includes('open')

      this.AddToMapOfVisibleThings(piece.output)

      // When we solve goals, we sometimes want the happening that result
      // from them to execute straight away. But sometimes there are
      // autos in the unused pieces pile that take the goal as input
      // so we want to dig through the pile, find them, and stub their inputs.
      // But sometimes the inputs are all nulled...Maybe in this case
      // we should not say anything is done, and simply limit our response
      // to what we've already done - ie kill the node

      // now lets return the piece
      if (piece.type === SpecialTypes.CompletedElsewhere) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (piece.type === SpecialTypes.ExistsFromBeginning) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type

        )
      } else if (piece.type === SpecialTypes.VerifiedLeaf) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (piece.inputs.length === 0) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (isGrab) {
        toReturn = new RawObjectsAndVerb(
          Raw.Grab,
          piece.inputHints[0],
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (isTalk) {
        const path = piece.GetTalkPath()
        const talkPropName = piece.inputHints[0]
        const talkState = this.theSolutionsTalkFiles.get(talkPropName + '.jsonc')
        if (talkState != null) {
          const speechLines = talkState.CollectSpeechLinesNeededToGetToPath(path)

          toReturn = new RawObjectsAndVerb(
            Raw.Talk,
            piece.inputHints[0],
            '',
            piece.output,
            piece.getRestrictions(),
            speechLines,
            piece.type
          )
        }
      } else if (isOpen) {
        toReturn = new RawObjectsAndVerb(
          Raw.Open,
          piece.inputHints[0],
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (isToggle) {
        toReturn = new RawObjectsAndVerb(
          Raw.Toggle,
          piece.inputHints[0],
          '',
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (isAuto) {
        // console.warn(pathOfThis)
        toReturn = createCommandFromAutoPiece(piece)
      } else if (isUse) {
        // then its nearly definitely 'use', unless I messed up
        toReturn = new RawObjectsAndVerb(
          Raw.Use,
          piece.inputHints[0],
          piece.inputHints[1],
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (piece.inputs.length === 2) {
        // if they mis-type the verb, then we default to use
        toReturn = new RawObjectsAndVerb(
          Raw.Use,
          piece.inputHints[0],
          piece.inputHints[1],
          piece.output,
          piece.getRestrictions(),
          [],
          piece.type
        )
      } else if (piece.parent == null) {
        // I think this means tha the root piece isn't set properly!
        // so we need to set breakpoint on this return, and debug.
        assert(false)
      } else {
        // assert(false && ' type not identified')
        const maybePieceInputs1: string = Stringify(
          piece.inputs.length > 1 ? piece.inputs[0] : ''
        )
        const pieceInputs0: string = Stringify(piece.inputs[0])
        const pieceType: string = Stringify(piece.type)
        const warning = `Assertion because of type not Identified!: ${pieceType} ${pieceInputs0} ${maybePieceInputs1}`
        console.warn(warning)
      }
      return toReturn
    }

    // else we recurse in to the children
    for (const input of piece.inputs) {
      if (input !== null) {
        const toReturn = this.GetNextDoableCommandRecursively(input, remainingPieces)
        if (toReturn != null) {
          return toReturn
        }
      }
    }

    return null
  }

  private AddToMapOfVisibleThings (thing: string): void {
    if (!this.currentlyVisibleThings.Has(thing)) {
      this.currentlyVisibleThings.Set(thing, new Set<string>())
    }
  }

  /**
   * #### For the purposes of traversing, a leaf is one with all
   * inputs are null.
   * @param piece
   * @returns true if a leaf
   */
  private isALeaf (piece: Piece): boolean {
    for (const a of piece.inputs) {
      if (a !== null) {
        return false
      }
    }
    return true
  }
}
