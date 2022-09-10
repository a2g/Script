import assert = require('assert')
import { SolutionNodeRepository } from 'main/SolutionNodeRepository'
import { SolutionNode } from 'main/SolutionNode'

describe('ReactionMap', () => {
  it('test AddToMap works', () => {
    const blah = new SolutionNodeRepository(null)

    // test that it is indeed null before
    const arrayBefore = blah.Get('outputA')
    assert.ok(arrayBefore === undefined)

    // do it!
    blah.AddToMap(new SolutionNode(0, 0, 'outputA', 'type', 1, null, null, 'A', 'B'))

    // test that it adds an array if the array is not yet null.
    const arrayAfter = blah.Get('outputA')
    assert.notEqual(arrayAfter, null)

    const countAfterAdding = (arrayAfter != null) ? arrayAfter.size : 0
    assert.strictEqual(countAfterAdding, 1)
  })

  it('test RemoveNode works', () => {
    const blah = new SolutionNodeRepository(null)
    for (let i = 0; i < 3; i+=1) {
      blah.AddToMap(new SolutionNode(0, 0, 'outputA', 'piffle', 1, null, null, 'A', 'B'))
    }
    const theOneToRemove = new SolutionNode(0, 0, 'outputA', 'piffle', 1, null, null, 'A', 'B')
    blah.AddToMap(theOneToRemove)
    {
      const arrayBefore = blah.Get('outputA')
      const countBeforeRemoval = (arrayBefore != null) ? arrayBefore.size : 0
      assert.strictEqual(countBeforeRemoval, 4)
    }

    blah.RemoveNode(theOneToRemove)

    {
      const arrayAfter = blah.Get('outputA')
      const countAfterRemoval = (arrayAfter != null) ? arrayAfter.size : 0
      assert.strictEqual(countAfterRemoval, 3)
    }
  })

  it('test Clone works', () => {
    // create original entries
    const array = []
    array.push(new SolutionNode(0, 0, 'blah', 'outputA', 1, null, null, 'a', 'a'))
    array.push(new SolutionNode(0, 0, 'blah', 'outputA', 1, null, null, 'b', 'b'))
    array.push(new SolutionNode(0, 0, 'blah', 'outputA', 1, null, null, 'c', 'c'))

    // put them in a map
    const tmap = new SolutionNodeRepository(null)
    array.forEach((t: SolutionNode) => {
      tmap.AddToMap(t)
    })

    // cloned the map, and modify it.
    {
      const cloned = new SolutionNodeRepository(tmap)
      const clonedOutputA = cloned.Get('outputA')

      if (clonedOutputA != null) {
        for (const item of clonedOutputA) {
          item.inputHints[0] = 'd'
        }
      }
    }

    // check the originals are still the same
    assert.strictEqual(array[0].inputHints[0], 'a')
    assert.strictEqual(array[1].inputHints[0], 'b')
    assert.strictEqual(array[2].inputHints[0], 'c')
  })
})
