// Typescript Unit test

import { expect } from '@open-wc/testing';
import { Piece } from '../../../src/puzzle/Piece';
import { SpecialTypes } from '../../../src/puzzle/SpecialTypes';

describe('Solution', () => {
  it('Test of a none clone piece', () => {
    const root = new Piece(0, null, 'root', '', 1, null, null, 'A');
    const segA = new Piece(0, null, 'A', '', 1, null, null, 'B');
    const segB = new Piece(0, null, 'B', '', 1, null, null, 'C');
    const segC = new Piece(0, null, 'C', '', 1, null, null, 'D');
    const segD = new Piece(
      0,
      null,
      'D',
      SpecialTypes.VerifiedLeaf,
      1,
      null,
      null,
      'E'
    );

    const clone = root.ClonePieceAndEntireTree();
    expect('A').equals(segA.output);
    expect('B').equals(segB.output);
    expect('C').equals(segC.output);
    expect('D').equals(segD.output);
    expect('root').equals(clone.GetOutput());
    expect(null).equals(segC.GetParent());
  });
  /*
    it("Test of a non cloning five step", () => {
        const box = new SceneSingle("test/puzzle/Test1First.json");
              const pile:PileOfPieces = new PileOfPieces();
        json.CopyPiecesFromBoxToPile(pile);
        const objective = "prop_death_by_guitar";
        const collection = new SolutionCollection();
        const solution = new Solution(new Piece("", "", objective), map);
        collection.2ution);
        // process the rest of the pieces
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsPiecesRemaining());

        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafPieces().size);
        assert.strictEqual(1, solution0.GetIncompletePieces().size);

        {
            const leafPieceMap = solution0.GetLeafPieces();
            assert.strictEqual(5, leafPieceMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafPieceMap.has("inv_deflated_ball"));
            //assert.ok(leafPieceMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafPieceMap.has("inv_needle"));
            //assert.ok(leafPieceMap.has("prop_raised_backboard"));
            //assert.ok(leafPieceMap.has("inv_pole_hook"));
        }
    });

    it("Test of another non-cloning 5 step", () => {
        const box = new SceneSingle("test/puzzle/Test1First.json");
        const map = json.CopyPiecesFromBoxToPile();
        const objective = "prop_death_by_slamdunk";
        const collection = new SolutionCollection();
        collection.push(new Solution(new Piece("", "", objective), map));
        // process the rest of the pieces
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsPiecesRemaining());

        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafPieces().size);
        assert.strictEqual(1, solution0.GetIncompletePieces().size);

        {
            const leafPieceMap = solution0.GetLeafPieces();
            assert.strictEqual(5, leafPieceMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafPieceMap.has("inv_deflated_ball"));
            //assert.ok(leafPieceMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafPieceMap.has("inv_needle"));
            //assert.ok(leafPieceMap.has("prop_raised_backboard"));
            //assert.ok(leafPieceMap.has("inv_pole_hook"));
        }
    });
  */

  /*
  remember that time when I used one of the TYPES with many params, and
  it was importing inputs as blank "". A length check was added to fix it ie
  if (inputF !== 'undefined' && inputF !== undefined && inputF.length > 0) {
       A test could be added for this too.  */

  it('Test cloning with High Permutation scene2', () => {
    const root = new Piece(0, null, 'root', '', 1, null, null, 'A');
    const segA = new Piece(0, null, 'A', '', 1, null, null, 'B');
    const segB = new Piece(0, null, 'B', '', 1, null, null, 'C');
    const segC = new Piece(0, null, 'C', '', 1, null, null, 'D');
    const segD = new Piece(
      0,
      null,
      'D',
      SpecialTypes.VerifiedLeaf,
      1,
      null,
      null,
      'E'
    );
    root.inputs.push(segA);
    segA.inputs.push(segB);
    segB.inputs.push(segC);
    segC.inputs.push(segD);

    root.inputHints.push('A');
    root.inputHints.push('B');
    root.inputHints.push('C');
    root.inputHints.push('B');

    // assert.strictEqual("", segC.G)
  });
});
