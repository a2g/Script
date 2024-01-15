import assert from 'assert'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { RootPiece } from './RootPiece'
import { SpecialTypes } from './SpecialTypes'
import { Stringify } from './Stringify'
import { VisibleThingsMap } from './VisibleThingsMap'

export class LeafToRootTraverser {
  public rootOfCopiedTree: Piece
  public currentlyVisibleThings: VisibleThingsMap

  public constructor (rootPiece: RootPiece, visibleThings: VisibleThingsMap) {
    // We can't just make the rootOfCopiedTree equal to the clone of the root,
    // we need to insert an extra level, so that it both:
    // - returns a command when the cloned root piece goes null
    // - finds a leaf at the root, and quits, the iteration after that.
    this.rootOfCopiedTree = new Piece(0, null, 'nothing', '')
    this.rootOfCopiedTree.AddChildAndSetParent(rootPiece.piece.ClonePieceAndEntireTree())
    this.currentlyVisibleThings = visibleThings
  }

  /**
   * #### For the purposes of traversing, a leaf is one with all
   * inputs are null.
   * @param piece
   * @returns true if a leaf
   */
  public isALeaf (piece: Piece): boolean {
    for (const a of piece.inputs) {
      if (a !== null) {
        return false
      }
    }
    return true
  }

  GetNextDoableCommandRecursively (piece: Piece): RawObjectsAndVerb | null {
    // if its a leaf, we check whether we can return command, otherwise
    // we recurse through children

    let areAllInputHintsInTheVisibleSet = true
    for (let i = 0; i < piece.inputHints.length; i++) {
      if (!this.currentlyVisibleThings.Has(piece.inputHints[i])) {
        areAllInputHintsInTheVisibleSet = false
      }
    }

    if (this.isALeaf(piece) && areAllInputHintsInTheVisibleSet) {
      let toReturn: RawObjectsAndVerb | null = null

      const pathOfThis = this.GeneratePath(piece)
      // const pathOfParent = this.GeneratePath(piece.parent)
      const isGrab: boolean = piece.type.toLowerCase().includes('grab')
      const isTalk: boolean = piece.type.toLowerCase().includes('talk')
      const isToggle: boolean = piece.type.toLowerCase().includes('toggle')
      const isAuto: boolean = piece.type.toLowerCase().includes('auto')
      const isUse: boolean = piece.type.toLowerCase().includes('use')
      const isOpen: boolean = piece.type.toLowerCase().includes('open')

      this.AddToMapOfVisibleThings(piece.output)

      // then we remove this key as a leaf piece..
      // by nulling its input in the parent.
      if (piece.parent != null) {
        for (let i = 0; i < piece.parent.inputHints.length; i++) {
          if (piece.parent.inputHints[i] === piece.output) {
            piece.parent.inputs[i] = null
            if (piece.parent != null) {
              piece.parent.inputs[i] = null
            }
          }
        }
      }

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
          piece.getRestrictions(),
          piece.type
        )
      } else if (piece.type === SpecialTypes.ExistsFromBeginning) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (piece.type === SpecialTypes.VerifiedLeaf) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (piece.inputs.length === 0) {
        toReturn = new RawObjectsAndVerb(
          Raw.None,
          '',
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (isGrab) {
        toReturn = new RawObjectsAndVerb(
          Raw.Grab,
          piece.inputHints[0],
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (isTalk) {
        toReturn = new RawObjectsAndVerb(
          Raw.Talk,
          piece.inputHints[0],
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (isOpen) {
        toReturn = new RawObjectsAndVerb(
          Raw.Open,
          piece.inputHints[0],
          '',
          piece.getRestrictions(),
          piece.type
        )
      } else if (isToggle) {
        toReturn = new RawObjectsAndVerb(
          Raw.Toggle,
          piece.inputHints[0],
          piece.output,
          piece.getRestrictions(),
          piece.type
        )
      } else if (isAuto) {
        console.warn(pathOfThis)
        toReturn = LeafToRootTraverser.getCommandFromAutoPiece(piece)
      } else if (isUse) {
        // then its nearly definitely 'use', unless I messed up
        toReturn = new RawObjectsAndVerb(
          Raw.Use,
          piece.inputHints[0],
          piece.inputHints[1],
          piece.getRestrictions(),
          piece.type
        )
      } else if (piece.inputs.length === 2) {
        // if they mis-type the verb, then we default to use
        toReturn = new RawObjectsAndVerb(
          Raw.Use,
          piece.inputHints[0],
          piece.inputHints[1],
          piece.getRestrictions(),
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
        const toReturn = this.GetNextDoableCommandRecursively(input)
        if (toReturn != null) {
          return toReturn
        }
      }
    }

    return null
  }

  public GetNextDoableCommandAndDeconstructTree (): RawObjectsAndVerb | null {
    if (this.rootOfCopiedTree.inputs[0] === null) {
      return null
    }
    const command = this.GetNextDoableCommandRecursively(this.rootOfCopiedTree.inputs[0])
    return command
  }

  private GeneratePath (piece: Piece | null): string {
    let path = ''
    while (piece != null) {
      const pieceOutput: string = piece.output
      path = `${pieceOutput}/${path}`
      piece = piece.GetParent()
    }
    return `/${path}`
  }

  private AddToMapOfVisibleThings (thing: string): void {
    if (!this.currentlyVisibleThings.Has(thing)) {
      this.currentlyVisibleThings.Set(thing, new Set<string>())
    }
  }

  public static getCommandFromAutoPiece (piece: Piece): RawObjectsAndVerb {
    let text = 'auto using ('
    for (const inputName of piece.inputHints) {
      const inputName2: string = inputName
      text += `${inputName2} `
    }
    console.warn(text)

    return new RawObjectsAndVerb(
      Raw.Auto,
      piece.inputHints[0],
      piece.output,
      piece.getRestrictions(),
      piece.type
    )
  }
}
