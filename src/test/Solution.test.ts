// Typescript Unit test
import { expect } from '@open-wc/testing'
import { SolverViaRootPiece } from '../main/SolverViaRootPiece'
import { Box } from '../main/Box'

describe('Solution', () => {
  /*
  it("Test of a none clone solution", () => {
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GeneratePiecesMappedByOutput();
      const objective = "inv_screwdriver";
      const collection = new SolutionCollection();
      const solution = new Solution(new SolutionPiece("", "", objective))
      collection.push(solution, map);
      solution.FindTheFlagWinAndPutItInRootPieceMap()
      const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

      assert.strictEqual(false, wasCloneEncountered);
      assert.strictEqual(1, collection.length);
      const solution0 = collection[0];
      assert.strictEqual(0, solution0.GetIncompletePieces().size);
      const leafPieces = solution0.GetLeafPieces();
      assert.ok(leafPieces.has("prop_screwdriver"));
      assert.strictEqual(1, leafPieces.size);
  });

  it("Test of a non cloning five step", () => {
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GeneratePiecesMappedByOutput();
      const objective = "prop_death_by_guitar";
      const collection = new SolutionCollection();
      const solution = new Solution(new SolutionPiece("", "", objective), map)
      collection.push(solution);
      solution.FindTheFlagWinAndPutItInRootPieceMap()
      // process the rest of the Pieces
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
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GeneratePiecesMappedByOutput();
      const objective = "prop_death_by_slamdunk";
      const collection = new SolutionCollection();
      const solution = new Solution(new SolutionPiece("", "", objective), map);
      collection.push(solution);
      solution.FindTheFlagWinAndPutItInRootPieceMap()
      // process the rest of the Pieces
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

  it('Solution test cloning with High Permutation scene2', () => {
    const json = new Box('./tests/TestHighPermutationSolution.json')
    const startingThings = json.GetMapOfAllStartingThings()
    const collection = new SolverViaRootPiece(startingThings)
    collection.InitializeByCopyingThese(json.GeneratePiecesMappedByOutput(), startingThings)
    const wasCloneEncountered = collection.SolvePartiallyUntilCloning()
    expect(wasCloneEncountered).to.equal(false)

    // having this actually result in a single solution is awesome.
    // we don't want too many or it will be hard to understand
    // that the multiple solutions are the same thing.
    expect(collection.GetSolutions().length).to.equal(1)
    const solution0 = collection.GetSolutions()[0]
    expect(solution0.GetMapOfRootPieces().GenerateMapOfLeaves().size).to.equal(27)
    expect(solution0.GetUnprocessedLeaves().size).to.equal(0)

    // process the rest of the Pieces
    do {
      collection.SolvePartiallyUntilCloning()
    } while (collection.IsAnyPiecesUnprocessed())

    {
      const leaves = solution0.GetMapOfRootPieces().GenerateMapOfLeaves()
      expect(leaves.size).to.equal(27)
      expect(leaves).has('/root comment 1/flag_win/inv_final_catalyst/')
      /*
      assert.ok(leaves.has('/root comment 1/flag_win/inv_final_catalyst/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item3/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item4/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item3/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_stageA/prop_dispatcher/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_stageA/prop_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_switch1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_attached_item1/prop_rigging_place1/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_attached_item1/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_switch2/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_attached_item2/prop_rigging_place2/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_attached_item2/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_switch3/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_attached_item3/prop_rigging_place3/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_attached_item3/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_switch4/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_attached_item4/prop_rigging_place4/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_attached_item4/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_switch5/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_attached_item5/prop_rigging_place5/'))
      assert.ok(leaves.has('/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_attached_item5/inv_box_of_items/'))
      */
    }
  })
})
