import assert from 'assert';
import { Piece } from './Piece';
import { Raw } from './Raw';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Solution } from './Solution';
import { SpecialTypes } from './SpecialTypes';
import { Stringify } from './Stringify';
import { VisibleThingsMap } from './VisibleThingsMap';

export class ReverseTraverser {
  public leavesForReverseTraversal: Map<string, Piece | null>;
  public currentlyVisibleThings: VisibleThingsMap;

  public constructor(
    visibleThings: VisibleThingsMap,
    leaves: Map<string, Piece | null>
  ) {
    // interestingly, leaf pieces don't get cloned
    // but it doesn't matter that much because they are just used
    // when reverse traversing a solution
    this.leavesForReverseTraversal = leaves;
    this.currentlyVisibleThings = visibleThings;
  }

  public GetNextDoableCommandAndDeconstructTree(): RawObjectsAndVerb | null {
    for (const input of this.leavesForReverseTraversal) {
      const key: string = input[0];
      const piece: Piece | null = input[1];
      let areAllInputsAvailable = true;

      if (piece != null) {
        // inputs are nearly always 2, but in one case they can be 6.. using for(;;) isn't such a useful optimizaiton here             // for (let i = 0; i < piece.inputs.length; i++) {
        for (const name of piece.inputHints) {
          if (!this.currentlyVisibleThings.Has(name)) {
            areAllInputsAvailable = false;
          }
        }

        if (areAllInputsAvailable) {
          // first we give them the output
          if (piece.type !== SpecialTypes.VerifiedLeaf) {
            this.AddToMapOfVisibleThings(piece.output);
          }
          // .. we don't remove the input, because some piece types don't remove
          // and this little algorithm doesn't know how yet

          const pathOfThis = this.GeneratePath(piece);
          const pathOfParent = this.GeneratePath(piece.parent);
          const isGrab: boolean = piece.type.toLowerCase().includes('grab');
          const isTalk: boolean = piece.type.toLowerCase().includes('talk');
          const isToggle: boolean = piece.type.toLowerCase().includes('toggle');
          const isAuto: boolean = piece.type.toLowerCase().includes('auto');
          const isUse: boolean = piece.type.toLowerCase().includes('use');
          // then we remove this key as a leaf piece..
          this.leavesForReverseTraversal.delete(key);

          // ... and add a parent in its place
          if (piece.parent != null) {
            this.leavesForReverseTraversal.set(pathOfParent, piece.parent);
          }

          if (piece.inputs.length === 0) {
            return new RawObjectsAndVerb(
              Raw.None,
              '',
              '',
              piece.getRestrictions(),
              piece.type
            );
          } else if (isGrab) {
            return new RawObjectsAndVerb(
              Raw.Grab,
              piece.inputHints[0],
              '',
              piece.getRestrictions(),
              piece.type
            );
          } else if (isTalk) {
            return new RawObjectsAndVerb(
              Raw.Talk,
              piece.inputHints[0],
              '',
              piece.getRestrictions(),
              piece.type
            );
          } else if (isToggle) {
            return new RawObjectsAndVerb(
              Raw.Toggle,
              piece.inputHints[0],
              piece.output,
              piece.getRestrictions(),
              piece.type
            );
          } else if (isAuto) {
            let text: string = 'auto using (';
            for (const inputName of piece.inputHints) {
              const inputName2: string = inputName;
              text += `${inputName2} `;
            }
            console.warn(pathOfThis);
            console.warn(text);
            return new RawObjectsAndVerb(
              Raw.Auto,
              piece.inputHints[0],
              piece.output,
              piece.getRestrictions(),
              piece.type
            );
          } else if (isUse) {
            // then its nearly definitely "use", unless I messed up
            return new RawObjectsAndVerb(
              Raw.Use,
              piece.inputHints[0],
              piece.inputHints[1],
              piece.getRestrictions(),
              piece.type
            );
          } else if (piece.inputs.length === 2) {
            // if they mis-type the verb, then we default to use
            return new RawObjectsAndVerb(
              Raw.Use,
              piece.inputHints[0],
              piece.inputHints[1],
              piece.getRestrictions(),
              piece.type
            );
          } else if (piece.parent == null) {
            // I think this means tha the root piece isn't set properly!
            // so we need to set breakpoint on this return, and debug.
            assert(false)
          } else {
            // assert(false && " type not identified");
            const maybePieceInputs1: string = Stringify(
              piece.inputs.length > 1 ? piece.inputs[0] : ''
            );
            const pieceInputs0: string = Stringify(piece.inputs[0]);
            const pieceType: string = Stringify(piece.type);
            const warning: string = `Assertion because of type not Identified!: ${pieceType} ${pieceInputs0} ${maybePieceInputs1}`;
            console.warn(warning);
          }
        }
      }
    }

    return null;
  }

  public GeneratePath(piece: Piece | null): string {
    let path = '';
    while (piece != null) {
      const pieceOutput: string = piece.output;
      path = `${pieceOutput}/${path}`;
      piece = piece.GetParent();
    }
    return `/${path}`;
  }

  /**
   * Add a piece for the reverse traversal map. It can be a verified Leaf, or just intermediate.
   * @param path the path, this is the key
   * @param piece the Piece
   */
  public AddLeafForReverseTraversal(path: string, piece: Piece): void {
    this.leavesForReverseTraversal.set(path, piece);
  }

  public UpdateMapOfVisibleThingsWithAReverseTraversal(
    solution: Solution
  ): void {
    // 21/Aug/2022 hmmn..have just come to this
    // and I'm not exactly sure how to do it with the rootpiecemap approach
    //
    // 26/Aug/2022 hmmn...this is going to get nasty.
    // in the old days, this was crude, but by simply going width first
    // we were able to get all the starting items at the end of the array.
    // Now that we have RootPieceMap, we have an extra dimension..
    // but we still
    const container = new Array<Piece>();

    // we do this width first recursively to get order from root to leaves
    for (const array of solution.GetRootMap().GetValues()) {
      for (const rootPiece of array) {
        this.CollectArrayOfPiecesInAWidthFirstRecursively(
          rootPiece.piece,
          container
        );
      }
    }

    // then we traverse the array backwards - from oldest to newest
    for (let i = container.length - 1; i >= 0; i--) {
      const piece = container[i];
      piece.UpdateVisibleWithOutcomes(this.currentlyVisibleThings);
    }
  }

  public GetLeavesForReverseTraversal(): ReadonlyMap<string, Piece | null> {
    return this.leavesForReverseTraversal;
  }

  private AddToMapOfVisibleThings(thing: string): void {
    if (!this.currentlyVisibleThings.Has(thing)) {
      this.currentlyVisibleThings.Set(thing, new Set<string>());
    }
  }

  private CollectArrayOfPiecesInAWidthFirstRecursively(
    n: Piece,
    array: Array<Piece | null>
  ): void {
    for (const input of n.inputs) {
      array.push(input);
    }

    for (const input of n.inputs) {
      if (input != null) {
        this.CollectArrayOfPiecesInAWidthFirstRecursively(input, array);
      }
    }
  }
}
