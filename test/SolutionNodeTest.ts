// Typescript Unit test
import { SolutionNode } from '../src/SolutionNode'
import { SpecialNodes } from '../src/SpecialNodes'

describe('Solution', () => {
  /*
  it("Test of a none clone node", () => {
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GenerateSolutionNodesMappedByInput();
      const objective = "inv_screwdriver";
      const collection = new SolutionCollection();
      const solution = new Solution(new SolutionNode("", "", objective), map)
      collection.push(solution);
      solution.FindTheFlagWinAndPutItInRootNodeMap()
      const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

      assert.strictEqual(false, wasCloneEncountered);
      assert.strictEqual(1, collection.length);
      const solution0 = collection[0];
      assert.strictEqual(0, solution0.GetIncompleteNodes().size);
      const leafNodes = solution0.GetLeafNodes();
      assert.ok(leafNodes.has("prop_screwdriver"));
      assert.strictEqual(1, leafNodes.size);
  });

  it("Test of a non cloning five step", () => {
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GenerateSolutionNodesMappedByInput();
      const objective = "prop_death_by_guitar";
      const collection = new SolutionCollection();
      const solution = new Solution(new SolutionNode("", "", objective), map);
      collection.push(solution);
      solution.FindTheFlagWinAndPutItInRootNodeMap()
      // process the rest of the nodes
      do {
          collection.SolvePartiallyUntilCloning();
      } while (collection.IsNodesRemaining());

      const solution0 = collection[0];;
      assert.strictEqual(0, solution0.GetLeafNodes().size);
      assert.strictEqual(1, solution0.GetIncompleteNodes().size);

      {
          const leafNodeMap = solution0.GetLeafNodes();
          assert.strictEqual(5, leafNodeMap.size);
          // commenting out the things below, because they will change
          //assert.ok(leafNodeMap.has("inv_deflated_ball"));
          //assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
          //assert.ok(leafNodeMap.has("inv_needle"));
          //assert.ok(leafNodeMap.has("prop_raised_backboard"));
          //assert.ok(leafNodeMap.has("inv_pole_hook"));
      }
  });

  it("Test of another non-cloning 5 step", () => {
      const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
      const map = json.GenerateSolutionNodesMappedByInput();
      const objective = "prop_death_by_slamdunk";
      const collection = new SolutionCollection();
      collection.push(new Solution(new SolutionNode("", "", objective), map));
      // process the rest of the nodes
      do {
          collection.SolvePartiallyUntilCloning();
      } while (collection.IsNodesRemaining());

      const solution0 = collection[0];;
      assert.strictEqual(0, solution0.GetLeafNodes().size);
      assert.strictEqual(1, solution0.GetIncompleteNodes().size);

      {
          const leafNodeMap = solution0.GetLeafNodes();
          assert.strictEqual(5, leafNodeMap.size);
          // commenting out the things below, because they will change
          //assert.ok(leafNodeMap.has("inv_deflated_ball"));
          //assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
          //assert.ok(leafNodeMap.has("inv_needle"));
          //assert.ok(leafNodeMap.has("prop_raised_backboard"));
          //assert.ok(leafNodeMap.has("inv_pole_hook"));
      }
  });
*/

  it('Test cloning with High Permutation scene2', () => {
    const root = new SolutionNode(0, 0, 'root', '', 1, null, null, 'A')
    const segA = new SolutionNode(0, 0, 'A', '', 1, null, null, 'B')
    const segB = new SolutionNode(0, 0, 'B', '', 1, null, null, 'C')
    const segC = new SolutionNode(0, 0, 'C', '', 1, null, null, 'D')
    const segD = new SolutionNode(0, 0, 'D', SpecialNodes.VerifiedLeaf, 1, null, null, 'E')
    root.inputs.push(segA)
    segA.inputs.push(segB)
    segB.inputs.push(segC)
    segC.inputs.push(segD)

    root.inputHints.push('A')
    root.inputHints.push('B')
    root.inputHints.push('C')
    root.inputHints.push('B')

    // assert.strictEqual("", segC.G)
  })
})
